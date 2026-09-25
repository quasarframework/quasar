import { describe, expect, test } from 'vitest'

import { validateFiles } from './validate-files.js'

function createFile(name, type, size, lastModified = 1) {
  return new File([new Uint8Array(size)], name, { type, lastModified })
}

function reject(failedPropValidation, ...files) {
  return files.map(file => ({ failedPropValidation, file }))
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
          rejected: [...reject('accept', text), ...reject('max-file-size', big)]
        })

        expect(
          validateFiles([image, text, big], { multiple: true }, [image], true)
        ).toStrictEqual({
          files: [text, big],
          rejected: reject('duplicate', image)
        })
      })

      test('keeps the first file only without multiple', () => {
        const first = createFile('a.txt', 'text/plain', 1)
        const second = createFile('b.txt', 'text/plain', 1)

        expect(validateFiles([first, second], {})).toStrictEqual({
          files: [first],
          rejected: []
        })
        expect(
          validateFiles([first, second], { multiple: false })
        ).toStrictEqual({ files: [first], rejected: [] })
      })

      test('filters by accept', () => {
        const png = createFile('photo.png', 'image/png', 1)
        const jpg = createFile('photo.JPG', 'image/jpeg', 1)
        const pdf = createFile('doc.pdf', 'application/pdf', 1)
        const untyped = createFile('archive.zip', '', 1)
        const all = [png, jpg, pdf, untyped]
        const opts = { multiple: true }

        // extension, case insensitive
        expect(validateFiles(all, { ...opts, accept: '.jpg' })).toStrictEqual({
          files: [jpg],
          rejected: reject('accept', png, pdf, untyped)
        })

        // exact mime type
        expect(
          validateFiles(all, { ...opts, accept: 'application/pdf' })
        ).toStrictEqual({
          files: [pdf],
          rejected: reject('accept', png, jpg, untyped)
        })

        // mime family
        expect(
          validateFiles(all, { ...opts, accept: 'image/*' })
        ).toStrictEqual({
          files: [png, jpg],
          rejected: reject('accept', pdf, untyped)
        })

        // a list mixing the forms
        expect(
          validateFiles(all, { ...opts, accept: ' image/* , .pdf ' })
        ).toStrictEqual({
          files: [png, jpg, pdf],
          rejected: reject('accept', untyped)
        })

        // "*" and "*/*" accept everything
        expect(validateFiles(all, { ...opts, accept: '*' })).toStrictEqual({
          files: all,
          rejected: []
        })
        expect(validateFiles(all, { ...opts, accept: '*/*' })).toStrictEqual({
          files: all,
          rejected: []
        })
      })

      test('filters by maxFileSize', () => {
        const small = createFile('small.bin', '', 3)
        const limit = createFile('limit.bin', '', 5)
        const big = createFile('big.bin', '', 6)

        expect(
          validateFiles([small, limit, big], {
            multiple: true,
            maxFileSize: limit.size
          })
        ).toStrictEqual({
          files: [small, limit],
          rejected: reject('max-file-size', big)
        })
      })

      test('filters by maxTotalSize, in order', () => {
        const a = createFile('a.bin', '', 4)
        const b = createFile('b.bin', '', 4)
        const c = createFile('c.bin', '', 1)
        const maxTotalSize = a.size + b.size

        // b fills the budget, c no longer fits
        expect(
          validateFiles([a, b, c], { multiple: true, maxTotalSize })
        ).toStrictEqual({
          files: [a, b],
          rejected: reject('max-total-size', c)
        })

        // when appending, the files already held count too
        expect(
          validateFiles([b, c], { multiple: true, maxTotalSize }, [a], true)
        ).toStrictEqual({
          files: [b],
          rejected: reject('max-total-size', c)
        })
      })

      test('filters by maxFiles', () => {
        const a = createFile('a.bin', '', 1)
        const b = createFile('b.bin', '', 1)
        const c = createFile('c.bin', '', 1)

        expect(
          validateFiles([a, b, c], { multiple: true, maxFiles: '2' })
        ).toStrictEqual({
          files: [a, b],
          rejected: reject('max-files', c)
        })

        // when appending, the files already held count too
        expect(
          validateFiles([b, c], { multiple: true, maxFiles: 2 }, [a], true)
        ).toStrictEqual({
          files: [b],
          rejected: reject('max-files', c)
        })
      })

      test('filters through the custom filter function', () => {
        const keep = createFile('keep.txt', 'text/plain', 1)
        const drop = createFile('drop.txt', 'text/plain', 1)

        expect(
          validateFiles([keep, drop], {
            multiple: true,
            filter: files => files.filter(file => file === keep)
          })
        ).toStrictEqual({
          files: [keep],
          rejected: reject('filter', drop)
        })
      })

      test('rejects duplicates only when appending', () => {
        // the files already held went through the pipeline themselves
        const [held] = validateFiles(
          [createFile('a.txt', 'text/plain', 1)],
          {}
        ).files
        const same = createFile('a.txt', 'text/plain', 1)
        const other = createFile('b.txt', 'text/plain', 1)

        expect(
          validateFiles([same, other], { multiple: true }, [held], true)
        ).toStrictEqual({
          files: [other],
          rejected: reject('duplicate', same)
        })

        // a replacing selection does not compare with the current list
        expect(
          validateFiles([same, other], { multiple: true }, [held], false)
        ).toStrictEqual({ files: [same, other], rejected: [] })
      })
    })
  })
})
