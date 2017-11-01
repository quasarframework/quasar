import Vue from 'vue'
import VueRouter from 'vue-router'

import pages from './pages'

Vue.use(VueRouter)

function load (component) {
  return () => import(`./components/${component}.vue`)
}

function component (path) {
  return {
    path: '/' + path.slice(0, path.length - 4),
    component: () => import(`./components/${path}`)
  }
}

let routes = [
  {path: '/', component: load('index')},
  {
    path: '/lay',
    component: load('web-tests/layout'),
    children: [
      {path: 'a', component: load('web-tests/a')},
      {path: 'b', component: load('web-tests/b')},
      {path: 'c', component: load('web-tests/c')}
    ]
  },
  {
    path: '/layout-quick',
    component: load('new-layout/new-layout'),
    children: [
      {path: '', redirect: 'default'},
      {path: 'default', component: load('new-layout/pages/default')},
      {path: 'a', component: load('new-layout/pages/a')},
      {path: 'b', component: load('new-layout/pages/b')},
      {path: 'c', component: load('new-layout/pages/c')}
    ]
  }
]

pages.forEach(page => {
  routes.push(component(page))
})

routes.push({path: '*', component: load('error404')})

export default new VueRouter({
  // mode: 'history',
  routes
})
