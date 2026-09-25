import { describe, expect, test } from 'vitest'

import { validateFiles } from './validate-files.js'

function createFile(name, type, size, lastModified = 1) {
  return new File([new Uint8Array(size)], name, { type, lastModified })
}

describe('[validateFiles API]', () => {
  describe('[Functions]', () => {
    describe('[(function)validateFiles]', () => {
      test('has correct return value', () => {
        const image = createFile('image.png', 'image/png', 4)
        const text = createFile('notes.txt', 'text/plain', 4)
        const big = createFile('big.png', 'image/png', 9)

        expect(validateFiles([image, text, big], {})).toStrictEqual({
          files: [image],
          rejected: []
        })

        expect(
          validateFiles([image, text, big], {
            multiple: true,
            accept: 'image/*',
            maxFileSize: '5'
          })
        ).toStrictEqual({
          files: [image],
          rejected: [
            { failedPropValidation: 'accept', file: text },
            { failedPropValidation: 'max-file-size', file: big }
          ]
        })

        expect(
          validateFiles([image, text, big], { multiple: true }, [image], true)
        ).toStrictEqual({
          files: [text, big],
          rejected: [{ failedPropValidation: 'duplicate', file: image }]
        })
      })
    })
  })
})
