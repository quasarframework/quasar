
import { optimize } from 'svgo'
import { writeFile } from 'node:fs'
import { posterize } from 'potrace'

import { getSquareIcon } from '../utils/get-square-icon.js'

export default async function (file, opts, done) {
  const img = getSquareIcon({
    file,
    icon: opts.icon,
    size: 256,
    padding: opts.padding
  })

  const params = {
    color: opts.svgColor,
    steps: 4,
    threshold: 255
  }

  const buffer = await img.toBuffer()

  posterize(buffer, params, (_, svg) => {
    const res = optimize(svg)
    writeFile(file.absoluteName, res.data, done)
  })
}
