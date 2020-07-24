import { SavedData } from '../SavedData';
import { ButtonPlugin } from '../base-plugins';
import { Button } from '../ui-elements';

// Private Variables
const CAPTIONS_MUTED = 'captionsMuted';

/**
 * @export
 * @class CaptionsTogglePlugin
 * @property {Button[]} _captionsButtons array of caption mute buttons
 * @property {number} captionsButtonsLength
 * @extends {ButtonPlugin}
 */
export class CaptionsTogglePlugin extends ButtonPlugin {
  /**
   *Creates an instance of CaptionsTogglePlugin.
   * @param {string | HTMLElement} captionsButtons selector string for one or more captions mute buttons
   * @memberof CaptionsTogglePlugin
   */
  constructor(captionsButtons) {
    super('Caption-Button-Plugin');
    this.sendAllProperties = this.sendAllProperties.bind(this);

    this._captionsButtons = [];

    if ( captionsButtons instanceof HTMLElement ) {
      this._captionsButtons[0] = new Button({
        button: captionsButtons,
        onClick: this.captionsButtonClick.bind(this),
        channel: 'captions'
      });
    } else {
      document.querySelectorAll(captionsButtons).forEach((button) => {
        this._captionsButtons.push(new Button({
          button: button,
          onClick: this.captionsButtonClick.bind(this),
          channel: 'captions'
        }));
      });
    }

    this._captionsMuted = false;
    this.captionsButtonLength = this._captionsButtons.length;

    if (0 >= this.captionsButtonLength) {
      this.warn(
        'Plugin was not provided any valid button or input elements'
      );
      return;
    }
  }

  /**
   * @memberof CaptionsTogglePlugin
   */
  init() {
    // Handle the features request
    this.client.on(
      'features',
      function($event) {
        for (let i = 0; i < this.captionsButtonLength; i ++) {
          this._captionsButtons[i].displayButton($event.data);
        }

        if (null === SavedData.read(CAPTIONS_MUTED)) {
          return;
        }

        this.captionsMuted = !!SavedData.read(CAPTIONS_MUTED);

      }.bind(this)
    );
  }
  /**
  * @memberof CaptionsTogglePlugin
  */
  start() {
    this.captionsMuted = !!SavedData.read(CAPTIONS_MUTED);

    this.client.on('loaded', this.sendAllProperties);
    this.client.on('loadDone', this.sendAllProperties);
  }

  /**
  *
  * Sends initial caption properties to the application
  * @memberof CaptionsTogglePlugin
  */
  sendAllProperties() {
    this.sendProperty(CAPTIONS_MUTED, this.captionsMuted);
  }

  /**
   * @memberof CaptionsTogglePlugin
   */
  captionsButtonClick() {
    this.captionsMuted = !this.captionsMuted;

    for (let i = 0; i < this.captionsButtonLength; i ++) {
      this._captionsButtons[i].button.classList.add(this.captionsMuted ? 'muted' : 'unmuted');
    }
  }

  /**
   * @readonly
   * @memberof CaptionsTogglePlugin
   */
  get captionsMuted() {
    return this._captionsMuted;
  }

  /**
   * @param {boolean} muted
   * @memberof CaptionsTogglePlugin
   */
  set captionsMuted(muted) {
    this._captionsMuted = muted;
    this._setMuteProp(
      'captionsMuted',
      this.captionsButton,
      this._captionsMuted
    );
  }
}
