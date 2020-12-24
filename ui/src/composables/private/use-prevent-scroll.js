import preventScroll from '../../utils/prevent-scroll.js'

export default function () {
  let currentState

  return {
    preventBodyScroll (state) {
      if (
        state !== currentState
        && (currentState !== void 0 || state === true)
      ) {
        currentState = state
        preventScroll(state)
      }
    }
  }
}
