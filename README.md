# SpringRoll Container

The `<iframe>` controller for interacting with SpringRoll applications either by [SpringRoll Connect](https://github.com/SpringRoll/SpringRollConnect) or accessing locally. The Container works both in the context of a Cordova-based application or on a webserver.

## Installation

Install with [NPM](https://www.npmjs.com/).

```bash
npm install springroll-container
```

## Usage

Basic usage for opening a SpringRoll application via a local path. This can be used to open a game with a relative or absolute (e.g. "http://...") path.

```html
<iframe id="game" scrolling="no"></iframe>
<script>
    const container = new springroll.Container({iframeSelector: "#game"});
    container.openPath("game.html");
</script>
```

### Plugins

The Container supports several built-in plugins that mirror the state features in the application/game. These are initialized with HTML elements like buttons or input sliders.

Here are some examples of the syntax for declaring plugins when creating the container. Not all (or any) plugins need to be included, only the features supported by the game.

PausePlugin, CaptionsPlugin, HelpPlugin:
```javascript
import { PausePlugin, CaptionsPlugin, HelpPlugin, Container } from 'springroll-container';

  const container = new springroll.Container({
    iframeSelector: "#game",
    plugins: [
      //all three plugins here expect an HTML Button Element and take a single selector string
      new PausePlugin('#pause-button-selector'), //Pauses or unpauses the game
      new CaptionsPlugin('#caption-button-selector'), //enables or disables captions
      new HelpPlugin('#help-button-selector'), //requests a hint or help from the game
    ]
  });
	container.openPath('game.html');
```
SoundPlugin:
```javascript
import { SoundPlugin, Container } from 'springroll-container';

  const container = new springroll.Container({
    iframeSelector: "#game",
    plugins: [
      //The SoundPlugin has 4 different audio types and can take a button(for mute/unmute) and/or an input slider(for volume control)
      new SoundPlugin({
        //Sliders expect an HTML Input Element of type="range"
        //Buttons in the SoundPlugin expect an HTML Button Element
        soundButton: '#soundButton', //mutes or unmutes all game audio
        soundSlider: '#soundSlider', //controls the game's audio volume
        musicButton: '#musicButton', //mutes or unmutes the music
        musicSlider: '#musicSlider', //controls the game's music volume
        voButton: '#voButton', //mutes or unmutes the voice over
        voSlider: '#voSlider', //controls the game's voice over volume
        sfxButton: '#sfxButton', //mutes or unmutes the game's sound effects
        sfxSlider: '#sfxSlider', //controls the game's sound effects volume
      }),
    ]
  });
	container.openPath('game.html');
```
UISizePlugin, LayersPlugin, DifficultyPlugin:
```javascript
import { UISizePlugin, LayersPlugin, DifficultyPlugin, Container } from 'springroll-container';

  const container = new springroll.Container({
    iframeSelector: "#game",
    plugins: [
      //UISizePlugin also accepts an [optional] initial value for its two options
      new UISizePlugin({
        pointerSlider: '#pointer-slider-selector', //controls the size of the pointer
        pointerSize: 0.05, //pointer size goes from 0.01 to 1.00 (2 points of precision) default = 0.05
        buttonSlider: '#button-slider-selector', //controls the size of UI buttons
        buttonSize: 0.5, // button size goes from 0.1 to 1.0 (1 point of precision) default = 0.5
      }),
      //LayersPlugin controls the progressive removal of distracting game layers. I.e. the higher the slider the more layers should be hidden from player view.
      new LayersPlugin({
        //Expects an HTML Input Element of type="range"
        layersSlider: '#layers-slider-selector' // goes from 0.00 to 1.00 (two points of precision)
      }),
      //DifficultyPlugin controls the difficulty/speed of the game.
      new DifficultyPlugin({
        //Expects an HTML Input Element of type="range"
        difficultySlider: '#difficulty-slider-selector',
        defaultDifficulty: 0.5 // goes from 0.1 to 1.0 (one points of precision). Default = 0.5
      }),
    ]
  });
	container.openPath('game.html');
```
The following plugins require an extra bit of configuration from the game application to function correctly:

HUDPlugin
```javascript
import { HUDPlugin, Container } from 'springroll-container';

  const container = new springroll.Container({
    iframeSelector: "#game",
    plugins: [
      //HUDPlugin expects a button element/selector string
      new HUDPlugin({
        hudSelectorButton: '#hud-position-button-selector' //toggles through the available HUD positions reported by the game
      }),
    ]
  });
	container.openPath('game.html');
```
*The HUDPlugin requests the supported positions directly from the game itself and builds out an internal array of positions dynamically
e.g. if the game supports ['top', 'bottom'] then the Plugin will toggle between those two options whenever the button is clicked. See [the SpringRoll Application Class docs](https://github.com/SpringRoll/SpringRoll/tree/v2/src#handling-state-change) for more information on the request format.

ControlsPlugin
```javascript
import { ControlsPlugin, Container } from 'springroll-container';

  const container = new springroll.Container({
    iframeSelector: "#game",
    plugins: [
      //ControlsPlugin also accepts an [optional] initial value for its control sensitivity
      new ControlsPlugin({
        sensitivitySlider: '#sensitivity-slider-selector',
        sensitivity: 0.5, //control sensitivity goes from 0.1 to 1.0 (1 point of precision) default = 0.5
        keyContainer: '#key-container', // container element that will contain the mappable key buttons.
      }),
    ]
  });
	container.openPath('game.html');
```
*The Key Binding functionality of the ControlsPlugin works similarly to the HUDPlugin in that it requests information from the Springroll Application. See [the SpringRoll Application Class docs](https://github.com/SpringRoll/SpringRoll/tree/v2/src#handling-state-change) for more information on the request format.

ColorVisionPlugin
```javascript
import { ColorVisionPlugin, Container } from 'springroll-container';

  const container = new springroll.Container({
    iframeSelector: "#game",
    plugins: [
      new ColorVisionPlugin({
        colorSelect: '#color-vision-dropdown-selector' //the plugin expects a <select> element
      }),
    ]
  });
	container.openPath('game.html');
```
*The color vision dropdown builds out the options dynamically based on what the application reports back. See [the SpringRoll Application Class docs](https://github.com/SpringRoll/SpringRoll/tree/v2/src#handling-state-change) for more information on the request format.

### Play Options
The `openPath` method of the Container provides a mechanism for providing options directly to the game, called
`playOptions`:

```javascript
var container = new springroll.Container('#game');
container.openPath('game.html', {
    playOptions: {
        difficulty: 7,
        theme: 'blue'
    }
});
```

In a SpringRoll Application, the Container Client Plugin [mirrors this data directly onto the object](https://github.com/SpringRoll/SpringRoll/blob/master/src/container-client/ContainerClientPlugin.js#L316).
Once the application finishes its `init` process, this data will be available directly on the application instance:

```javascript
var app = new springroll.Application({
  // various options here
});

app.on('init', function() {
  springroll.Debug.log('Play Options are', app.playOptions); // { difficulty: 7, theme: 'blue' }
});
```

Any JSON-serializable object can be set as a `playOption`.

## Documentation

[API Documentation](http://springroll.github.io/SpringRollContainer/) has full documentation for the Container.

## License

Copyright (c) 2018 [SpringRoll](http://github.com/SpringRoll)

Released under the MIT License.
