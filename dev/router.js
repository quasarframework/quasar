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

const metaChildren = [
  { path: '', redirect: 'first' },
  { path: 'first', component: load('meta/pages/first') },
  { path: 'second', component: load('meta/pages/second') },
  { path: 'third', component: load('meta/pages/third') }
]

let routes = [
  {path: '/', component: load('index')},
  {
    path: '/meta/layout_1',
    component: load('meta/layout_1'),
    children: metaChildren
  },
  {
    path: '/meta/layout_2',
    component: load('meta/layout_2'),
    children: metaChildren
  },
  {
    path: '/tabs',
    component: load('components/tabs-playground'),
    children: [
      { path: 'a' },
      { path: 'a/a' },
      { path: 'a/b' },
      { path: 'b' },
      { path: 'b/a' },
      { path: 'c' }
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
  if (!page.startsWith('meta')) {
    routes.push(component(page))
  }
})

export function createRouter () {
  return new VueRouter({
    mode: 'history',
    routes
  })
}
