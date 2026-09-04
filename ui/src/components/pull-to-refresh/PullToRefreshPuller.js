import { h } from 'vue'

import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'

import { createComponent } from '../../utils/private.create/create.js'

/**
 * We are using a sub-component so that the per-move updates of a pull
 * (position, ratio, state) re-render the puller alone and not the
 * QPullToRefresh content.
 */
export default /*#__PURE__*/ createComponent({
  props: ['store', 'side', 'color', 'bgColor', 'icon'],

  setup(props) {
    return () => {
      const { store, side } = props
      // the puller travels (and spins) away from the side it pulls from
      const opacity = store.pullRatio.value
      const transform =
        `translate${side === 'left' || side === 'right' ? 'X' : 'Y'}` +
        `(${(side === 'bottom' || side === 'right' ? -1 : 1) * store.pullPosition.value}px)` +
        ` rotate(${opacity * 360}deg)`

      return h(
        'div',
        {
          class:
            'q-pull-to-refresh__puller-container fixed row flex-center no-pointer-events z-top',
          style: store.positionCSS.value
        },
        [
          h(
            'div',
            {
              class:
                'q-pull-to-refresh__puller row flex-center' +
                (store.animating.value
                  ? ' q-pull-to-refresh__puller--animating'
                  : '') +
                (props.bgColor !== void 0 ? ` bg-${props.bgColor}` : ''),
              style: {
                opacity,
                transform
              }
            },
            [
              store.state.value !== 'refreshing'
                ? h(QIcon, {
                    name: props.icon,
                    color: props.color,
                    size: '32px'
                  })
                : h(QSpinner, {
                    size: '24px',
                    color: props.color
                  })
            ]
          )
        ]
      )
    }
  }
})
