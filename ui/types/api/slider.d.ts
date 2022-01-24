// Keep in sync with ui/src/components/slider/use-slider.js

// --- Props

import { VueClassProp } from '../ts-helpers'

interface SliderMarkerLabelPartialDefinition {
  label?: number | string;
  classes?: VueClassProp;
  style?: Partial<CSSStyleDeclaration>;
}

interface SliderMarkerLabelDefinition extends SliderMarkerLabelPartialDefinition {
  value?: number;
}

interface SliderMarkerLabelDefinitionRequiredValue extends SliderMarkerLabelPartialDefinition {
  value: number;
}

interface SliderMarkerLabelObjectDefinition {
  [value: number]: string | SliderMarkerLabelDefinition;
}

export type SliderMarkerLabels =
  | boolean
  | Array<SliderMarkerLabelDefinitionRequiredValue>
  | SliderMarkerLabelObjectDefinition
  | ((value: number) => string | SliderMarkerLabelDefinition)

// --- Slots

export type SliderMarkerLabelConfig = {
  index: number;
  value: number;
  label: number | string;
  classes: string;
  style: Partial<CSSStyleDeclaration>
};

export type SliderMarkerLabelArrayConfig = SliderMarkerLabelConfig[];

export interface SliderMarkerLabelObjectConfig {
  [value: number]: SliderMarkerLabelConfig;
}
