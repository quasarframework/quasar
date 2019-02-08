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

    mutations: {
      updateLeftDrawerState (state, opened) {
        state.leftDrawerState = opened
      },

      updateRightDrawerState (state, opened) {
        state.rightDrawerState = opened
      },

      updateToc (state, newToc) {
        state.toc = [{ id: 'Introduction', title: 'Introduction' }].concat(newToc)
      }
    }
  })

  return Store
}
