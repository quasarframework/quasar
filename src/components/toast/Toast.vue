<template>
  <div
    class="q-toast-container"
    :class="{active: active}"
  >
    <div
      class="q-toast row no-wrap items-center non-selectable"
      v-if="stack[0]"
      :style="{color: stack[0].color, background: stack[0].bgColor}"
      :class="classes"
    >
      <q-icon v-if="stack[0].icon" :name="stack[0].icon"></q-icon>
      <img v-if="stack[0].image" :src="stack[0].image">

      <div class="q-toast-message col" v-html="stack[0].html"></div>

      <a
        v-if="stack[0].button && stack[0].button.label"
        @click="dismiss(stack[0].button.handler)"
        :style="{color: stack[0].button.color}"
      >
        {{ stack[0].button.label }}
      </a>

      <a
        @click="dismiss()"
        :style="{color: stack[0].button.color}"
      >
        <q-icon name="close"></q-icon>
      </a>
    </div>
  </div>
</template>

<script>
import Events from '../../features/events'
import extend from '../../utils/extend'
import { QIcon } from '../icon'

let
  transitionDuration = 300, // in ms
  displayDuration = 2500 // in ms

function parseOptions (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  let options = extend(
    true,
    {},
    defaults,
    typeof opts === 'string' ? {html: opts} : opts
  )

  if (!options.html) {
    throw new Error('Missing toast content/HTML.')
  }

  return options
}

export default {
  name: 'q-toast',
  components: {
    QIcon
  },
  data () {
    return {
      active: false,
      inTransition: false,
      stack: [],
      timer: null,
      defaults: {
        color: 'white',
        bgColor: '#323232',
        button: {
          color: 'inherit'
        }
      }
    }
  },
  computed: {
    classes () {
      if (!this.stack.length || !this.stack[0].classes) {
        return {}
      }

      return this.stack[0].classes.split(' ')
    }
  },
  methods: {
    create (options) {
      this.stack.push(parseOptions(options, this.defaults))

      if (this.active || this.inTransition) {
        return
      }

      this.activeTimer = setTimeout(() => {
        this.active = true
      }, 10)
      this.inTransition = true

      this.__show()
    },
    __show () {
      Events.$emit('app:toast', this.stack[0].html)

      this.timer = setTimeout(() => {
        if (this.stack.length > 0) {
          this.dismiss()
        }
        else {
          this.inTransition = false
        }
      }, transitionDuration + (this.stack[0].timeout || displayDuration))
    },
    dismiss (done) {
      clearTimeout(this.timer)
      clearTimeout(this.activeTimer)
      this.active = false
      this.timer = null

      setTimeout(() => {
        if (typeof this.stack[0].onDismiss === 'function') {
          this.stack[0].onDismiss()
        }

        this.stack.shift()
        done && done()

        if (this.stack.length > 0) {
          this.active = true
          this.__show()
          return
        }

        this.inTransition = false
      }, transitionDuration + 50)
    },
    setDefaults (opts) {
      extend(true, this.defaults, opts)
    }
  }
}
</script>
