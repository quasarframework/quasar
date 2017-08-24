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
    handleArrowKeys: Boolean,
    autoplay: [Number, Boolean]
  }
}
