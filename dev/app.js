import Vue from 'vue'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'
import Quasar from 'quasar'

require('../src/themes/quasar.' + __THEME + '.styl')

Vue.use(VueRouter)
Vue.use(VueTouch)
Vue.use(Quasar)

let router = new VueRouter()

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
      '/fab': { component: require('view/fab.vue') },
      '/flex': { component: require('view/flex.vue') },
      '/form': { component: require('view/form.vue') },
      '/grid': { component: require('view/grid.vue') },
      '/gallery': { component: require('view/gallery.vue') },
      '/infinite-scroll': { component: require('view/infinite-scroll.vue') },
      '/loading': { component: require('view/loading.vue') },
      '/modal': { component: require('view/modal.vue') },
      '/label': { component: require('view/label.vue') },
      '/list': { component: require('view/list.vue') },
      '/pagination': { component: require('view/pagination.vue') },
      '/parallax': { component: require('view/parallax.vue') },
      '/popover': { component: require('view/popover.vue') },
      '/progress': { component: require('view/progress.vue') },
      '/pull-to-refresh': { component: require('view/pull-to-refresh.vue') },
      '/rating': { component: require('view/rating.vue') },
      '/scroll-fire': { component: require('view/scroll-fire.vue') },
      '/slider': { component: require('view/slider.vue') },
      '/spinners': { component: require('view/spinners.vue') },
      '/stepper': { component: require('view/stepper.vue') },
      '/table': { component: require('view/table.vue') },
      '/tabs': { component: require('view/tabs.vue') },
      '/timeline': { component: require('view/timeline.vue') },
      '/toast': { component: require('view/toast.vue') },
      '/tree': { component: require('view/tree.vue') },
      '/typography': { component: require('view/typography.vue') }
    }
  },
  '/layout': {
    component: require('view/layout.vue'),
    subRoutes: {
      '/': { component: require('view/layout-index.vue') },
      '/alarm': { component: {template: '<div><div v-for="n in 100">gigi</div></div>'} },
      '/help': { component: {} }
    }
  }
})

Quasar.theme.set(__THEME)
Quasar.start(() => {
  router.start(Vue.extend({}), '#quasar-app')
})
