import { computed } from 'vue'

import useRatio, {
  useRatioProps
} from '../../composables/private.use-ratio/use-ratio.js'

export const useVideoProps = {
  ...useRatioProps,

  /**
   * The source url to display in an iframe
   *
   * @api prop src
   * @type {String}
   * @required
   * @category content
   * @example 'https://www.youtube.com/embed/k3_tw44QsZQ'
   */
  src: {
    type: String,
    required: true
  },

  /**
   * The iframe title attribute
   *
   * @api prop title
   * @type {String}
   * @category content
   * @example 'Quasar video'
   */
  title: String,

  /**
   * Provides a hint of the relative priority to use when fetching the iframe source
   *
   * @api prop fetchpriority
   * @type {String}
   * @default 'auto'
   * @category behavior
   * @value 'auto'
   * @value 'high'
   * @value 'low'
   */
  fetchpriority: {
    type: String,
    default: 'auto'
  },

  /**
   * Indicates how the browser should load the iframe
   *
   * @api prop loading
   * @type {String}
   * @default 'eager'
   * @category behavior
   * @value 'eager'
   * @value 'lazy'
   */
  loading: {
    type: String,
    default: 'eager'
  },

  /**
   * Referrer policy to use when fetching the iframe source
   *
   * @api prop referrerpolicy
   * @type {String}
   * @default 'strict-origin-when-cross-origin'
   * @category behavior
   */
  referrerpolicy: {
    type: String,
    default: 'strict-origin-when-cross-origin'
  }
}

export default function useVideo(props) {
  const ratioStyle = useRatio(props)

  const classes = computed(
    () => 'q-video' + (props.ratio !== void 0 ? ' q-video--responsive' : '')
  )

  return {
    classes,
    ratioStyle
  }
}
