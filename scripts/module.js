import { EffectsLayer } from "./effects-layer.js";
import { Version } from "./version.js";

function registerLayer() {

    let mergeFunc = new Version().onOrAfter("0.8.6") ? foundry.utils.mergeObject : mergeObject;

    const layers = mergeFunc(Canvas.layers, {
        effectsFramework: EffectsLayer
    });

    Object.defineProperty(Canvas, 'layers', {
        get: function () {
            return layers
        }
    });
}

Hooks.once('init', async function() {
    registerLayer();
});
