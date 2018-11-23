export const testPattern = {
  date: v => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v),
  time: v => /^[0-2]?\d:[0-5]\d$/.test(v),
  fulltime: v => /^[0-2]?\d:[0-5]\d:[0-5]\d$/.test(v),
  timeOrFulltime: v => /^[0-2]?\d:[0-5]\d(:[0-5]\d)?$/.test(v),

  hexcolor: v => /^#[0-9a-fA-F]{6}$/.test(v),
  hexacolor: v => /^#[0-9a-fA-F]{8}$/.test(v)
}

export default {
  testPattern
}
