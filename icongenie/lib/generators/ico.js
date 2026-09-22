import { writeFile } from 'node:fs'
import png2icons from 'png2icons'

import { getSquareIcon } from '../utils/get-square-icon.js'

export default async function ico(file, opts, done) {
  const img = getSquareIcon({
    file,
    icon: opts.icon,
    size: 256,
    padding: opts.padding
  })

  const buffer = await img.toBuffer()

  // 16 to 48px as plain bitmaps, the rest as PNG: parts of the Windows
  // shell (desktop shortcuts, the icon extracted from an executable)
  // scramble PNG-compressed small entries, so the mixed layout that
  // png2icons offers for Windows executables is the one to ship everywhere
  const output = await png2icons.createICO(
    buffer,
    opts.compression.ico,
    0,
    false,
    true
  )

  writeFile(file.absoluteName, output, done)
}
