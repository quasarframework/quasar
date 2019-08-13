import Vue from 'vue'
import Vuex from 'vuex'

import { Screen } from 'quasar'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      leftDrawerState: Screen.width > 1023,
      rightDrawerState: Screen.width > 1023,
      toc: []
    },

    mutations: {
      updateLeftDrawerState (state, opened) {
        state.leftDrawerState = opened
      },

      updateRightDrawerState (state, opened) {
        state.rightDrawerState = opened
      },

      updateToc (state, newToc) {
        state.toc = newToc.length > 0
          ? [{ id: 'Introduction', title: 'Introduction' }].concat(newToc)
          : []
      }
    }
  })

  return Store
}
