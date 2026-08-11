import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'

import QFile from './QFile.js'

function makeFile(name = 'file.txt', { size = 0, type = '' } = {}) {
  return new File([new Uint8Array(size)], name, { type })
}

const singleFile = makeFile()

function mountFile(props, options) {
  props ||= {}
  options ||= {}

  return mount(QFile, {
    props: {
      modelValue: singleFile,
      ...props
    },
    ...options
  })
}

function getNative(wrapper) {
  return wrapper.get('.q-field__native')
}

function getInput(wrapper) {
  return wrapper.get('input[type="file"]')
}

function getDisplay(wrapper) {
  return wrapper.get('.q-field__native > div')
}

// the validation debounce and the focusout handler are both timer based
function flushTimers() {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

const maxThreeChars = val =>
  (val !== null && val.name.length <= 3) || 'Name is too long'

describe('[QFile API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', async () => {
        const propVal = 'car_id'
        const wrapper = mountFile()

        expect(getInput(wrapper).attributes('name')).toBeUndefined()

        await wrapper.setProps({ name: propVal })

        expect(getInput(wrapper).attributes('name')).toBe(propVal)
      })
    })

    describe('[(prop)multiple]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile({ modelValue: null })

        expect(getInput(wrapper).attributes('multiple')).toBeUndefined()

        await wrapper.setProps({ multiple: true })

        expect(getInput(wrapper).attributes('multiple')).toBe('')

        // the model becomes an array of every picked file
        wrapper.vm.addFiles([makeFile('a.txt'), makeFile('b.txt')])

        expect(
          wrapper.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['a.txt', 'b.txt'])
      })

      test('keeps a single file without it', () => {
        const wrapper = mountFile({ modelValue: null })

        wrapper.vm.addFiles([makeFile('a.txt'), makeFile('b.txt')])

        expect(wrapper.emitted('update:modelValue')[0][0].name).toBe('a.txt')
      })
    })

    describe('[(prop)accept]', () => {
      test('type String has effect', async () => {
        const propVal = '.txt'
        const wrapper = mountFile({ modelValue: null, accept: propVal })

        expect(getInput(wrapper).attributes('accept')).toBe(propVal)

        wrapper.vm.addFiles([makeFile('image.png', { type: 'image/png' })])
        await nextTick()

        // the file does not match, so it never reaches the model
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'accept', file: expect.any(File) }
        ])
      })
    })

    describe('[(prop)capture]', () => {
      function testCapture(propVal) {
        const wrapper = mountFile({ capture: propVal })

        expect(getInput(wrapper).attributes('capture')).toBe(propVal)
      }

      test('value "user" has effect', () => {
        testCapture('user')
      })

      test('value "environment" has effect', () => {
        testCapture('environment')
      })
    })

    describe('[(prop)max-file-size]', () => {
      function testMaxFileSize(propVal) {
        const wrapper = mountFile({ modelValue: null, maxFileSize: propVal })

        wrapper.vm.addFiles([makeFile('small.txt', { size: 2 })])
        wrapper.vm.addFiles([makeFile('big.txt', { size: 20 })])

        expect(
          wrapper.emitted('update:modelValue').map(([file]) => file.name)
        ).toStrictEqual(['small.txt'])
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'max-file-size', file: expect.any(File) }
        ])
      }

      test('type Number has effect', () => {
        testMaxFileSize(10)
      })

      test('type String has effect', () => {
        testMaxFileSize('10')
      })
    })

    describe('[(prop)max-total-size]', () => {
      function testMaxTotalSize(propVal) {
        const wrapper = mountFile({
          modelValue: null,
          multiple: true,
          maxTotalSize: propVal
        })

        wrapper.vm.addFiles([
          makeFile('a.txt', { size: 6 }),
          makeFile('b.txt', { size: 6 })
        ])

        // the first one fits into the budget, the second one does not
        expect(
          wrapper.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['a.txt'])
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'max-total-size', file: expect.any(File) }
        ])
      }

      test('type Number has effect', () => {
        testMaxTotalSize(10)
      })

      test('type String has effect', () => {
        testMaxTotalSize('10')
      })
    })

    describe('[(prop)max-files]', () => {
      function testMaxFiles(propVal) {
        const wrapper = mountFile({
          modelValue: null,
          multiple: true,
          maxFiles: propVal
        })

        wrapper.vm.addFiles([
          makeFile('a.txt'),
          makeFile('b.txt'),
          makeFile('c.txt')
        ])

        expect(
          wrapper.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['a.txt', 'b.txt'])
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'max-files', file: expect.any(File) }
        ])
      }

      test('type Number has effect', () => {
        testMaxFiles(2)
      })

      test('type String has effect', () => {
        testMaxFiles('2')
      })
    })

    describe('[(prop)filter]', () => {
      test('type Function has effect', () => {
        const propVal = files => files.filter(file => file.name !== 'b.txt')
        const wrapper = mountFile({
          modelValue: null,
          multiple: true,
          filter: propVal
        })

        wrapper.vm.addFiles([makeFile('a.txt'), makeFile('b.txt')])

        expect(
          wrapper.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['a.txt'])
        expect(wrapper.emitted('rejected')[0][0]).toStrictEqual([
          { failedPropValidation: 'filter', file: expect.any(File) }
        ])
      })
    })

    describe('[(prop)model-value]', () => {
      test('type File has effect', () => {
        const propVal = makeFile('report.pdf')
        const wrapper = mountFile({ modelValue: propVal })

        expect(getDisplay(wrapper).text()).toBe('report.pdf')
        expect(wrapper.classes()).toContain('q-field--float')
      })

      test('type Array has effect', () => {
        const propVal = [makeFile('a.txt'), makeFile('b.txt')]
        const wrapper = mountFile({ modelValue: propVal, multiple: true })

        // every file of the array is listed
        expect(getDisplay(wrapper).text()).toBe('a.txt, b.txt')
      })

      test('type null has effect', () => {
        const wrapper = mountFile({ modelValue: null, label: 'Attachment' })

        // there is nothing to show, so only the filler is rendered
        expect(wrapper.find('.q-field__native > div').exists()).toBe(false)
        expect(wrapper.find('.q-file__filler').exists()).toBe(true)
        expect(wrapper.classes()).not.toContain('q-field--float')
      })

      test('type undefined has effect', () => {
        // it is treated the same as a null model
        const wrapper = mountFile({
          modelValue: void 0,
          label: 'Attachment'
        })

        expect(wrapper.find('.q-file__filler').exists()).toBe(true)
        expect(wrapper.classes()).not.toContain('q-field--float')
      })
    })

    describe('[(prop)error]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ error: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-field--error', 'q-field--highlighted'])
        )
      })

      test('type null has effect', () => {
        // null is the "no opinion" value: it does not even reserve
        // the bottom slot, while an explicit false does
        const wrapper = mountFile({ error: null })

        expect(wrapper.find('.q-field__bottom').exists()).toBe(false)

        const explicitFalse = mountFile({ error: false })

        expect(explicitFalse.find('.q-field__bottom').exists()).toBe(true)
      })
    })

    describe('[(prop)error-message]', () => {
      test('type String has effect', () => {
        const propVal = 'Please attach a file'
        const wrapper = mountFile({ error: true, errorMessage: propVal })

        expect(wrapper.get('.q-field__messages [role="alert"]').text()).toBe(
          propVal
        )
      })
    })

    describe('[(prop)no-error-icon]', () => {
      test('type Boolean has effect', () => {
        const withIcon = mountFile({ error: true })
        expect(withIcon.find('.q-field__append .q-icon').exists()).toBe(true)

        const wrapper = mountFile({ error: true, noErrorIcon: true })
        expect(wrapper.find('.q-field__append .q-icon').exists()).toBe(false)
      })
    })

    describe('[(prop)rules]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountFile({ rules: [maxThreeChars] })

        expect(wrapper.classes()).not.toContain('q-field--error')

        expect(wrapper.vm.validate()).toBe(false)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
        expect(wrapper.get('.q-field__messages').text()).toBe(
          'Name is too long'
        )
      })
    })

    describe('[(prop)reactive-rules]', () => {
      test('type Boolean has effect', async () => {
        // lazy-rules keeps the model watcher from validating,
        // so only a rules change can trigger the validation below
        const props = {
          modelValue: makeFile('ab'),
          lazyRules: true,
          rules: [() => true]
        }

        const inert = mountFile(props)
        await inert.setProps({ modelValue: makeFile('abcd') })
        await inert.setProps({ rules: [maxThreeChars] })
        await flushTimers()
        await flushPromises()

        expect(inert.classes()).not.toContain('q-field--error')

        const wrapper = mountFile({ ...props, reactiveRules: true })
        await wrapper.setProps({ modelValue: makeFile('abcd') })
        await wrapper.setProps({ rules: [maxThreeChars] })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(prop)lazy-rules]', () => {
      test('value true has effect', async () => {
        const wrapper = mountFile({
          modelValue: makeFile('ab'),
          lazyRules: true,
          rules: [maxThreeChars]
        })

        // a model change alone does not validate
        await wrapper.setProps({ modelValue: makeFile('abcd') })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        // ...but an explicit validation still does
        wrapper.vm.validate()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('value false has effect', async () => {
        const wrapper = mountFile({
          modelValue: makeFile('ab'),
          lazyRules: false,
          rules: [maxThreeChars]
        })

        // every model change gets validated
        await wrapper.setProps({ modelValue: makeFile('abcd') })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('value "ondemand" has effect', async () => {
        const wrapper = mountFile({
          modelValue: makeFile('ab'),
          lazyRules: 'ondemand',
          rules: [maxThreeChars]
        })

        await wrapper.setProps({ modelValue: makeFile('abcd') })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        // not even losing the focus validates it
        await wrapper.get('.q-field__control').trigger('focusin')
        await wrapper.get('.q-field__control').trigger('focusout')
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        wrapper.vm.validate()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const propVal = 'Attachment'
        const wrapper = mountFile({ label: propVal })

        expect(wrapper.get('.q-field__label').text()).toBe(propVal)
        expect(wrapper.classes()).toContain('q-field--labeled')
      })
    })

    describe('[(prop)stack-label]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile({ modelValue: null, label: 'Attachment' })

        expect(wrapper.classes()).not.toContain('q-field--float')

        await wrapper.setProps({ stackLabel: true })

        expect(wrapper.classes()).toContain('q-field--float')
      })
    })

    describe('[(prop)hint]', () => {
      test('type String has effect', () => {
        const propVal = 'Pick a file'
        const wrapper = mountFile({ hint: propVal })

        expect(wrapper.get('.q-field__messages').text()).toBe(propVal)
      })
    })

    describe('[(prop)hide-hint]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile({ hint: 'Pick a file', hideHint: true })

        // the hint only shows up while focused
        expect(wrapper.get('.q-field__messages').text()).toBe('')

        await wrapper.get('.q-field__control').trigger('focusin')

        expect(wrapper.get('.q-field__messages').text()).toBe('Pick a file')
      })
    })

    describe('[(prop)prefix]', () => {
      test('type String has effect', () => {
        const propVal = 'File:'
        const wrapper = mountFile({ prefix: propVal })

        expect(wrapper.get('.q-field__prefix').text()).toBe(propVal)
      })
    })

    describe('[(prop)suffix]', () => {
      test('type String has effect', () => {
        const propVal = '(optional)'
        const wrapper = mountFile({ suffix: propVal })

        expect(wrapper.get('.q-field__suffix').text()).toBe(propVal)
      })
    })

    describe('[(prop)label-color]', () => {
      test('type String has effect', () => {
        const propVal = 'primary'
        const wrapper = mountFile({ label: 'Attachment', labelColor: propVal })

        expect(wrapper.get('.q-field__label').classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const propVal = 'primary'
        const wrapper = mountFile({ color: propVal })

        expect(wrapper.get('.q-field__control').classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)bg-color]', () => {
      test('type String has effect', () => {
        const propVal = 'primary'
        const wrapper = mountFile({ bgColor: propVal })

        expect(wrapper.get('.q-field__control').classes()).toContain(
          `bg-${propVal}`
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile()

        expect(wrapper.classes()).not.toContain('q-field--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toContain('q-field--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountFile({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-field--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-field--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)loading]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile()

        expect(wrapper.find('.q-spinner').exists()).toBe(false)

        await wrapper.setProps({ loading: true })

        expect(wrapper.get('.q-field__append .q-spinner').exists()).toBe(true)
      })
    })

    describe('[(prop)clearable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile()

        expect(wrapper.find('.q-field__append .q-icon').exists()).toBe(false)

        await wrapper.setProps({ clearable: true })

        await wrapper.get('.q-field__append .q-icon').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[null]])
        expect(wrapper.emitted('clear')).toStrictEqual([[singleFile]])
      })
    })

    describe('[(prop)clear-icon]', () => {
      test('type String has effect', async () => {
        const propVal = 'delete'
        const wrapper = mountFile({ clearable: true })

        const defaultIcon = wrapper.get('.q-field__append .q-icon').text()
        expect(defaultIcon).not.toBe(propVal)

        await wrapper.setProps({ clearIcon: propVal })

        expect(wrapper.get('.q-field__append .q-icon').text()).toBe(propVal)
      })
    })

    describe('[(prop)filled]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ filled: true })

        expect(wrapper.classes()).toContain('q-field--filled')
      })
    })

    describe('[(prop)outlined]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ outlined: true })

        expect(wrapper.classes()).toContain('q-field--outlined')
      })
    })

    describe('[(prop)borderless]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ borderless: true })

        expect(wrapper.classes()).toContain('q-field--borderless')
      })
    })

    describe('[(prop)standout]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ standout: true })

        expect(wrapper.classes()).toContain('q-field--standout')
      })

      test('type String has effect', async () => {
        const propVal = 'bg-teal text-white'
        const wrapper = mountFile({ standout: propVal })

        // the custom classes only apply while focused
        expect(wrapper.get('.q-field__control').classes()).not.toContain(
          'bg-teal'
        )

        await wrapper.get('.q-field__control').trigger('focusin')

        expect(wrapper.get('.q-field__control').classes()).toEqual(
          expect.arrayContaining(['bg-teal', 'text-white'])
        )
      })
    })

    describe('[(prop)label-slot]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile()

        expect(wrapper.classes()).not.toContain('q-field--labeled')

        await wrapper.setProps({ labelSlot: true })

        expect(wrapper.classes()).toContain('q-field--labeled')
      })
    })

    describe('[(prop)bottom-slots]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile({ error: null })

        expect(wrapper.find('.q-field__bottom').exists()).toBe(false)

        await wrapper.setProps({ bottomSlots: true })

        expect(wrapper.find('.q-field__bottom').exists()).toBe(true)
      })
    })

    describe('[(prop)hide-bottom-space]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile({ hint: 'Some hint' })

        expect(wrapper.classes()).toContain('q-field--with-bottom')

        await wrapper.setProps({ hideBottomSpace: true })

        expect(wrapper.classes()).not.toContain('q-field--with-bottom')
        expect(wrapper.get('.q-field__bottom').classes()).toContain(
          'q-field__bottom--stale'
        )
      })
    })

    describe('[(prop)counter]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile({
          modelValue: makeFile('a.txt', { size: 3 })
        })

        expect(wrapper.find('.q-field__counter').exists()).toBe(false)

        await wrapper.setProps({ counter: true })

        // the file count comes with the total size attached
        expect(wrapper.get('.q-field__counter').text()).toMatch(/^1 \(.+\)$/)
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ rounded: true })

        expect(wrapper.classes()).toContain('q-field--rounded')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ square: true })

        expect(wrapper.classes()).toContain('q-field--square')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ dense: true })

        expect(wrapper.classes()).toContain('q-field--dense')
      })
    })

    describe('[(prop)item-aligned]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ itemAligned: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-field--item-aligned', 'q-item-type'])
        )
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ disable: true })

        expect(wrapper.classes()).toContain('q-field--disabled')
        // the native input cannot be reached anymore
        expect(getInput(wrapper).attributes('disabled')).toBe('')

        wrapper.vm.addFiles([makeFile('a.txt')])

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountFile({ readonly: true })

        expect(wrapper.classes()).toContain('q-field--readonly')
        expect(wrapper.classes()).not.toContain('q-field--disabled')
        expect(getInput(wrapper).attributes('disabled')).toBe('')

        wrapper.vm.addFiles([makeFile('a.txt')])

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)autofocus]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile(
          { autofocus: true },
          { attachTo: document.body }
        )
        await flushPromises()

        // QFile brings its own control, so it focuses it directly
        expect(getNative(wrapper).element).toBe(document.activeElement)
      })
    })

    describe('[(prop)for]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-file'
        const wrapper = mountFile()

        await wrapper.setProps({ for: propVal })

        expect(wrapper.attributes('for')).toBe(propVal)
        // the native input is what the label points at
        expect(getInput(wrapper).attributes('id')).toBe(propVal)
      })
    })

    describe('[(prop)append]', () => {
      test('type Boolean has effect', () => {
        const props = {
          modelValue: [makeFile('a.txt')],
          multiple: true
        }

        const replacing = mountFile(props)
        replacing.vm.addFiles([makeFile('b.txt')])

        expect(
          replacing.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['b.txt'])

        const wrapper = mountFile({ ...props, append: true })
        wrapper.vm.addFiles([makeFile('b.txt')])

        // the new file is added to the current ones
        expect(
          wrapper.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['a.txt', 'b.txt'])
      })
    })

    describe('[(prop)display-value]', () => {
      test('type Number has effect', () => {
        const propVal = 10
        const wrapper = mountFile({ displayValue: propVal })

        expect(getDisplay(wrapper).text()).toBe(String(propVal))
      })

      test('type String has effect', () => {
        const propVal = '1 file attached'
        const wrapper = mountFile({ displayValue: propVal })

        // it overrides the file names
        expect(getDisplay(wrapper).text()).toBe(propVal)
      })
    })

    describe('[(prop)use-chips]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountFile({
          modelValue: [makeFile('a.txt'), makeFile('b.txt')],
          multiple: true
        })

        expect(wrapper.find('.q-chip').exists()).toBe(false)

        await wrapper.setProps({ useChips: true })

        const chips = wrapper.findAll('.q-chip')
        expect(chips.map(chip => chip.get('.ellipsis').text())).toStrictEqual([
          'a.txt',
          'b.txt'
        ])

        // each chip can remove its own file
        await chips[0].get('.q-chip__icon--remove').trigger('click')

        expect(
          wrapper.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['b.txt'])
      })
    })

    describe('[(prop)counter-label]', () => {
      test('type Function has effect', () => {
        let scope
        const propVal = params => {
          scope = params
          return 'my counter'
        }
        const wrapper = mountFile({
          counter: true,
          maxFiles: 3,
          counterLabel: propVal
        })

        expect(wrapper.get('.q-field__counter').text()).toBe('my counter')
        expect(scope).toStrictEqual({
          totalSize: expect.any(String),
          filesNumber: 1,
          maxFiles: 3
        })
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', async () => {
        const propVal = 100
        const wrapper = mountFile()

        expect(getNative(wrapper).attributes('tabindex')).toBe('0')

        await wrapper.setProps({ tabindex: propVal })

        expect(getNative(wrapper).attributes('tabindex')).toBe(String(propVal))
      })

      test('type String has effect', () => {
        const propVal = '100'
        const wrapper = mountFile({ tabindex: propVal })

        expect(getNative(wrapper).attributes('tabindex')).toBe(propVal)
      })
    })

    describe('[(prop)input-class]', () => {
      test('type String has effect', () => {
        const propVal = 'my-class'
        const wrapper = mountFile({ inputClass: propVal })

        expect(getDisplay(wrapper).classes()).toContain(propVal)
      })

      test('type Array has effect', () => {
        const propVal = ['my-class', 'my-other-class']
        const wrapper = mountFile({ inputClass: propVal })

        expect(getDisplay(wrapper).classes()).toEqual(
          expect.arrayContaining(propVal)
        )
      })

      test('type Object has effect', () => {
        const propVal = { 'my-class': true, unused: false }
        const wrapper = mountFile({ inputClass: propVal })

        expect(getDisplay(wrapper).classes()).toContain('my-class')
        expect(getDisplay(wrapper).classes()).not.toContain('unused')
      })
    })

    describe('[(prop)input-style]', () => {
      test('type String has effect', () => {
        const propVal = 'color: red'
        const wrapper = mountFile({ inputStyle: propVal })

        expect(getDisplay(wrapper).$style('color')).toBe('red')
      })

      test('type Array has effect', () => {
        const propVal = ['color: red', { backgroundColor: 'blue' }]
        const wrapper = mountFile({ inputStyle: propVal })

        expect(getDisplay(wrapper).$style('color')).toBe('red')
        expect(getDisplay(wrapper).$style('backgroundColor')).toBe('blue')
      })

      test('type Object has effect', () => {
        const propVal = { color: 'red' }
        const wrapper = mountFile({ inputStyle: propVal })

        expect(getDisplay(wrapper).$style('color')).toBe('red')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile({}, { slots: { default: () => slotContent } })

        expect(wrapper.get('.q-field__control').text()).toContain(slotContent)
      })
    })

    describe('[(slot)prepend]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile({}, { slots: { prepend: () => slotContent } })

        expect(wrapper.get('.q-field__prepend').text()).toBe(slotContent)
      })
    })

    describe('[(slot)append]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile({}, { slots: { append: () => slotContent } })

        expect(wrapper.get('.q-field__append').text()).toBe(slotContent)
      })
    })

    describe('[(slot)before]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile({}, { slots: { before: () => slotContent } })

        expect(wrapper.get('.q-field__before').text()).toBe(slotContent)
      })
    })

    describe('[(slot)after]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile({}, { slots: { after: () => slotContent } })

        expect(wrapper.get('.q-field__after').text()).toBe(slotContent)
      })
    })

    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile(
          { labelSlot: true },
          { slots: { label: () => slotContent } }
        )

        expect(wrapper.get('.q-field__label').text()).toBe(slotContent)
      })
    })

    describe('[(slot)error]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile(
          { error: true },
          { slots: { error: () => slotContent } }
        )

        expect(wrapper.get('.q-field__messages').text()).toBe(slotContent)
      })
    })

    describe('[(slot)hint]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile(
          { bottomSlots: true },
          { slots: { hint: () => slotContent } }
        )

        expect(wrapper.get('.q-field__messages').text()).toBe(slotContent)
      })
    })

    describe('[(slot)counter]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile(
          { bottomSlots: true },
          { slots: { counter: () => slotContent } }
        )

        expect(wrapper.get('.q-field__counter').text()).toBe(slotContent)
      })
    })

    describe('[(slot)loading]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountFile(
          { loading: true },
          { slots: { loading: () => slotContent } }
        )

        expect(wrapper.get('.q-field__append').text()).toBe(slotContent)
        expect(wrapper.find('.q-spinner').exists()).toBe(false)
      })
    })

    describe('[(slot)file]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountFile(
          {
            modelValue: [makeFile('a.txt'), makeFile('b.txt')],
            multiple: true
          },
          {
            slots: {
              file: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        // it renders once per file
        expect(getNative(wrapper).text()).toBe(slotContent.repeat(2))

        expect(slotScope).toStrictEqual({
          index: expect.any(Number),
          file: expect.any(File),
          ref: expect.any(Object)
        })
        expect(slotScope.index).toBe(1)
        expect(slotScope.file.name).toBe('b.txt')
      })
    })

    describe('[(slot)selected]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountFile(
          {
            modelValue: [makeFile('a.txt'), makeFile('b.txt')],
            multiple: true
          },
          {
            slots: {
              selected: scope => {
                slotScope = scope
                return slotContent
              }
            }
          }
        )

        // it takes over the whole selection, so it renders once
        expect(getNative(wrapper).text()).toBe(slotContent)

        expect(slotScope).toStrictEqual({
          files: expect.any(Array),
          ref: expect.any(Object)
        })
        expect(slotScope.files.map(file => file.name)).toStrictEqual([
          'a.txt',
          'b.txt'
        ])
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)rejected]', () => {
      test('is emitting', () => {
        const wrapper = mountFile({
          modelValue: null,
          multiple: true,
          maxFiles: 1
        })

        wrapper.vm.addFiles([makeFile('a.txt'), makeFile('b.txt')])

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('rejected')
        expect(eventList.rejected).toHaveLength(1)

        const [rejectedEntries] = eventList.rejected[0]
        expect(Array.isArray(rejectedEntries)).toBe(true)
        expect(rejectedEntries).toStrictEqual([
          { failedPropValidation: 'max-files', file: expect.any(File) }
        ])
      })
    })

    describe('[(event)update:model-value]', () => {
      test('is emitting', () => {
        const wrapper = mountFile({ modelValue: null })

        wrapper.vm.addFiles([makeFile('a.txt')])

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBeInstanceOf(File)
        expect(value.name).toBe('a.txt')
      })
    })

    describe('[(event)focus]', () => {
      test('is emitting', async () => {
        const wrapper = mountFile()

        await wrapper.get('.q-field__control').trigger('focusin')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('focus')
        expect(eventList.focus).toHaveLength(1)

        const [evt] = eventList.focus[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)blur]', () => {
      test('is emitting', async () => {
        const wrapper = mountFile()

        await wrapper.get('.q-field__control').trigger('focusin')
        await wrapper.get('.q-field__control').trigger('focusout')
        await flushTimers()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('blur')
        expect(eventList.blur).toHaveLength(1)

        const [evt] = eventList.blur[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)clear]', () => {
      test('is emitting', async () => {
        const wrapper = mountFile({ clearable: true })

        await wrapper.get('.q-field__append .q-icon').trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('clear')
        expect(eventList.clear).toHaveLength(1)

        // it reports the value that was cleared
        const [value] = eventList.clear[0]
        expect(value).toBe(singleFile)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)pickFiles]', () => {
      test('should be callable', () => {
        const wrapper = mountFile()
        const clickSpy = vi.spyOn(getInput(wrapper).element, 'click')

        expect(wrapper.vm.pickFiles(new Event('click'))).toBeUndefined()

        // it opens the native file dialog
        expect(clickSpy).toHaveBeenCalledTimes(1)

        vi.restoreAllMocks()
      })

      test('does nothing while not editable', () => {
        const wrapper = mountFile({ disable: true })
        const clickSpy = vi.spyOn(getInput(wrapper).element, 'click')

        wrapper.vm.pickFiles(new Event('click'))

        expect(clickSpy).not.toHaveBeenCalled()

        vi.restoreAllMocks()
      })
    })

    describe('[(method)addFiles]', () => {
      test('should be callable', () => {
        const wrapper = mountFile({ modelValue: null })

        expect(wrapper.vm.addFiles([makeFile('a.txt')])).toBeUndefined()

        expect(wrapper.emitted('update:modelValue')[0][0].name).toBe('a.txt')
      })
    })

    describe('[(method)resetValidation]', () => {
      test('should be callable', async () => {
        const wrapper = mountFile({ rules: [maxThreeChars] })

        wrapper.vm.validate()
        await flushPromises()
        expect(wrapper.classes()).toContain('q-field--error')

        expect(wrapper.vm.resetValidation()).toBeUndefined()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')
      })
    })

    describe('[(method)validate]', () => {
      test('should be callable', async () => {
        const wrapper = mountFile({
          modelValue: makeFile('ab'),
          rules: [maxThreeChars]
        })

        expect(wrapper.vm.validate()).toBe(true)
        await flushPromises()
        expect(wrapper.classes()).not.toContain('q-field--error')

        // it can also validate a value that is not the model
        expect(wrapper.vm.validate(makeFile('abcd'))).toBe(false)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(method)focus]', () => {
      test('should be callable', async () => {
        const wrapper = mountFile({}, { attachTo: document.body })

        expect(wrapper.vm.focus()).toBeUndefined()
        await flushPromises()

        expect(getNative(wrapper).element).toBe(document.activeElement)
      })
    })

    describe('[(method)blur]', () => {
      test('should be callable', async () => {
        const wrapper = mountFile({}, { attachTo: document.body })

        wrapper.vm.focus()
        await flushPromises()
        expect(getNative(wrapper).element).toBe(document.activeElement)

        expect(wrapper.vm.blur()).toBeUndefined()
        await flushPromises()

        expect(getNative(wrapper).element).not.toBe(document.activeElement)
      })
    })

    describe('[(method)removeAtIndex]', () => {
      test('should be callable', () => {
        const wrapper = mountFile({
          modelValue: [makeFile('a.txt'), makeFile('b.txt')],
          multiple: true
        })

        expect(wrapper.vm.removeAtIndex(0)).toBeUndefined()

        expect(
          wrapper.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['b.txt'])
      })
    })

    describe('[(method)removeFile]', () => {
      test('should be callable', () => {
        const first = makeFile('a.txt')
        const wrapper = mountFile({
          modelValue: [first, makeFile('b.txt')],
          multiple: true
        })

        expect(wrapper.vm.removeFile(first)).toBeUndefined()

        expect(
          wrapper.emitted('update:modelValue')[0][0].map(file => file.name)
        ).toStrictEqual(['b.txt'])
      })

      test('ignores a file that is not in the model', () => {
        const wrapper = mountFile({
          modelValue: [makeFile('a.txt')],
          multiple: true
        })

        wrapper.vm.removeFile(makeFile('other.txt'))

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(method)getNativeElement]', () => {
      test('should be callable', () => {
        const wrapper = mountFile()

        // deprecated in favour of the nativeEl computed prop
        expect(wrapper.vm.getNativeElement()).toBe(getInput(wrapper).element)
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)hasError]', () => {
      test('should be exposed', async () => {
        const wrapper = mountFile()

        expect(wrapper.vm.hasError).toBe(false)

        await wrapper.setProps({ error: true })

        expect(wrapper.vm.hasError).toBe(true)
      })
    })

    describe('[(computedProp)nativeEl]', () => {
      test('should be exposed', () => {
        const wrapper = mountFile()

        expect(wrapper.vm.nativeEl).toBeInstanceOf(HTMLInputElement)
        expect(wrapper.vm.nativeEl).toBe(getInput(wrapper).element)
      })
    })
  })

  describe('[Accessibility]', () => {
    test('marks the native control invalid while in error state', () => {
      const wrapper = mountFile({ error: true })

      expect(getInput(wrapper).attributes('aria-invalid')).toBe('true')

      const noError = mountFile()

      expect(getInput(noError).attributes('aria-invalid')).toBeUndefined()
    })

    test('links the native control to the error message', () => {
      const wrapper = mountFile({
        error: true,
        errorMessage: 'Please attach a file'
      })

      const input = getInput(wrapper)
      const messageId = wrapper.get('.q-field__messages').attributes('id')

      expect(messageId).toBeTruthy()
      expect(input.attributes('aria-errormessage')).toBe(messageId)
      expect(input.attributes('aria-describedby')).toBe(messageId)
    })

    test('preserves externally supplied ARIA references', () => {
      const wrapper = mountFile(
        { error: true, errorMessage: 'Please attach a file' },
        {
          attrs: {
            'aria-describedby': 'external-help',
            // ARIA defines aria-errormessage as a single id reference,
            // so an explicit value is kept instead of being concatenated
            'aria-errormessage': 'external-error'
          }
        }
      )

      const input = getInput(wrapper)
      const messageId = wrapper.get('.q-field__messages').attributes('id')

      expect(input.attributes('aria-errormessage')).toBe('external-error')
      expect(input.attributes('aria-describedby')).toBe(
        `external-help ${messageId}`
      )
    })
  })
})
