export const input = {
  type: {
    type: String,
    default: 'date'
  },
  min: {
    type: String,
    default: ''
  },
  max: {
    type: String,
    default: ''
  },
  format: String,
  noClear: Boolean,
  clearLabel: {
    type: String,
    default: 'Clear'
  },
  okLabel: {
    type: String,
    default: 'Set'
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  },
  format24h: Boolean,
  defaultSelection: String,
  floatLabel: String,
  stackedLabel: String,
  placeholder: String,
  staticLabel: String,
  simple: Boolean,
  align: String,
  readonly: Boolean,
  disable: Boolean
}

export const inline = {
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'date',
    validator (value) {
      return ['date', 'time', 'datetime'].includes(value)
    }
  },
  min: {
    type: String,
    default: ''
  },
  max: {
    type: String,
    default: ''
  },
  format24h: Boolean,
  readonly: Boolean,
  disable: Boolean
}
