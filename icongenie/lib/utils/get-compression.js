
import { dirname } from 'node:path'

import imagemin from 'imagemin'
import pngquant from 'imagemin-pngquant'
import { BICUBIC2, HERMITE, BEZIER, BICUBIC, BILINEAR, NEAREST_NEIGHBOR } from 'png2icons'

export function getIcoCompression (quality) {
  switch (quality) {
    case 1:
    case 2:
      return NEAREST_NEIGHBOR // fastest, mediocre to OK quality
    case 3:
    case 4:
      return BILINEAR // fast, quality OK
    case 5:
    case 6:
      return BICUBIC2 // fast, good to very good quality
    case 7:
    case 8:
      return BICUBIC // slower, good to very good quality
    case 9:
    case 10:
      return BEZIER // quite slow, high quality
    case 11:
    case 12:
      return HERMITE // quite slow, high quality
  }
}

export function getPngCompression (quality) {
  if (quality === 12) {
    return () => {}
  }

  const plugins = [
    pngquant({
      quality: [ 0.6, 0.8 ],
      speed: 12 - quality // 1 - 11
    })
  ]

  return async function minifyFile (filename) {
    return imagemin([ filename ], {
      destination: dirname(filename),
      plugins
    })
  }
}
