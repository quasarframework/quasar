// file referenced from docs

const hexRE = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/,
  hexaRE = /^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/,
  hexOrHexaRE =
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  rgbRE =
    /^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/,
  rgbaRE =
    /^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0(\.[\d]+)?|1(\.0+)?)\)$/,
  dateRE = /^-?[\d]+\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/,
  timeRE = /^([0-1]?\d|2[0-3]):[0-5]\d$/,
  fulltimeRE = /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/,
  timeOrFulltimeRE = /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
  emailRE =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Keep in sync with ui/types/api/validation.d.ts
export const testPattern = {
  date: v => dateRE.test(v),
  time: v => timeRE.test(v),
  fulltime: v => fulltimeRE.test(v),
  timeOrFulltime: v => timeOrFulltimeRE.test(v),

  // -- RFC 5322 --
  // -- Added in v2.6.6 --
  // This is a basic helper validation.
  // For something more complex (like RFC 822) you should write and use your own rule.
  // We won't be accepting PRs to enhance the one below because of the reason above.
  email: v => emailRE.test(v),

  hexColor: v => hexRE.test(v),
  hexaColor: v => hexaRE.test(v),
  hexOrHexaColor: v => hexOrHexaRE.test(v),

  rgbColor: v => rgbRE.test(v),
  rgbaColor: v => rgbaRE.test(v),
  rgbOrRgbaColor: v => rgbRE.test(v) || rgbaRE.test(v),

  hexOrRgbColor: v => hexRE.test(v) || rgbRE.test(v),
  hexaOrRgbaColor: v => hexaRE.test(v) || rgbaRE.test(v),
  anyColor: v => hexOrHexaRE.test(v) || rgbRE.test(v) || rgbaRE.test(v)
}

export default {
  testPattern
}
