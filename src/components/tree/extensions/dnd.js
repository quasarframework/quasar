export default (config) => {
  const __onDrop = (ev, node, meta, ctx) => {
    const src = JSON.parse(ev.dataTransfer.getData('json'))
    config.dropHandler.bind(ctx)
    config.dropHandler(src.key, src.parentKey, meta.key, meta.parent != null ? meta.parent.key : null)
    ev.preventDefault()
  }
  const __onDragStart = (event, node, meta) => {
    event.dataTransfer.effectAllowed = 'move'

    const data = {
      key: meta.key
    }

    if (meta.parent != null) {
      data.parentKey = meta.parent.key
    }

    event.dataTransfer.setData('json', JSON.stringify(data))
  }

  return {
    nodeEvents: (node, meta) => {
      const res = {
        dragstart: (event) => {
          __onDragStart(event, node, meta)
          event.target.classList.add(config.draggingClass)
        },
        dragend: (event) => {
          event.target.classList.remove(config.draggingClass)
        }
      }

      if (meta.isParent) {
        res.dragenter = (event) => {
          event.target.classList.add(config.dropAreaClass)
          event.preventDefault()
        }

        res.dragleave = (event) => {
          event.target.classList.remove(config.dropAreaClass)
          event.preventDefault()
        }

        res.dragover = (event) => {
          event.preventDefault()
        }

        res.drop = (event) => {
          __onDrop(event, node, meta, this)
          event.target.classList.remove(config.dropAreaClass)
        }
      }
      return res
    },
    nodeAttrs: (node, meta) => {
      if (meta.parent == null) return {}
      else {
        return {
          draggable: true
        }
      }
    }
  }
}
