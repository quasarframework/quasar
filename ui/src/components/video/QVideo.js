import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'

import useVideo, { useVideoProps } from './use-video.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/video
 */
export default createComponent({
  name: 'QVideo',

  props: useVideoProps,

  setup(props) {
    const video = useVideo(props)

    return () =>
      h(
        'div',
        {
          class: video.classes.value,
          style: video.ratioStyle.value
        },
        [
          h('iframe', {
            src: props.src,
            title: props.title,
            fetchpriority: props.fetchpriority,
            loading: props.loading,
            referrerpolicy: props.referrerpolicy,
            frameborder: '0',
            allowfullscreen: true
          })
        ]
      )
  }
})
