import $ from 'jquery'
import 'hammerjs'

window.jQuery = window.$ = $
import 'velocity-animate'
import 'velocity-animate/velocity.ui'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'
import Quasar from '../src'

Vue.use(VueRouter)
Vue.use(VueTouch)
Vue.use(Quasar)

window.x = Quasar
var router = new VueRouter()

router.map({
  '/': {
    component: require('view/index.vue')
  }
})

/*
quasar.boot.app(() => {
  router.start(Vue.extend({}), '#quasar-app')
})
*/

router.start(Vue.extend({}), '#quasar-app')
