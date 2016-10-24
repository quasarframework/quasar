import Vue from 'vue'
import VueRouter from 'vue-router'
import pages from './pages'

Vue.use(VueRouter)

function load (name) {
  return require('./components/' + name + '.vue')
}

function component (path) {
  return {path: '/' + path, component: load(path)}
}

let routes = [
  {path: '/', component: load('index')},
  {
    path: '/test-layout',
    component: load('test-layout/layout'),
    children: [
      {path: 'layout', component: load('test-layout/about')},
      {path: 'toolbar', component: load('test-layout/toolbar')},
      {path: 'tabs', component: load('test-layout/tabs')},
      {path: 'drawer', component: load('test-layout/drawer')}
    ]
  }
]

pages.filter(category => !category.extract).forEach(category => {
  category.features.forEach(group => {
    let path = category.hash + '/' + group.hash
    routes.push(component(path))
  })
})

routes.push({path: '*', component: load('error404')})
export default new VueRouter({routes})
