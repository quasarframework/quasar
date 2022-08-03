import { h, computed } from 'vue'

import useRatio, { useRatioProps } from '../../composables/private/use-ratio.js'

import { createComponent } from '../../utils/private/create.js'

export default createComponent({
  name: 'QVideo',

  props: {
    ...useRatioProps,

    src: {
      type: String,
      required: true
    },

    title: String,

    fetchpriority: {
      type: String,
      default: 'auto'
    },
    loading: {
      type: String,
      default: 'eager'
    },
    referrerpolicy: {
      type: String,
      default: 'strict-origin-when-cross-origin'
    }
  },

  setup (props) {
    const ratioStyle = useRatio(props)

    const classes = computed(() =>
      'q-video'
      + (props.ratio !== void 0 ? ' q-video--responsive' : '')
    )

    return () => h('div', {
      class: classes.value,
      style: ratioStyle.value
    }, [
      h('iframe', {
        src: props.src,
        title: props.title,
        fetchpriority: props.fetchpriority,
        loading: props.loading,
        referrerpolicy: props.referrerpolicy,
        frameborder: '0',
        allowfullscreen: true
      })
    ])
  }
})
