import $ from 'jquery'
import 'hammerjs'

window.jQuery = window.$ = $
import 'velocity-animate'
import 'velocity-animate/velocity.ui'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'
import Quasar from 'quasar-framework'

Vue.use(VueRouter)
Vue.use(VueTouch)
Vue.use(Quasar)

import '../src/themes/ios.theme.styl'

var router = new VueRouter()

router.map({
  '/': {
    component: require('view/layout.master.vue'),
    subRoutes: {
      '/': { component: require('view/index.vue') },
      '/action-sheet': { component: require('view/action-sheet.vue') },
      '/buttons': { component: require('view/buttons.vue') },
      '/card': { component: require('view/card.vue') },
      '/chat': { component: require('view/chat.vue') },
      '/collapsible': { component: require('view/collapsible.vue') },
      '/css-elements': { component: require('view/css-elements.vue') },
      '/dialog': { component: require('view/dialog.vue') },
      '/dropdown': { component: require('view/dropdown.vue') },
      '/flex': { component: require('view/flex.vue') },
      '/form': { component: require('view/form.vue') },
      '/loading': { component: require('view/loading.vue') },
      '/label': { component: require('view/label.vue') },
      '/list': { component: require('view/list.vue') },
      '/notify': { component: require('view/notify.vue') },
      '/pagination': { component: require('view/pagination.vue') },
      '/progressbar': { component: require('view/progressbar.vue') },
      '/rating': { component: require('view/rating.vue') },
      '/spinners': { component: require('view/spinners.vue') },
      '/table': { component: require('view/table.vue') },
      '/timeline': { component: require('view/timeline.vue') },
      '/tree': { component: require('view/tree.vue') },
      '/typography': { component: require('view/typography') }
    }
  }
})

/*
quasar.boot.app(() => {
  router.start(Vue.extend({}), '#quasar-app')
})
*/

router.start(Vue.extend({}), '#quasar-app')
