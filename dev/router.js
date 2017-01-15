import Vue from 'vue'
import VueRouter from 'vue-router'

import pages from './pages'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`./components/${component}.vue`)
}

function component (path) {
  return {
    path: '/' + path.slice(0, path.length - 4),
    component: () => System.import(`./components/${path}`)
  }
}

let routes = [
  {path: '/', component: load('index')},
  {
    path: '/test-layout',
    component: load('test-layout/layout'),
    children: [
      {path: 'about', component: load('test-layout/about')},
      {path: 'layout', redirect: '/test-layout/about'},
      {path: 'toolbar', component: load('test-layout/toolbar')},
      {path: 'tabs', component: load('test-layout/tabs')},
      {path: 'drawer', component: load('test-layout/drawer')}
    ]
  },
  {
    path: '/test-navbar',
    component: load('test-navbar/layout'),
    children: [
      {path: 'about', component: load('test-navbar/about')},
      {path: 'layout', redirect: '/test-navbar/about'}
    ]
  }
]

pages.filter(page => page.indexOf('test-layout') === -1).forEach(page => {
  routes.push(component(page))
})

routes.push({path: '*', component: load('error404')})

export default new VueRouter({
  // mode: 'history',
  routes
})
