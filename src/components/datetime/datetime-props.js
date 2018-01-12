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
  },
  defaultView: {
    type: String,
    validator: v => ['year', 'month', 'day', 'hour', 'minute'].includes(v)
  }
}

export const input = {
  format: String,
  placeholder: String,
  clearable: Boolean,
  okLabel: String,
  cancelLabel: String,
  defaultSelection: [String, Number, Date],
  displayValue: String,
  disable: Boolean,
  readonly: Boolean
}
