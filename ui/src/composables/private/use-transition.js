import { ref, computed, watch, nextTick } from 'vue'

export const useTransitionProps = {
  transitionShow: {
    type: String,
    default: 'fade'
  },

  transitionHide: {
    type: String,
    default: 'fade'
  }
}

export default function (props, showing) {
  const transitionState = ref(showing.value)

  watch(showing, val => {
    nextTick(() => { transitionState.value = val })
  })

  // return transition
  return computed(() => 'q-transition--' + (
    transitionState.value === true ? props.transitionHide : props.transitionShow
  ))
}
