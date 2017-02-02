<template>
  <q-modal
    ref="dialog"
    position="bottom"
    :content-css="contentCss"
    @close="__dismiss()"
  >
    <!-- Material -->
    <div v-once v-if="$q.theme === 'mat'">
      <div v-if="title" class="modal-header" v-html="title"></div>

      <div class="modal-scroll">
        <div v-if="gallery" class="q-action-sheet-gallery row wrap items-center justify-center">
          <div
            v-for="button in actions"
            class="cursor-pointer column inline items-center justify-center"
            @click="close(button.handler)"
            @keydown.enter="close(button.handler)"
            :class="button.classes"
            tabindex="0"
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
            @keydown.enter="close(button.handler)"
            :class="button.classes"
            tabindex="0"
          >
            <i v-if="button.icon" class="item-primary">{{ button.icon }}</i>
            <img v-if="button.avatar" :src="button.avatar" class="item-primary">
            <div class="item-content inset">
              {{ button.label }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="dismiss" class="list no-border">
        <div
          class="item item-link"
          @click="close()"
          @keydown.enter="close()"
          :class="dismiss.classes"
          tabindex="0"
        >
          <i v-if="dismiss.icon" class="item-primary">{{ dismiss.icon }}</i>
          <div class="item-content inset">
            {{ dismiss.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- iOS -->
    <div v-once v-if="$q.theme === 'ios'">
      <div class="q-action-sheet">
        <div v-if="title" class="modal-header" v-html="title"></div>

        <div class="modal-scroll">
          <div v-if="gallery" class="q-action-sheet-gallery row wrap items-center justify-center">
            <div
              v-for="button in actions"
              class="cursor-pointer column inline items-center justify-center"
              @click="close(button.handler)"
              @keydown.enter="close(button.handler)"
              :class="button.classes"
              tabindex="0"
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
              @keydown.enter="close(button.handler)"
              :class="button.classes"
              tabindex="0"
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

      <div v-if="dismiss" class="q-action-sheet">
        <div
          class="item item-link"
          @click="close()"
          @keydown.enter="close()"
          :class="dismiss.classes"
          tabindex="0"
        >
          <div class="item-content row justify-center">
            {{ dismiss.label }}
          </div>
        </div>
      </div>
    </div>
  </q-modal>
</template>

<script>
export default {
  props: {
    title: String,
    gallery: Boolean,
    actions: {
      type: Array,
      required: true
    },
    dismiss: Object
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
    },
    contentCss () {
      if (this.$q.theme === 'ios') {
        return {backgroundColor: 'transparent'}
      }
    }
  },
  methods: {
    close (fn) {
      if (!this.opened) {
        return
      }
      const hasFn = typeof fn === 'function'

      if (hasFn) {
        this.__runCancelHandler = false
      }
      this.$refs.dialog.close(() => {
        if (hasFn) {
          fn()
        }
      })
    },
    __dismiss () {
      this.$root.$destroy()
      if (this.__runCancelHandler && this.dismiss && typeof this.dismiss.handler === 'function') {
        this.dismiss.handler()
      }
    }
  },
  mounted () {
    this.__runCancelHandler = true
    this.$nextTick(() => {
      this.$refs.dialog.open()
      this.$root.quasarClose = this.close
    })
  }
}
</script>
