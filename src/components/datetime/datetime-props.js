import {
  dayNames, monthNames
} from '../../utils/date'
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
    default: () => monthNames
  },
  dayNames: {
    type: Array,
    default: () => dayNames
  },
  mondayFirst: Boolean,
  format24h: Boolean,
  readonly: Boolean,
  disable: Boolean
}

export const input = {
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
  defaultSelection: [String, Number, Date],
  floatLabel: String,
  stackedLabel: String,
  placeholder: String,
  staticLabel: String,
  simple: Boolean,
  align: String,
  readonly: Boolean,
  disable: Boolean
}
