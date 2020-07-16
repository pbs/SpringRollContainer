import { SliderPlugin } from '../base-plugins';

type LayersPluginOptions = {
  defaultValue?: number | string;
};

export class LayersPlugin extends SliderPlugin {
  constructor(layersSliders?: string| HTMLElement, options: LayersPluginOptions)

  onLayerValueChange(e: Event): void;
  init(): void;

  get LayerValueKey(): string;

}
