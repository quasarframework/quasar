import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import {
  BEZIER,
  BICUBIC,
  BICUBIC2,
  BILINEAR,
  HERMITE,
  NEAREST_NEIGHBOR
} from 'png2icons'

export function getIcoCompression(quality) {
  switch (quality) {
    case 1:
    case 2: {
      return NEAREST_NEIGHBOR
    } // fastest, mediocre to OK quality
    case 3:
    case 4: {
      return BILINEAR
    } // fast, quality OK
    case 5:
    case 6: {
      return BICUBIC2
    } // fast, good to very good quality
    case 7:
    case 8: {
      return BICUBIC
    } // slower, good to very good quality
    case 9:
    case 10: {
      return BEZIER
    } // quite slow, high quality
    case 11:
    case 12: {
      return HERMITE
    } // quite slow, high quality
  }
}

export function getPngCompression(quality) {
  if (quality === 12) {
    return () => {}
  }

  const options = {
    palette: true,
    quality: 58 + quality * 2, // 60 - 80
    effort: Math.min(quality, 10)
  }

  return async function minifyFile(filename) {
    const content = await sharp(filename).png(options).toBuffer()
    await writeFile(filename, content)
  }
}
