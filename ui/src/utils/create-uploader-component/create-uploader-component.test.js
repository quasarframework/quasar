import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { computed, ref } from 'vue'

import {
  coreEmits,
  coreProps
} from '../../components/uploader/uploader-core.js'
import createUploaderComponent from './create-uploader-component.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

/** The smallest plugin an uploader component can be built around. */
function createPlugin(overrides = {}) {
  return vi.fn(({ exposeApi }) => {
    exposeApi({ myPluginApi: 'here' })

    return {
      isUploading: ref(false),
      abort: vi.fn(),
      upload: vi.fn(),
      ...overrides
    }
  })
}

function createUploader({ injectPlugin = createPlugin(), ...rest } = {}) {
  return createUploaderComponent({
    name: 'MyUploader',
    props: { myProp: String },
    emits: ['myEvent'],
    injectPlugin,
    ...rest
  })
}

describe('[createUploaderComponent API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const Uploader = createUploader()

        expect(Uploader).toBeTypeOf('object')
        expect(Uploader.name).toBe('MyUploader')
        expect(Uploader.setup).toBeTypeOf('function')
      })

      test('merges the supplied props into the core ones', () => {
        const Uploader = createUploader()

        expect(Uploader.props).$props()
        expect(Object.keys(Uploader.props)).toStrictEqual(
          expect.arrayContaining([...Object.keys(coreProps), 'myProp'])
        )
      })

      test('merges an array of emits into the core ones', () => {
        const Uploader = createUploader()

        expect(Uploader.emits).$emits()
        expect(Uploader.emits).toStrictEqual([...coreEmits, 'myEvent'])
      })

      test('merges an object of emits into the core ones', () => {
        const myEvent = vi.fn(() => true)
        const Uploader = createUploader({ emits: { myEvent } })

        expect(Uploader.emits).$emits()
        expect(Uploader.emits.myEvent).toBe(myEvent)

        // the core events keep a validator of their own
        coreEmits.forEach(event => {
          expect(Uploader.emits[event]).toBeTypeOf('function')
        })
      })

      test('builds a working uploader around the plugin', () => {
        const injectPlugin = createPlugin()
        const Uploader = createUploader({ injectPlugin })

        wrapper = mount(Uploader, { props: { label: 'Pick a file' } })

        expect(injectPlugin).toHaveBeenCalledExactlyOnceWith({
          props: expect.objectContaining({ label: 'Pick a file' }),
          slots: expect.any(Object),
          emit: expect.any(Function),
          helpers: expect.any(Object),
          exposeApi: expect.any(Function)
        })

        expect(wrapper.classes()).toContain('q-uploader')
        expect(wrapper.get('.q-uploader__title').text()).toBe('Pick a file')
      })

      test('exposes the core and the plugin API', () => {
        wrapper = mount(createUploader())

        expect(wrapper.vm.myPluginApi).toBe('here')
        expect(wrapper.vm.upload).toBeTypeOf('function')
        expect(wrapper.vm.reset).toBeTypeOf('function')
        expect(wrapper.vm.files).toStrictEqual([])
      })

      test('lets the plugin drive the uploading state', async () => {
        const isUploading = ref(false)
        const injectPlugin = createPlugin({
          isUploading: computed(() => isUploading.value)
        })

        wrapper = mount(createUploader({ injectPlugin }))

        isUploading.value = true
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('start')).toStrictEqual([[]])

        isUploading.value = false
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('finish')).toStrictEqual([[]])
      })
    })
  })
})
