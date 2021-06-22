import pages from './pages-list'

function load (component) {
  return () => import('pages/' + component + '.vue')
}

function component (path) {
  return {
    path: '/' + path.slice(0, path.length - 4),
    component: () => import('pages/' + path)
  }
}

const placeholderComponent = { template: '<router-view />' }

const metaChildren = [
  { path: 'first', component: load('meta/pages/first') },
  { path: 'second', component: load('meta/pages/second') },
  { path: 'third', component: load('meta/pages/third') }
]

const routes = [
  { path: '/', component: load('Index') },
  {
    path: '/meta/layout_1',
    component: load('meta/layouts/layout_1'),
    children: metaChildren
  },
  {
    path: '/meta/title',
    component: load('meta/layouts/title')
  },
  {
    path: '/meta/layout_2',
    component: load('meta/layouts/layout_2'),
    children: metaChildren
  },
  {
    path: '/components/tabs',
    component: load('components/tabs'),
    children: [
      { path: 'a', component: placeholderComponent, meta: { skipScroll: true } },
      { path: 'a/a', component: placeholderComponent, meta: { skipScroll: true } },
      { path: 'a/b', component: placeholderComponent, meta: { skipScroll: true } },
      { path: 'b', component: placeholderComponent, meta: { skipScroll: true } },
      { path: 'b/a', component: placeholderComponent, meta: { skipScroll: true } },
      { path: 'c', component: placeholderComponent, meta: { skipScroll: true } },
      {
        path: 't',
        component: placeholderComponent,
        children: [
          { path: ':id/a', name: 'ta', component: placeholderComponent, meta: { skipScroll: true } },
          { path: ':id/b', name: 'tb', component: placeholderComponent, meta: { skipScroll: true } }
        ],
        meta: { skipScroll: true }
      },
      {
        name: 'r',
        path: 'r',
        component: placeholderComponent,
        redirect: { name: 'r.1' },
        children: [
          {
            name: 'r.1',
            path: '1',
            component: placeholderComponent,
            children: [
              { name: 'r.1.1', path: '1', component: placeholderComponent, meta: { skipScroll: true } },
              { name: 'r.1.2', path: '2', redirect: { name: 'r' }, meta: { skipScroll: true } },
              { name: 'r.1.3', path: '3', redirect: { name: 'r.1.1' }, meta: { skipScroll: true } }
            ],
            meta: { skipScroll: true }
          },
          { name: 'r.2', path: '2', component: placeholderComponent, meta: { skipScroll: true } },
          { name: 'r.3', path: '3', redirect: { name: 'ta', params: { id: 2 } }, meta: { skipScroll: true } }
        ],
        meta: { skipScroll: true }
      }
    ]
  },
  {
    path: '/lay',
    component: load('web-tests/layout'),
    children: [
      { path: 'a', component: load('web-tests/a') },
      { path: 'b', component: load('web-tests/b') },
      { path: 'c', component: load('web-tests/c') }
    ]
  },
  {
    path: '/layout-quick',
    component: load('layout/layout'),
    children: [
      { path: '', redirect: 'default' },
      { path: 'default', component: load('layout/pages/default') },
      { path: 'a', component: load('layout/pages/a') },
      { path: 'b', component: load('layout/pages/b') },
      { path: 'c', component: load('layout/pages/c') }
    ]
  }
]

pages.forEach(page => {
  if (!page.startsWith('meta') && page !== 'components/tabs.vue') {
    routes.push(component(page))
  }
})

// Always leave this as last one
routes.push({
  path: '/:catchAll(.*)*',
  component: () => import('pages/Error404.vue')
})

export default routes

// function load (component) {
//   return () => import('pages/' + component + '.vue')
// }
// export default [
//   { path: '/', component: load('Index') }
// ]
