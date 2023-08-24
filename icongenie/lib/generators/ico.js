
import { writeFile } from 'node:fs'
import png2icons from 'png2icons'

import { getSquareIcon } from '../utils/get-square-icon.js'

export default async function (file, opts, done) {
  const img = getSquareIcon({
    file,
    icon: opts.icon,
    size: 256,
    padding: opts.padding
  })

  const buffer = await img.toBuffer()
  const output = await png2icons.createICO(buffer, opts.compression.ico, 0, true)

  writeFile(file.absoluteName, output, done)
}
