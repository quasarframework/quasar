
function updateActiveToc (position, state) {
  if (position === void 0) {
    position = document.documentElement.scrollTop || document.body.scrollTop
  }

  let last

  for (const section of state.value.toc) {
    const item = document.getElementById(section.id)

    if (item === null) {
      continue
    }

    const offset = section.deep === true
      ? item.offsetTop + item.offsetParent.offsetTop
      : item.offsetTop

    if (offset >= position + 155) {
      if (last === void 0) {
        last = section.id
      }
      break
    }
    else {
      last = section.id
    }
  }

  if (last !== void 0) {
    state.value.activeToc = last
  }
}

export default function injectToc (store) {
  Object.assign(store.state, {
    toc: [],
    activeToc: store.$route.hash.length > 1
      ? store.$route.hash.substring(1)
      : null
  })

  const onClick = () => { store.scrollTo('introduction') }

  store.setToc = toc => {
    store.state.value.toc = toc !== void 0
      ? [
          {
            id: 'introduction',
            title: '1. Introduction',
            onClick
          },
          ...toc.map(entry => ({
            ...entry,
            onClick: () => {
              store.state.value.tocDrawer = false
              store.scrollTo(entry.id)
            }
          }))
        ]
      : []
  }

  store.setActiveToc = pos => {
    updateActiveToc(pos, store.state)
  }
}
