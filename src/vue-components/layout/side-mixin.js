import { between } from '../../utils/format'

export default {
  props: {
    leftSide: Object,
    rightSide: Object
  },
  data () {
    return {
      leftState: {
        openedSmall: false,
        openedBig: true,

        inTransit: false,
        position: 0,
        percentage: 0
      }
    }
  },
  computed: {
    leftBreakpoint () {
      const breakpoint = this.leftSide ? this.leftSide.breakpoint : 996
      return !this.leftState.openedSmall && this.layout.w >= (breakpoint || 996)
    },
    leftOnLayout () {
      return this.leftBreakpoint && this.leftState.openedBig
    },
    leftBackdrop () {
      return this.leftState.inTransit || this.leftState.openedSmall
    }
  },
  methods: {
    toggleLeft () {
      if (this.leftState.openedSmall || (this.leftBreakpoint && this.leftState.openedBig)) {
        this.closeSide()
      }
      else {
        this.openLeft()
      }
    },
    closeSide () {
      if (this.leftState.openedSmall) {
        this.leftState.openedSmall = false
        this.leftState.percentage = 0
      }
      else {
        this.leftState.openedBig = false
      }
    },
    openLeft () {
      if (this.leftBreakpoint) {
        this.leftState.openedBig = true
      }
      else {
        this.leftState.openedSmall = true
        this.leftState.percentage = 1
      }
    },
    __openLeft (evt) {
      const position = between(evt.distance.x, 0, this.left.w)

      if (evt.isFinal) {
        const opened = position > 75
        this.leftState.openedSmall = opened
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
      if (this.leftState.openedBig) {
        return
      }
      const position = evt.direction === 'left'
        ? between(evt.distance.x, 0, this.left.w)
        : 0

      if (evt.isFinal) {
        const opened = Math.abs(position) <= 75
        this.leftState.openedSmall = opened
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
