import { h, computed } from 'vue'

import QIcon from '../icon/QIcon.js'

import useSize, { useSizeProps } from '../../composables/private/use-size.js'

import { createComponent } from '../../utils/private/create.js'
import { hMergeSlotSafely } from '../../utils/private/render.js'

export default createComponent({
  name: 'QAvatar',

  props: {
    ...useSizeProps,

    fontSize: String,

    color: String,
    textColor: String,

    icon: String,
    square: Boolean,
    rounded: Boolean
  },

  setup (props, { slots }) {
    const sizeStyle = useSize(props)

    const classes = computed(() =>
      'q-avatar'
      + (props.color ? ` bg-${ props.color }` : '')
      + (props.textColor ? ` text-${ props.textColor } q-chip--colored` : '')
      + (
        props.square === true
          ? ' q-avatar--square'
          : (props.rounded === true ? ' rounded-borders' : '')
      )
    )

    const contentStyle = computed(() => (
      props.fontSize
        ? { fontSize: props.fontSize }
        : null
    ))

    return () => {
      const icon = props.icon !== void 0
        ? [ h(QIcon, { name: props.icon }) ]
        : void 0

      return h('div', {
        class: classes.value,
        style: sizeStyle.value
      }, [
        h('div', {
          class: 'q-avatar__content row flex-center overflow-hidden',
          style: contentStyle.value
        }, hMergeSlotSafely(slots.default, icon))
      ])
    }
  }
})
