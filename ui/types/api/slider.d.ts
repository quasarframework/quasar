// Keep in sync with ui/src/components/slider/use-slider.js

// --- Props

interface SliderMarkerLabelPartialDefinition {
  label?: number | string;
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

declare function SliderMarkerLabelFunctionDefinition(
  value: number
): string | SliderMarkerLabelDefinition;

export type SliderMarkerLabels =
  | boolean
  | Array<SliderMarkerLabelDefinitionRequiredValue>
  | SliderMarkerLabelObjectDefinition
  | typeof SliderMarkerLabelFunctionDefinition

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
