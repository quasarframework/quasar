import extend from '../../utils/extend'
import { between } from '../../utils/format'

export default {
  props: {
    leftSide: Object,
    rightSide: Object
  },
  data () {
    return {
      leftState: {
        opened: false,
        inTransit: false,
        position: 0,
        percentage: 0
      }
    }
  },
  computed: {
    leftConfig () {
      const conf = extend({
        breakpoint: 996
      }, this.leftSide)

      return {
        onLayout: this.layout.w > conf.breakpoint
      }
    }
  },
  methods: {
    toggleLeft () {
      if (this.leftConfig.onLayout) {
        return
      }
      const open = !this.leftState.opened
      this.leftState.opened = open
      this.leftState.percentage = open ? 1 : 0
    },
    closeSide () {
      this.leftState.opened = false
      this.leftState.percentage = 0
    },
    __openLeft (evt) {
      const position = between(evt.distance.x, 0, this.left.w)

      if (evt.isFinal) {
        const opened = position > 75
        this.leftState.opened = opened
        this.leftState.percentage = opened ? 1 : 0
        this.leftState.inTransit = false
        return
      }

      this.leftState.position = Math.min(0, position - this.left.w)
      this.leftState.percentage = between(position / this.left.w, 0, 1)

      if (evt.isFirst) {
        this.leftState.inTransit = true
      }
    },
    __closeLeft (evt) {
      if (this.leftConfig.onLayout) {
        return
      }
      const position = evt.direction === 'left'
        ? between(evt.distance.x, 0, this.left.w)
        : 0

      if (evt.isFinal) {
        const opened = Math.abs(position) <= 75
        this.leftState.opened = opened
        this.leftState.percentage = opened ? 1 : 0
        this.leftState.inTransit = false
        return
      }

      this.leftState.position = -position
      this.leftState.percentage = between(1 + position / this.left.w, 0, 1)

      if (evt.isFirst) {
        this.leftState.inTransit = true
      }
    }
  }
}
