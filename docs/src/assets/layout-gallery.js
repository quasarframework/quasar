const list = [
  { name: 'Youtube', path: 'youtube' },
  { name: 'Google Play', path: 'google-play' },
  { name: 'Github', path: 'github' },
  { name: 'Google Photos', path: 'google-photos' },
  { name: 'Google News', path: 'google-news' },
  { name: 'Quasar Default', path: 'quasar-default' }
]

export default list.map(layout => ({
  ...layout,
  screenshot: `https://cdn.quasar.dev/img/layout-gallery/screenshot-${layout.path}.png`,
  demoLink: `/layout/gallery/${layout.path}`,
  sourceLink: `https://github.com/quasarframework/quasar/blob/dev/docs/src/layouts/gallery/${layout.path}.vue`
}))
