type testOptions = {
  features?: {
    webgl?: boolean;
    geolocation?: boolean;
    webworkers?: boolean;
    webaudio?: boolean;
    websockets?: boolean;
  },
  sizes?: {
    xsmall: boolean;
    small: boolean;
    medium: boolean;
    large: boolean;
    xlarge: boolean;
  }
  ui?: {
    touch: boolean;
  }
};

type gameFeatures = {
  buttonSize: boolean
  captions: boolean
  captionsStyles: boolean
  colorVision: boolean
  completionPercentage: boolean
  controlSensitivity: boolean
  dragThresholdScale: boolean
  fullScreen: boolean
  health: boolean
  hitAreaScale: boolean
  hudPosition: boolean
  inputCount: boolean
  keyBinding: boolean
  music: boolean
  musicVolume: boolean
  objectCount: boolean
  pointerSize: boolean
  removableLayers: boolean
  sfx: boolean
  sfxVolume: boolean
  sound: boolean
  soundVolume: boolean
  speedScale: boolean
  timersScale: boolean
  vo: boolean
  voVolume: boolean
}

export class Features {
  static get basic(): string;
  static get canvas(): boolean;
  static get geolocation(): boolean;
  static get info(): string;
  static get touch(): boolean;
  static get webaudio(): boolean;
  static get webgl():boolean;
  static get websockets(): boolean;
  static get webworkers(): boolean;
  static test(capabilities: testOptions): string | null;

  data: gameFeatures;
}
