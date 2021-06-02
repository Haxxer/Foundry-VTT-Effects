import { EffectsLayer } from "./effects-layer.js";

function registerLayer() {
    if (game.data.version === "0.7.9" || game.data.version === "0.7.10") {
        const layers = mergeObject(Canvas.layers, {
            autoanimations: EffectsLayer
        });
        Object.defineProperty(Canvas, 'layers', {
            get: function () {
                return layers
            }
        });
    } else {
        const layers = foundry.utils.mergeObject(Canvas.layers, {
            autoanimations: EffectsLayer
        });
        Object.defineProperty(Canvas, 'layers', {
            get: function () {
                return layers
            }
        });
    }
}

Hooks.once('init', async function() {

    registerLayer();

});
