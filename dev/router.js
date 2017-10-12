import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import pages from './pages'

function load (component) {
  return require(`./components/${component}.vue`).default
}

function component (path) {
  return {
    path: '/' + path.slice(0, path.length - 4),
    component: require(`./components/${path}`).default
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
    path: '/lay',
    component: load('web-tests/layout'),
    children: [
      {path: 'a', component: load('web-tests/a')},
      {path: 'b', component: load('web-tests/b')},
      {path: 'c', component: load('web-tests/c')}
    ]
  }
]

pages.filter(page => page.indexOf('test-layout') === -1).forEach(page => {
  routes.push(component(page))
})

routes.push({path: '*', component: load('error404')})

export default new VueRouter({
  mode: 'history',
  routes
})
