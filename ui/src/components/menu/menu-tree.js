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
      let menuParentId, menuRootId

      tree[this.menuId] = true

      for (let vm = this; vm !== vm.$root; vm = vm.$parent) {
        if (vm.$options.name === 'QMenu') {
          menuRootId = vm.menuId
          if (menuParentId === void 0 && menuRootId !== this.menuId) {
            menuParentId = menuRootId
          }
          if (vm.submenu !== true) {
            break
          }
        }
      }

      if (menuRootId === this.menuId) {
        rootHide[this.menuId] = this.hide

        return
      }

      if (tree[menuParentId] !== true) {
        bus.$emit('hide', tree[menuParentId])
      }

      bus.$on('hide', this.__processEvent)
      tree[menuParentId] = this.menuId
    },

    __unregisterTree () {
      // if it hasn't been registered or already unregistered (beforeDestroy)
      if (tree[this.menuId] === void 0) {
        return
      }

      if (rootHide[this.menuId] !== void 0) {
        delete rootHide[this.menuId]
      }
      else {
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
