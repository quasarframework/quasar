// file referenced from docs

const
  hex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/,
  hexa = /^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/,
  hexOrHexa = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  rgb = /^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/,
  rgba = /^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/

// strict = data validation
export const testPattern = {
  date: v => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v),
  dateStrict: v => /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/.test(v),
  time: v => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v),
  timeStrict: v => /^([01]?\d|2[0-3]|24(?=:00?:00?$)):([0-5]\d):([0-5]\d)$/.test(v),
  fulltime: v => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v),
  timeOrFulltime: v => /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v),

  // -- RFC 5322 --
  // -- Added in v1.18.10 --
  // This is a basic helper validation.
  // For something more complex (like RFC 822) you should write and use your own rule.
  // We won't be accepting PRs to enhance the one below because of the reason above.
  email: v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),

  hexColor: v => hex.test(v),
  hexaColor: v => hexa.test(v),
  hexOrHexaColor: v => hexOrHexa.test(v),

  rgbColor: v => rgb.test(v),
  rgbaColor: v => rgba.test(v),
  rgbOrRgbaColor: v => rgb.test(v) || rgba.test(v),

  hexOrRgbColor: v => hex.test(v) || rgb.test(v),
  hexaOrRgbaColor: v => hexa.test(v) || rgba.test(v),
  anyColor: v => hexOrHexa.test(v) || rgb.test(v) || rgba.test(v)
}

export default {
  testPattern
}
