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
    default () { return this.$q.i18n.monthNames }
  },
  dayNames: {
    type: Array,
    default () { return this.$q.i18n.dayNames }
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
    default () { return this.$q.i18n.clearLabel }
  },
  okLabel: {
    type: String,
    default () { return this.$q.i18n.okLabel }
  },
  cancelLabel: {
    type: String,
    default () { return this.$q.i18n.cancelLabel }
  }
}
