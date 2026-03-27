import { globalConfig } from '../private.config/instance-config.js'
import { getRootElement } from '../private.dom/root.js'

const nodesList = []
const portalTypeList = []

let portalIndex = 1
let target = null

export function createGlobalNode(id, portalType) {
  const el = document.createElement('div')

  el.id =
    portalType !== void 0 ? `q-portal--${portalType}--${portalIndex++}` : id

  if (globalConfig.globalNodes !== void 0) {
    const cls = globalConfig.globalNodes.class
    if (cls !== void 0) {
      el.className = cls
    }
  }

  if (target === null && !__QUASAR_SSR_SERVER__) {
    target = getRootElement()
  }

  if (target) {
    target.appendChild(el)
  }

  nodesList.push(el)
  portalTypeList.push(portalType)

  return el
}

export function removeGlobalNode(el) {
  const nodeIndex = nodesList.indexOf(el)

  nodesList.splice(nodeIndex, 1)
  portalTypeList.splice(nodeIndex, 1)

  el.remove()
}

export function changeGlobalNodesTarget(newTarget) {
  if (target === null && !__QUASAR_SSR_SERVER__) {
    target = getRootElement()
  }

  if (newTarget === target) return

  target = newTarget

  if (
    target === getRootElement() ||
    // or we have less than 2 dialogs:
    portalTypeList.reduce(
      (acc, type) => (type === 'dialog' ? acc + 1 : acc),
      0
    ) < 2
  ) {
    nodesList.forEach(node => {
      if (node.contains(target) === false) {
        target.appendChild(node)
      }
    })

    return
  }

  const lastDialogIndex = portalTypeList.lastIndexOf('dialog')

  for (let i = 0; i < nodesList.length; i++) {
    const el = nodesList[i]

    if (
      (i === lastDialogIndex || portalTypeList[i] !== 'dialog') &&
      el.contains(target) === false
    ) {
      target.appendChild(el)
    }
  }
}
