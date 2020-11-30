import { computed } from 'vue'
import { useSizeProps, useSizeDefaults } from '../../composables/use-size.js'

export const useSpinnerProps = {
  ...useSizeProps,
  color: String
}

export default function useSpinner (props) {
  return {
    cSize: computed(() => props.size in useSizeDefaults
      ? `${useSizeDefaults[ props.size ]}px`
      : props.size),
    classes: computed(() => 'q-spinner' +
      (props.color ? ` text-${props.color}` : ''))
  }
}
