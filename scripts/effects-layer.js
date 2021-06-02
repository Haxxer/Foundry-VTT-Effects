import { EffectsCanvasAnimation } from "./canvas-animation.js"
//import { easeFunctions } from "../module/ease.js";

export class EffectsLayer extends PlaceablesLayer {

    constructor() {
        super();

        // Listen to the socket
        game.socket.on("module.effects", (data) => {
            this.playEffect(data);
        });
    }

    static get layerOptions() {
        let level;
        if (game.settings.get("effects", "animateLayer")) {
            level = 250;
        } else {
            level = 199;
        }
        if (game.data.version === "0.7.9" || game.data.version === "0.7.10") {
            return mergeObject(super.layerOptions, {
                objectClass: Note,
                sheetClass: NoteConfig,
                canDragCreate: false,
                zIndex: 180
            });
        } else {
            return foundry.utils.mergeObject(super.layerOptions, {
                name: "effects",
                canDragCreate: false,
                zIndex: level
            });
        }
    }

    playEffect(data) {

        return new Promise((resolve, reject) => {

            // Set default values
            if (game.data.version === "0.7.9" || game.data.version === "0.7.10") {
                data = mergeObject({
                    anchor: { x: 0.5, y: 0.5 },
                    rotation: 0,
                    scale: { x: 1.0, y: 1.0 },
                    position: { x: 0, y: 0 },
                    playbackRate: 1.0,
                    ease: "Linear"
                }, data);
            } else {
                data = foundry.utils.mergeObject({
                    anchor: { x: 0.5, y: 0.5 },
                    rotation: 0,
                    scale: { x: 1.0, y: 1.0 },
                    position: { x: 0, y: 0 },
                    playbackRate: 1.0,
                    ease: "Linear"
                }, data);
            }

            // Create video
            const video = document.createElement("video");
            video.preload = "auto";
            video.crossOrigin = "anonymous";
            video.src = data.file;
            video.playbackRate = data.playbackRate;

            // Create PIXI sprite
            let vidSprite;
            video.oncanplay = () => {
                const texture = PIXI.Texture.from(video);
                vidSprite = new PIXI.Sprite(texture);
                this.addChild(vidSprite);

                // Set values
                vidSprite.anchor.set(data.anchor.x, data.anchor.y);
                vidSprite.rotation = Math.normalizeRadians(data.rotation - Math.toRadians(data.angle));
                vidSprite.scale.set(data.scale.x, data.scale.y);
                vidSprite.position.set(data.position.x, data.position.y);

                if ((!data.speed || data.speed === 0) && !data.distance) {
                    return;
                }
                if (data.distance && data.speed === "auto") {
                    data.speed = data.distance / video.duration;
                }
                // Compute final position
                const delta = video.duration * data.speed;
                const deltaX = delta * Math.cos(data.rotation)
                const deltaY = delta * Math.sin(data.rotation)

                // Move the sprite
                const attributes = [{
                    parent: vidSprite, attribute: 'x', to: data.position.x + deltaX
                }, {
                    parent: vidSprite, attribute: 'y', to: data.position.y + deltaY
                }
                ];
                let animationDuration = video.duration * 1000;
                if (hasProperty(data, "animationDelay")) {
                    animationDuration -= Math.max(0, 1000 * (data.animationDelay.end + data.animationDelay.start));
                }
                const animate = function () {
                    EffectsCanvasAnimation.animateSmooth(attributes, {
                        name: `effects.video.${randomID()}.move`,
                        context: this,
                        duration: animationDuration,
                        ease: (x) => { return x; }
                    })
                }
                if (hasProperty(data, "animationDelay.start")) {
                    setTimeout(animate, data.animationDelay.start * 1000.0);
                } else {
                    animate();
                }
            };

            video.onerror = () => {
                this.removeChild(vidSprite);
                reject();
                vidSprite.destroy();
            }

            video.onended = () => {
                this.removeChild(vidSprite);
                resolve();
                vidSprite.destroy();
            }
        })
    }

    drawSpecialToward(effect, tok1, tok2) {

        const origin = {
            x: tok1.center.x,
            y: tok1.center.y
        }

        const effectData = mergeObject(effect, {
            position: {
                x: origin.x,
                y: origin.y
            }
        });

        let ray = new Ray(tok1.center, tok2.center);
        effectData.distance = ray.distance;
        effectData.rotation = ray.angle;
        // And to other clients
        game.socket.emit('module.effects', effectData);
        // Throw effect locally
        return canvas.effects.playVideo(effectData);

    }

}