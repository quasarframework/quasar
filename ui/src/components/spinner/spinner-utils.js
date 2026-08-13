import { useSizeDefaults } from '../../composables/private.use-size/use-size.js'

export const useSpinnerProps = {
  size: {
    type: [String, Number],
    default: '1em'
  },
  color: String
}

export function getSpinnerSize(size) {
  return size in useSizeDefaults ? `${useSizeDefaults[size]}px` : size
}

export function getSpinnerClass(color) {
  return 'q-spinner' + (color ? ` text-${color}` : '')
}
