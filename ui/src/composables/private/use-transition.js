import { ref, computed, watch, nextTick } from 'vue'

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
  const transitionState = ref(showing.value)

  watch(showing, val => {
    nextTick(() => { transitionState.value = val })
  })

  // return transition
  return {
    transition: computed(() => 'q-transition--' + (
      transitionState.value === true ? props.transitionHide : props.transitionShow
    )),

    transitionStyle: computed(() => `--q-transition-duration: ${ props.transitionDuration }ms`)
  }
}
