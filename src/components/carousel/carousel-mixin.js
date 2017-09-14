export default {
  props: {
    arrows: Boolean,
    dots: Boolean,
    fullscreen: Boolean,
    infinite: Boolean,
    actions: Boolean,
    animation: {
      type: Boolean,
      default: true
    },
    easing: Function,
    swipeEasing: Function,
    duration: Number,
    handleArrowKeys: Boolean,
    autoplay: [Number, Boolean]
  }
}
