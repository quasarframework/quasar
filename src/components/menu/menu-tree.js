import Vue from 'vue'

const bus = new Vue()
const tree = {}

export default {
  methods: {
    __registerTree () {
      tree[this.portalId] = true

      if (this.$root.portalParentId === void 0) {
        return
      }

      if (tree[this.$root.portalParentId] !== true) {
        bus.$emit('hide', tree[this.$root.portalParentId])
      }

      bus.$on('hide', this.__processEvent)
      tree[this.$root.portalParentId] = this.portalId
    },

    __unregisterTree () {
      // if it hasn't been registered or already unregistered (beforeDestroy)
      if (tree[this.portalId] === void 0) {
        return
      }

      if (this.$root.portalParentId !== void 0) {
        bus.$off('hide', this.__processEvent)
      }

      const child = tree[this.portalId]

      delete tree[this.portalId]

      if (child !== true) {
        bus.$emit('hide', child)
      }
    },

    __processEvent (id) {
      this.portalId === id && this.hide()
    }
  }
}
