# Effects Framework

This module implements an API to interact with an effects layer on the Foundry canvas.

## Credits

Big thanks to U-Man over at [FXMaster](https://foundryvtt.com/packages/fxmaster/) for his work on implementing the core functionality used in this module! 

## How to use

You can call `canvas.effectsframework.playEffect(data)` to play an effect locally, and you can replicate this to connected clients via `game.socket.emit("module.effectsframework", data)`

The data should be in this format:

```js
{
    file: "",                   // relative file path to .webm
    position: { x: 0, y: 0 },   // coordinates on canvas
    anchor: {x: 0.0, y: 0.0 },  // video anchor, default is top left corner
    scale: { x: 1.0, y: 1.0 },  // scale of video on canvas
    rotation: 0,                // angle in radians
    speed: 0,                   // speed at which the effect will move toward
    playbackRate: 1.0           // how fast the video should be playing
}
```

## Download

`https://github.com/Haxxer/Foundry-VTT-EffectsFramework/releases/latest/download/module.json`

## Changelog

### Version 1.0.0
- Initial release
