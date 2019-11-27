export interface colorsRgba {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface colorsHsva {
  h: number;
  v: number;
  s: number;
  a?: number;
}

export namespace colors {
  function rgbToHex(rgb: colorsRgba): string;
  // function rgbToString (color: colorsRgba): string;
  function hexToRgb(hex: string): colorsRgba;
  function hsvToRgb(hsv: colorsHsva) : colorsRgba;
  function rgbToHsv(rgb: colorsRgba) : colorsHsva;
  function textToRgb(color: string) : colorsRgba;
  function lighten(color: string, percent: number) : string;
  function luminosity(color: string | colorsRgba) : number;
  function setBrand(color: string, value: string, element?: Element) : void;
  function getBrand(color: string, element?: Element) : string;
}