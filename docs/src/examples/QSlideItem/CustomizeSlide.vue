<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered separator>
      <q-slide-item
        :left-color="leftColor"
        :right-color="rightColor"
        @left="onLeft"
        @right="onRight"
        @slide="onSlide"
      >
        <template v-slot:left>
          Left
        </template>
        <template v-slot:right>
          Right content.. long
        </template>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar6.jpg" draggable="false">
            </q-avatar>
          </q-item-section>
          <q-item-section>Text only</q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slideRatio: {
        left: 0,
        right: 0
      }
    }
  },

  computed: {
    leftColor () {
      return this.slideRatio.left >= 1
        ? 'red-10'
        : 'red-' + (3 + Math.round(Math.min(3, this.slideRatio.left * 3)))
    },

    rightColor () {
      return this.slideRatio.right >= 1
        ? 'green-10'
        : 'green-' + (3 + Math.round(Math.min(3, this.slideRatio.right * 3)))
    }
  },

  methods: {
    onLeft ({ reset }) {
      this.$q.notify('Left action triggered. Resetting in 1 second.')
      this.finalize(reset)
    },

    onRight ({ reset }) {
      this.$q.notify('Right action triggered. Resetting in 1 second.')
      this.finalize(reset)
    },

    onSlide ({ side, ratio, isReset }) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slideRatio[side] = ratio
      }, isReset === true ? 200 : void 0)
    },

    finalize (reset) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        reset()
      }, 1000)
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
