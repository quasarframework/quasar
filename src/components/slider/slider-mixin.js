export default {
  props: {
    arrows: Boolean,
    dots: Boolean,
    fullscreen: Boolean,
    initfullscreen: Boolean,
    infinite: Boolean,
    actions: Boolean,
    animation: {
      type: Boolean,
      default: true
    },
    autoplay: [Number, Boolean]
  }
}
