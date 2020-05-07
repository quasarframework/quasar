const { join } = require('path')

const { appDir } = require('./app-paths')

const tagRegex = /\{(.*?)\}/g

module.exports = function getAssetsFiles (assets) {
  const list = []

  assets.forEach(({ sizes, ...props }) => {
    if (sizes) {
      sizes.forEach(size => {
        const isArray = Array.isArray(size)

        const [ width, height ] = isArray
          ? size
          : [ size, size ]

        const replacer = isArray
          ? `${width}x${height}`
          : width

        list.push({
          ...props,
          name: props.name.replace(/{size}/g, replacer),
          width,
          height
        })
      })
    }
    else {
      list.push(props)
    }
  })

  return list.map(({ tag, ...asset }) => {
    const file = {
      ...asset,
      relativeName: join(asset.folder, asset.name),
      absoluteName: join(appDir, asset.folder, asset.name)
    }

    if (tag) {
      file.tag = tag.replace(tagRegex, (_, p) => file[p === 'size' ? 'width' : p])
    }

    return file
  })
}
