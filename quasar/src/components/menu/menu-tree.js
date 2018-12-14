import Vue from 'vue'

const
  bus = new Vue(),
  tree = {},
  rootHide = {}

/*
 * Tree has (key: value) entries where
 *
 *    key: portalId
 *
 *    value --> (true / portalId)
 *       true --- means has no sub-menu opened
 *       portalId --- portalId of the sub-menu that is currently opened
 *
 */

export function closeRootMenu (id) {
  while (tree[id] !== void 0) {
    const res = Object.keys(tree).find(key => tree[key] === id)
    if (res !== void 0) {
      id = res
    }
    else {
      rootHide[id] !== void 0 && rootHide[id]()
      return
    }
  }
}

export const MenuTreeMixin = {
  methods: {
    __registerTree () {
      tree[this.portalId] = true

      if (this.$root.portalParentId === void 0) {
        rootHide[this.portalId] = this.hide
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

      delete rootHide[this.portalId]

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
