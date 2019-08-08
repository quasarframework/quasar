import { listenOpts } from '../utils/event.js'
import Platform from '../plugins/Platform.js'

let
  registered = 0,
  needReposition = false,
  scrollPosition,
  bodyTop

function onIOSScroll (e) {
  const target = e.target

  if (target === document) {
    document.scrollingElement.scrollTop = 0
    return
  }

  const { scrollTop, scrollHeight, offsetHeight } = target

  if (scrollTop <= 0 || scrollTop >= scrollHeight - offsetHeight) {
    needReposition = true
    target.classList.add('q-ios-overflow-scroll-auto')
    target.scrollTop = scrollTop <= 0 ? 1 : target.scrollHeight - target.offsetHeight - 1

    setTimeout(() => {
      target.classList.remove('q-ios-overflow-scroll-auto')
      if (needReposition === true) {
        target.scrollTop = scrollTop <= 0 ? 0 : target.scrollHeight - target.offsetHeight
        needReposition = false
      }
    }, 0)
  }
  else {
    needReposition = false
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

    Platform.is.ios === true && window.addEventListener('scroll', onIOSScroll, listenOpts.passiveCapture)
  }

  body.classList[action]('q-body--prevent-scroll')

  if (register !== true && typeof window !== 'undefined') {
    Platform.is.ios === true && window.removeEventListener('scroll', onIOSScroll, listenOpts.passiveCapture)

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
