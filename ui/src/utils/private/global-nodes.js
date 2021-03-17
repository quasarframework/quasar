const globalNodes = []
let target = __QUASAR_SSR_SERVER__
  ? void 0
  : document.body

export function createGlobalNode ({ id, cfg }) {
  const el = document.createElement('div')

  if (cfg && typeof cfg.className === 'string' && cfg.className !== '') {
    el.classList.add(cfg.className)
  }

  if (id !== void 0) {
    el.id = id
  }

  target.appendChild(el)
  globalNodes.push(el)

  return el
}

export function removeGlobalNode (el) {
  globalNodes.splice(globalNodes.indexOf(el), 1)
  el.remove()
}

export function changeGlobalNodesTarget (el) {
  if (el !== target) {
    target = el

    globalNodes.forEach(el => {
      if (el.contains(target) === false) {
        target.appendChild(el)
      }
    })
  }
}
