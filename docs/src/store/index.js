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
      toc: [],
      prevPage: '',
      nextPage: ''
    },

    getters: {
      hasDrawer (state) {
        return state.route !== void 0 && state.route.path !== '/'
      },
      prevPage (state) {
        return state.prevPage
      },
      nextPage (state) {
        return state.nextPage
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
        state.toc = [{ id: 'Introduction', title: 'Introduction' }].concat(newToc)
      },

      updatePrevPage (state, path) {
        state.prevPage = path
      },

      updateNextPage (state, path) {
        state.nextPage = path
      }
    }
  })

  return Store
}
