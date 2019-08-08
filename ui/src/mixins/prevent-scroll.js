import { listenOpts } from '../utils/event.js'
import Platform from '../plugins/Platform.js'

let
  registered = 0,
  needReposition = false,
  scrollPosition,
  bodyTop

function onAppleScroll (e) {
  if (e.target === document) {
    document.scrollingElement.scrollTop = 0
  }
}

function prevent (register) {
  let action = 'add'

  if (register === true) {
    registered++
    if (registered > 1) {
      return
    }
  }
  else {
    if (registered < 1) {
      return
    }
    registered--
    action = 'remove'
  }

  const body = document.body

  if (register === true && typeof window !== 'undefined') {
    scrollPosition = window.pageYOffset || window.scrollY || body.scrollTop || 0
    bodyTop = body.style.top

    body.style.top = `-${scrollPosition}px`
    body.scrollHeight > window.innerHeight && body.classList.add('q-body--force-scrollbar')

    Platform.is.ios === true && window.addEventListener('scroll', onAppleScroll, listenOpts.passiveCapture)
  }

  body.classList[action]('q-body--prevent-scroll')

  if (register !== true && typeof window !== 'undefined') {
    Platform.is.ios === true && window.removeEventListener('scroll', onAppleScroll, listenOpts.passiveCapture)

    body.classList.remove('q-body--force-scrollbar')
    body.style.top = bodyTop
    window.scrollTo(0, scrollPosition)
  }
}

export default {
  methods: {
    __preventScroll (state) {
      if (this.preventedScroll === void 0 && state !== true) {
        return
      }

      if (state !== this.preventedScroll) {
        this.preventedScroll = state
        prevent(state)
      }
    }
  }
}
