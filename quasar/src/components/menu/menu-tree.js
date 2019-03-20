import Vue from 'vue'

const
  bus = new Vue(),
  tree = {},
  rootHide = {}

/*
 * Tree has (key: value) entries where
 *
 *    key: menuId
 *
 *    value --> (true / menuId)
 *       true --- means has no sub-menu opened
 *       menuId --- menuId of the sub-menu that is currently opened
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
      return true
    }
  }
}

export const MenuTreeMixin = {
  methods: {
    __registerTree () {
      tree[this.menuId] = true

      if (this.$root.menuParentId === void 0) {
        rootHide[this.menuId] = this.hide
        return
      }

      if (tree[this.$root.menuParentId] !== true) {
        bus.$emit('hide', tree[this.$root.menuParentId])
      }

      bus.$on('hide', this.__processEvent)
      tree[this.$root.menuParentId] = this.menuId
    },

    __unregisterTree () {
      // if it hasn't been registered or already unregistered (beforeDestroy)
      if (tree[this.menuId] === void 0) {
        return
      }

      delete rootHide[this.menuId]

      if (this.$root.menuParentId !== void 0) {
        bus.$off('hide', this.__processEvent)
      }

      const child = tree[this.menuId]

      delete tree[this.menuId]

      if (child !== true) {
        bus.$emit('hide', child)
      }
    },

    __processEvent (id) {
      this.menuId === id && this.hide()
    }
  }
}
