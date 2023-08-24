import { computed } from 'vue'
import { useSizeDefaults } from '../../composables/private/use-size.js'

export const useSpinnerProps = {
  size: {
    type: [ Number, String ],
    default: '1em'
  },
  color: String
}

export default function useSpinner (props) {
  return {
    cSize: computed(() => (
      props.size in useSizeDefaults
        ? `${ useSizeDefaults[ props.size ] }px`
        : props.size
    )),

    classes: computed(() =>
      'q-spinner' + (props.color ? ` text-${ props.color }` : '')
    )
  }
}
