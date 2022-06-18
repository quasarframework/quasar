const list = [
  { name: 'Youtube', path: 'youtube' },
  { name: 'Google Play', path: 'google-play' },
  { name: 'GitHub', path: 'github' },
  { name: 'Google Photos', path: 'google-photos' },
  { name: 'Google News', path: 'google-news' },
  { name: 'Whatsapp', path: 'whatsapp' },
  { name: 'Quasar Classic', path: 'quasar-classic' },
  { name: 'Quasar Classic (Dark)', path: 'quasar-classic-dark' }
]

export default list.map(layout => ({
  ...layout,
  screenshot: `https://cdn.quasar.dev/img/layout-gallery/screenshot-${layout.path}.png`,
  demoLink: `/layout/gallery/${layout.path}`,
  sourceLink: `https://github.com/quasarframework/quasar/blob/dev/docs/src/layouts/gallery/${layout.path}.vue`
}))
