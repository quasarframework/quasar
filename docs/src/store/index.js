import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      leftDrawerState: true,
      rightDrawerState: true,
      toc: []
    },

    getters: {
      hasDrawer (state) {
        return state.route.path !== '/'
      }
    },

    mutations: {
      updateLeftDrawerState (state, opened) {
        state.leftDrawerState = opened
      },

      updateRightDrawerState (state, opened) {
        state.rightDrawerState = opened
      },

      updateToc (state, newToc) {
        state.toc = newToc
      }
    }
  })

  return Store
}
