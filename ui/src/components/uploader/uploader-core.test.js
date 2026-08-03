import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { coreEmits, coreProps, getRenderer } from './uploader-core.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

function makeFile(name = 'file.txt', { size = 4, type = 'text/plain' } = {}) {
  return new File([new Uint8Array(size)], name, { type })
}

/**
 * Builds a component out of getRenderer() with a plugin that does nothing but
 * record what the core hands over to it.
 */
function mountCore({ plugin = {}, slots, ...props } = {}) {
  const isUploading = plugin.isUploading || ref(false)
  const abort = vi.fn()
  const upload = vi.fn()
  let pluginArgs

  const injectPlugin = vi.fn(args => {
    pluginArgs = args
    args.exposeApi({ myPluginApi: 'here' })

    return {
      isUploading,
      abort,
      upload,
      ...plugin
    }
  })

  wrapper = mount(
    defineComponent({
      props: coreProps,
      emits: coreEmits,
      setup(_, { expose }) {
        return getRenderer(injectPlugin, expose)
      }
    }),
    { props, slots }
  )

  return { injectPlugin, isUploading, abort, upload, getArgs: () => pluginArgs }
}

async function addFiles(files) {
  wrapper.vm.addFiles(files)
  await nextTick()
}

describe('[uploaderCore API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)coreProps]', () => {
      test('is defined correctly', () => {
        expect(coreProps).$props()
      })
    })

    describe('[(variable)coreEmits]', () => {
      test('is defined correctly', () => {
        expect(coreEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)getRenderer]', () => {
      test('has correct return value', () => {
        mountCore()

        expect(wrapper.classes()).toContain('q-uploader')
        expect(wrapper.find('.q-uploader__header').exists()).toBe(true)
        expect(wrapper.find('.q-uploader__list').exists()).toBe(true)
      })

      test('hands the component internals over to the plugin', () => {
        const { injectPlugin, getArgs } = mountCore({ label: 'Files' })

        expect(injectPlugin).toHaveBeenCalledOnce()
        expect(getArgs()).toStrictEqual({
          props: expect.objectContaining({ label: 'Files' }),
          slots: expect.any(Object),
          emit: expect.any(Function),
          helpers: expect.objectContaining({
            files: expect.$ref([]),
            queuedFiles: expect.$ref([]),
            uploadedFiles: expect.$ref([]),
            uploadedSize: expect.$ref(0),
            updateFileStatus: expect.any(Function),
            isAlive: expect.any(Function)
          }),
          exposeApi: expect.any(Function)
        })
      })

      test('merges whatever the plugin exposes into the public API', () => {
        mountCore()

        expect(wrapper.vm.myPluginApi).toBe('here')
      })

      test('provides a busy flag when the plugin has none', async () => {
        mountCore()

        expect(wrapper.find('.q-uploader__overlay').exists()).toBe(false)

        wrapper.unmount()

        const isBusy = ref(true)
        mountCore({ plugin: { isBusy } })

        expect(wrapper.find('.q-uploader__overlay').exists()).toBe(true)

        isBusy.value = false
        await nextTick()

        expect(wrapper.find('.q-uploader__overlay').exists()).toBe(false)
      })

      test('reports the start and the finish of an upload', async () => {
        const isUploading = ref(false)
        mountCore({ plugin: { isUploading } })

        isUploading.value = true
        await nextTick()

        expect(wrapper.emitted('start')).toStrictEqual([[]])
        expect(wrapper.emitted('finish')).toBeUndefined()

        isUploading.value = false
        await nextTick()

        expect(wrapper.emitted('finish')).toStrictEqual([[]])
      })

      test('exposes the file management API', () => {
        mountCore()

        expect(wrapper.vm).toMatchObject({
          upload: expect.any(Function),
          reset: expect.any(Function),
          removeUploadedFiles: expect.any(Function),
          removeQueuedFiles: expect.any(Function),
          removeFile: expect.any(Function),
          pickFiles: expect.any(Function),
          addFiles: expect.any(Function),

          files: [],
          queuedFiles: [],
          uploadedFiles: [],
          canAddFiles: true,
          canUpload: false,
          uploadSizeLabel: '0.0B',
          uploadProgressLabel: '0.00%'
        })
      })

      test('queues the added files and reports them', async () => {
        mountCore({ multiple: true })
        const file = makeFile('a.txt')

        await addFiles([file, makeFile('b.txt')])

        expect(wrapper.vm.files).toHaveLength(2)
        expect(wrapper.vm.queuedFiles).toHaveLength(2)
        expect(wrapper.emitted('added')?.[0]?.[0]).toHaveLength(2)

        expect(file.__status).toBe('idle')
        expect(file.__progress).toBe(0)
        expect(file.__progressLabel).toBe('0.00%')
        expect(file.__sizeLabel).toBe('4.0B')

        expect(wrapper.findAll('.q-uploader__file')).toHaveLength(2)
        expect(wrapper.vm.uploadSizeLabel).toBe('8.0B')
      })

      test('uploads through the plugin only when it can', async () => {
        const { upload } = mountCore()

        wrapper.vm.upload()
        expect(upload).not.toHaveBeenCalled()

        await addFiles([makeFile()])
        wrapper.vm.upload()

        expect(upload).toHaveBeenCalledOnce()
      })

      test('drops a single file and reports it', async () => {
        mountCore({ multiple: true })
        const file = makeFile('a.txt')

        await addFiles([file, makeFile('b.txt')])
        wrapper.vm.removeFile(file)
        await nextTick()

        expect(wrapper.vm.files.map(f => f.name)).toStrictEqual(['b.txt'])
        expect(wrapper.vm.queuedFiles).toHaveLength(1)
        expect(wrapper.emitted('removed')?.at(-1)).toStrictEqual([[file]])
        expect(wrapper.vm.uploadSizeLabel).toBe('4.0B')
      })

      test('aborts a file that is still uploading while being removed', async () => {
        mountCore()
        const file = makeFile()

        await addFiles([file])

        file.__status = 'uploading'
        file.__abort = vi.fn()
        wrapper.vm.removeFile(file)

        expect(file.__abort).toHaveBeenCalledOnce()
      })

      test('drops the queued files in one go', async () => {
        mountCore({ multiple: true })
        const failed = makeFile('b.txt')

        await addFiles([makeFile('a.txt'), failed])
        failed.__status = 'failed'

        wrapper.vm.removeQueuedFiles()
        await nextTick()

        expect(wrapper.vm.files).toHaveLength(0)
        expect(wrapper.vm.queuedFiles).toHaveLength(0)
        expect(wrapper.emitted('removed')?.at(-1)?.[0]).toHaveLength(2)
      })

      test('drops the uploaded files in one go', async () => {
        mountCore({ multiple: true })
        const uploaded = makeFile('a.txt')

        await addFiles([uploaded, makeFile('b.txt')])
        uploaded.__status = 'uploaded'

        wrapper.vm.removeUploadedFiles()
        await nextTick()

        expect(wrapper.vm.files.map(f => f.name)).toStrictEqual(['b.txt'])
        expect(wrapper.emitted('removed')?.at(-1)).toStrictEqual([[uploaded]])
      })

      test('stays quiet when there is nothing to remove', async () => {
        mountCore()

        await addFiles([makeFile()])
        wrapper.vm.removeUploadedFiles()

        expect(wrapper.emitted('removed')).toBeUndefined()
      })

      test('resets everything and stops the plugin', async () => {
        const { abort } = mountCore()

        await addFiles([makeFile()])
        wrapper.vm.reset()
        await nextTick()

        expect(abort).toHaveBeenCalledOnce()
        expect(wrapper.vm.files).toHaveLength(0)
        expect(wrapper.vm.queuedFiles).toHaveLength(0)
        expect(wrapper.vm.uploadedFiles).toHaveLength(0)
        expect(wrapper.vm.uploadSizeLabel).toBe('0.0B')
      })

      test.each([
        ['reset', wrapperVm => wrapperVm.reset()],
        ['removeUploadedFiles', wrapperVm => wrapperVm.removeUploadedFiles()],
        ['removeQueuedFiles', wrapperVm => wrapperVm.removeQueuedFiles()],
        ['removeFile', (wrapperVm, file) => wrapperVm.removeFile(file)]
      ])('refuses to %s while disabled', async (_, action) => {
        mountCore()

        const file = makeFile()
        await addFiles([file])
        await wrapper.setProps({ disable: true })

        action(wrapper.vm, file)
        await nextTick()

        expect(wrapper.vm.files).toHaveLength(1)
        expect(wrapper.emitted('removed')).toBeUndefined()
      })

      test('tracks the progress of a file', async () => {
        const { getArgs } = mountCore()
        const file = makeFile('a.txt', { size: 100 })

        await addFiles([file])

        getArgs().helpers.updateFileStatus(file, 'uploading', 50)
        await nextTick()

        expect(file.__progress).toBe(0.5)
        expect(file.__progressLabel).toBe('50.00%')

        getArgs().helpers.updateFileStatus(file, 'uploaded')
        await nextTick()

        expect(file.__progress).toBe(1)
        expect(file.__uploaded).toBe(100)
        expect(wrapper.get('.q-uploader__file').classes()).toContain(
          'q-uploader__file--uploaded'
        )
      })

      test('marks a failed file', async () => {
        const { getArgs } = mountCore()
        const file = makeFile()

        await addFiles([file])
        getArgs().helpers.updateFileStatus(file, 'failed')
        await nextTick()

        expect(wrapper.get('.q-uploader__file').classes()).toContain(
          'q-uploader__file--failed'
        )
      })

      test('builds a thumbnail for an image unless told not to', async () => {
        const createObjectURL = vi
          .spyOn(window.URL, 'createObjectURL')
          .mockReturnValue('blob:thumb')
        const revokeObjectURL = vi
          .spyOn(window.URL, 'revokeObjectURL')
          .mockImplementation(() => {})

        mountCore()
        const image = makeFile('a.png', { type: 'image/png' })

        await addFiles([image])

        expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(image)
        expect(wrapper.get('.q-uploader__file').classes()).toContain(
          'q-uploader__file--img'
        )

        wrapper.vm.removeFile(image)

        expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:thumb')
      })

      test('skips the thumbnails when asked to', async () => {
        const createObjectURL = vi.spyOn(window.URL, 'createObjectURL')

        mountCore({ noThumbnails: true })
        await addFiles([makeFile('a.png', { type: 'image/png' })])

        expect(createObjectURL).not.toHaveBeenCalled()
        expect(wrapper.get('.q-uploader__file').classes()).not.toContain(
          'q-uploader__file--img'
        )
      })

      test.each([
        ['bordered', { bordered: true }, 'q-uploader--bordered'],
        ['square', { square: true }, 'q-uploader--square'],
        ['flat', { flat: true }, 'q-uploader--flat'],
        ['dark', { dark: true }, 'q-uploader--dark'],
        ['disabled', { disable: true }, 'q-uploader--disable']
      ])('classes itself as %s', (_, props, className) => {
        mountCore(props)

        expect(wrapper.classes()).toContain(className)
      })

      test.each([
        ['color', { color: 'red' }, 'bg-red'],
        ['text color', { textColor: 'white' }, 'text-white']
      ])('paints the header with the %s', (_, props, className) => {
        mountCore(props)

        expect(wrapper.get('.q-uploader__header').classes()).toContain(
          className
        )
      })

      test.each([
        ['header', '.q-uploader__header'],
        ['list', '.q-uploader__list']
      ])('hands the public API to the %s slot', (slotName, selector) => {
        const slot = vi.fn(() => h('div', { class: 'my-slot' }))

        mountCore({ slots: { [slotName]: slot } })

        expect(wrapper.get(selector).find('.my-slot').exists()).toBe(true)
        expect(slot).toHaveBeenCalledWith(
          expect.objectContaining({
            upload: expect.any(Function),
            reset: expect.any(Function),
            files: expect.any(Array),
            canAddFiles: expect.any(Boolean)
          })
        )
      })

      test('stops an upload in flight when it goes away', () => {
        const isUploading = ref(true)
        const { abort } = mountCore({ plugin: { isUploading } })

        wrapper.unmount()
        wrapper = void 0

        expect(abort).toHaveBeenCalledOnce()
      })

      test('releases the thumbnails when it goes away', async () => {
        vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:thumb')
        const revokeObjectURL = vi
          .spyOn(window.URL, 'revokeObjectURL')
          .mockImplementation(() => {})

        mountCore()
        await addFiles([makeFile('a.png', { type: 'image/png' })])

        wrapper.unmount()
        wrapper = void 0

        expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:thumb')
      })

      test('stops accepting files once the plugin reports an upload', async () => {
        const isUploading = ref(false)
        mountCore({ plugin: { isUploading } })

        expect(wrapper.vm.canAddFiles).toBe(true)

        isUploading.value = true
        await nextTick()

        expect(wrapper.vm.canAddFiles).toBe(false)
      })

      test.each([
        ['disabled', { disable: true }],
        ['readonly', { readonly: true }]
      ])('accepts no file while %s', (_, props) => {
        mountCore(props)

        expect(wrapper.vm.canAddFiles).toBe(false)
        expect(wrapper.vm.canUpload).toBe(false)
      })

      test('accepts a single file at a time unless multiple', async () => {
        mountCore()

        await addFiles([makeFile()])

        expect(wrapper.vm.canAddFiles).toBe(false)
      })

      test('stops accepting files past the maximum count', async () => {
        mountCore({ multiple: true, maxFiles: 1 })

        await addFiles([makeFile()])

        expect(wrapper.vm.canAddFiles).toBe(false)
      })

      test('renders a hidden file input for picking', () => {
        mountCore({ accept: 'image/*', multiple: true })

        const input = wrapper.get('input[type="file"]')

        expect(input.classes()).toContain('q-uploader__input')
        expect(input.attributes('accept')).toBe('image/*')
        expect(input.attributes()).toHaveProperty('multiple')
      })
    })
  })
})
