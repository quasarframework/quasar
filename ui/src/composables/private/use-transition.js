import { computed } from 'vue'

export const useTransitionProps = {
  transitionShow: {
    type: String,
    default: 'fade'
  },

  transitionHide: {
    type: String,
    default: 'fade'
  },

  transitionDuration: {
    type: [ String, Number ],
    default: 300
  }
}

export default function (props, showing) {
  // return transition
  return {
    transition: computed(() => 'q-transition--' + (
      showing.value !== true ? props.transitionHide : props.transitionShow
    )),

    transitionStyle: computed(() => `--q-transition-duration: ${ props.transitionDuration }ms`)
  }
}
