<template>
  <quasar-modal
    ref="dialog"
    class="with-backdrop"
    position-classes="items-end justify-center"
    transition="quasar-modal-actions"
    :content-css="css"
  >
    <!-- Material -->
    <div v-once v-if="theme === 'mat'">
      <div v-if="title" class="modal-header" v-html="title"></div>

      <div class="modal-scroll">
        <div v-if="gallery" class="quasar-action-sheet-gallery row wrap items-center justify-center">
          <div
            v-for="button in actions"
            class="cursor-pointer column inline items-center justify-center"
            @click="close(button.handler)"
            :class="button.classes"
          >
            <i v-if="button.icon">{{ button.icon }}</i>
            <img v-if="button.avatar" :src="button.avatar" class="avatar">

            <span>{{ button.label }}</span>
          </div>
        </div>
        <div v-else class="list no-border">
          <div
            v-for="button in actions"
            class="item item-link"
            @click="close(button.handler)"
            :class="button.classes"
          >
            <i v-if="button.icon" class="item-primary">{{ button.icon }}</i>
            <img v-if="button.avatar" :src="button.avatar" class="item-primary">
            <div class="item-content inset">
              {{ button.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="list no-border">
        <div
          class="item item-link"
          @click="close(dismiss.handler)"
          :class="dismiss.classes"
        >
          <i v-if="dismiss.icon" class="item-primary">{{ dismiss.icon }}</i>
          <div class="item-content inset">
            {{ dismiss.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- iOS -->
    <div v-once v-if="theme === 'ios'">
      <div class="quasar-action-sheet">
        <div v-if="title" class="modal-header" v-html="title"></div>

        <div class="modal-scroll">
          <div v-if="gallery" class="quasar-action-sheet-gallery row wrap items-center justify-center">
            <div
              v-for="button in actions"
              class="cursor-pointer column inline items-center justify-center"
              @click="close(button.handler)"
              :class="button.classes"
            >
              <i v-if="button.icon">{{ button.icon }}</i>
              <img v-if="button.avatar" :src="button.avatar" class="avatar">

              <span>{{ button.label }}</span>
            </div>
          </div>
          <div v-else class="list no-border">
            <div
              v-for="button in actions"
              class="item item-link"
              @click="close(button.handler)"
              :class="button.classes"
            >
              <i v-if="button.icon" class="item-primary">{{ button.icon}}</i>
              <img v-if="button.avatar" :src="button.avatar" class="item-primary">
              <div class="item-content inset">
                {{ button.label}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="quasar-action-sheet">
        <div
          class="item item-link"
          @click="close(dismiss.handler)"
          :class="dismiss.classes"
        >
          <div class="item-content row justify-center">
            {{ dismiss.label }}
          </div>
        </div>
      </div>
    </div>
  </quasar-modal>
</template>

<script>
import { current } from '../../theme'
import Utils from '../../utils'

const modalCSS = {
  mat: {
    maxHeight: '80vh',
    height: 'auto'
  },
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    backgroundColor: 'transparent',
    boxShadow: 'none'
  }
}

export default {
  props: {
    title: String,
    gallery: Boolean,
    actions: [Array, Boolean],
    dismiss: [Object, Boolean]
  },
  data () {
    return {
      theme: current,
      css: modalCSS[current]
    }
  },
  computed: {
    opened () {
      return this.$refs.dialog.active
    },
    actionButtons () {
      return this.buttons.slice(0, this.buttons.length - 2)
    },
    dismissButton () {
      return this.buttons[this.buttons.length - 1]
    }
  },
  methods: {
    close (fn) {
      if (!this.opened) {
        return
      }
      this.$refs.dialog.close(() => {
        this.$root.$destroy()
        if (typeof fn === 'function') {
          fn()
        }
      })
    }
  },
  mounted () {
    this.$refs.dialog.open()
    this.$root.quasarClose = this.close
  },
  destroyed () {
    if (document.body.contains(this.$el)) {
      document.body.removeChild(this.$el)
    }
  }
}
</script>
