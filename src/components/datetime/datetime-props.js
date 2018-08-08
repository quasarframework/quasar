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
  defaultValue: {
    type: [String, Number, Date],
    default: null
  },
  type: {
    type: String,
    default: 'date',
    validator: v => ['date', 'time', 'datetime'].includes(v)
  },
  color: {
    type: String,
    default: 'primary'
  },
  dark: Boolean,
  min: {
    validator: modelValidator,
    default: null
  },
  max: {
    validator: modelValidator,
    default: null
  },
  firstDayOfWeek: Number,
  formatModel: {
    type: String,
    default: 'auto',
    validator: v => ['auto', 'date', 'number', 'string'].includes(v)
  },
  format24h: {
    type: [Boolean, Number],
    default: 0,
    validator: v => [true, false, 0].includes(v)
  },
  defaultView: {
    type: String,
    validator: v => ['year', 'month', 'day', 'hour', 'minute'].includes(v)
  },
  minimal: Boolean
}

export const input = {
  format: String,
  okLabel: String,
  cancelLabel: String,
  displayValue: String
}
