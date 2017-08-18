import { i18n } from '../../i18n/en'
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
  monthNames: {
    type: Array,
    default: () => i18n.monthNames
  },
  dayNames: {
    type: Array,
    default: () => i18n.dayNames
  },
  mondayFirst: Boolean,
  saturdayFirst: Boolean,
  format24h: Boolean
}

export const input = {
  format: String,
  noClear: Boolean,
  placeholder: String,
  clearLabel: {
    type: String,
    default: () => i18n.clearLabel
  },
  okLabel: {
    type: String,
    default: () => i18n.okLabel
  },
  cancelLabel: {
    type: String,
    default: () => i18n.cancelLabel
  }
}
