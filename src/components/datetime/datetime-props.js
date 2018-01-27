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
    validator: v => ['date', 'time', 'datetime'].includes(v)
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
  formatModel: {
    type: String,
    default: 'auto',
    validator: v => ['auto', 'date', 'number', 'string'].includes(v)
  },
  format24h: {
    type: [String],
    validator: v => ['', '12h', '24h', 'i18n'].includes(v)
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
  defaultSelection: {
    type: [String, Number, Date],
    default: null
  },
  displayValue: String,
  disable: Boolean,
  readonly: Boolean
}
