export default {
  props: {
    arrows: Boolean,
    dots: Boolean,
    fullscreen: Boolean,
    infinite: Boolean,
    actions: Boolean,
    animation: {
      type: [Number, Boolean],
      default: true
    },
    easing: Function,
    swipeEasing: Function,
    handleArrowKeys: Boolean,
    autoplay: [Number, Boolean]
  }
}
