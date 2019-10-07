export default function (h, conf, content) {
  return h('div', {
    ...conf,
    staticClass: 'q-table__middle' + (conf.staticClass !== void 0 ? ' ' + conf.staticClass : '')
  }, [
    h('table', { staticClass: 'q-table' }, content)
  ])
}
