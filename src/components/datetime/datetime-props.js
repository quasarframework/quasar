import { isDate } from '../../utils/is'

export const modelValidator = v => {
  const type = typeof v
  return (
    v === null || v === undefined ||
    type === 'number' || type === 'string' ||
    isDate(v)
  )
}

export const inline = {
  value: {
    validator: modelValidator,
    required: true
  },
  type: {
    type: String,
    default: 'date',
    validator (value) {
      return ['date', 'time', 'datetime'].includes(value)
    }
  },
  color: {
    type: String,
    default: 'primary'
  },
  min: {
    validator: modelValidator,
    default: null
  },
  max: {
    validator: modelValidator,
    default: null
  },
  firstDayOfWeek: Number,
  format24h: {
    type: [Boolean, Number],
    default: 0,
    validator: v => [true, false, 0].includes(v)
  }
}

export const input = {
  format: String,
  noClear: Boolean,
  placeholder: String,
  clearLabel: String,
  okLabel: String,
  cancelLabel: String
}
