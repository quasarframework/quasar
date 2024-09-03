import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Lang from './Lang.js'

const mountPlugin = () => mount({ template: '<div />' })

describe('[Lang API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()

      expect(wrapper.vm.$q.lang).toBeDefined()
      expect(wrapper.vm.$q.lang.name).toBe(Lang.props.name)
      expect(wrapper.vm.$q.lang.set).toBe(Lang.set)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)props]', () => {
      test('is correct type', () => {
        mountPlugin()

        expect(Lang.props).toStrictEqual({
          isoName: expect.any(String),
          nativeName: expect.any(String),
          rtl: expect.any(Boolean),
          label: {
            clear: expect.any(String),
            ok: expect.any(String),
            cancel: expect.any(String),
            close: expect.any(String),
            set: expect.any(String),
            select: expect.any(String),
            reset: expect.any(String),
            remove: expect.any(String),
            update: expect.any(String),
            create: expect.any(String),
            search: expect.any(String),
            filter: expect.any(String),
            refresh: expect.any(String),
            expand: expect.any(Function),
            collapse: expect.any(Function)
          },
          date: {
            days: expect.any(Array),
            daysShort: expect.any(Array),
            months: expect.any(Array),
            monthsShort: expect.any(Array),
            firstDayOfWeek: expect.any(Number),
            format24h: expect.any(Boolean),
            pluralDay: expect.any(String)
          },
          table: {
            noData: expect.any(String),
            noResults: expect.any(String),
            loading: expect.any(String),
            selectedRecords: expect.any(Function),
            recordsPerPage: expect.any(String),
            allRows: expect.any(String),
            pagination: expect.any(Function),
            columns: expect.any(String)
          },
          editor: {
            url: expect.any(String),
            bold: expect.any(String),
            italic: expect.any(String),
            strikethrough: expect.any(String),
            underline: expect.any(String),
            unorderedList: expect.any(String),
            orderedList: expect.any(String),
            subscript: expect.any(String),
            superscript: expect.any(String),
            hyperlink: expect.any(String),
            toggleFullscreen: expect.any(String),
            quote: expect.any(String),
            left: expect.any(String),
            center: expect.any(String),
            right: expect.any(String),
            justify: expect.any(String),
            print: expect.any(String),
            outdent: expect.any(String),
            indent: expect.any(String),
            removeFormat: expect.any(String),
            formatting: expect.any(String),
            fontSize: expect.any(String),
            align: expect.any(String),
            hr: expect.any(String),
            undo: expect.any(String),
            redo: expect.any(String),
            heading1: expect.any(String),
            heading2: expect.any(String),
            heading3: expect.any(String),
            heading4: expect.any(String),
            heading5: expect.any(String),
            heading6: expect.any(String),
            paragraph: expect.any(String),
            code: expect.any(String),
            size1: expect.any(String),
            size2: expect.any(String),
            size3: expect.any(String),
            size4: expect.any(String),
            size5: expect.any(String),
            size6: expect.any(String),
            size7: expect.any(String),
            defaultFont: expect.any(String),
            viewSource: expect.any(String)
          },
          tree: {
            noNodes: expect.any(String),
            noResults: expect.any(String)
          }
        })
      })

      test('can be set', () => {
        const { vm: { $q } } = mountPlugin()

        Lang.props.nativeName = 'new-lang'
        expect(Lang.props.nativeName).toBe('new-lang')
        expect($q.lang.nativeName).toBe('new-lang')

        $q.lang.nativeName = 'another-lang'
        expect(Lang.props.nativeName).toBe('another-lang')
        expect($q.lang.nativeName).toBe('another-lang')
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)set]', () => {
      test('should be callable', () => {
        const wrapper = mountPlugin()

        expect(
          Lang.set({
            isoName: 'en-US',
            nativeName: 'New Language',
            rtl: true,
            label: {
              clear: 'Clear',
              ok: 'OK',
              cancel: 'Cancel',
              close: 'Close',
              set: 'Set',
              select: 'Select',
              reset: 'Reset',
              remove: 'Remove',
              update: 'Update',
              create: 'Create',
              search: 'Search',
              filter: 'Filter',
              refresh: 'Refresh',
              expand: label => (label ? `Expand '${ label }'` : 'Expand'),
              collapse: label => (label ? `Collapse '${ label }'` : 'Collapse')
            },
            date: {
              days: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
              daysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
              months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
              monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
              firstDayOfWeek: 0,
              format24h: true,
              pluralDay: 'days'
            },
            table: {
              noData: 'No data available',
              noResults: 'No matching records found',
              loading: 'Loading...',
              selectedRecords: rows => `${ rows } records selected`,
              recordsPerPage: 'Records per page:',
              allRows: 'All',
              pagination: (start, end, total) => start + '-' + end + ' of ' + total,
              columns: 'Columns'
            },
            editor: {
              url: 'URL',
              bold: 'Bold',
              italic: 'Italic',
              strikethrough: 'Strikethrough',
              underline: 'Underline',
              unorderedList: 'Unordered List',
              orderedList: 'Ordered List',
              subscript: 'Subscript',
              superscript: 'Superscript',
              hyperlink: 'Hyperlink',
              toggleFullscreen: 'Toggle Fullscreen',
              quote: 'Quote',
              left: 'Left align',
              center: 'Center align',
              right: 'Right align',
              justify: 'Justify align',
              print: 'Print',
              outdent: 'Decrease indentation',
              indent: 'Increase indentation',
              removeFormat: 'Remove formatting',
              formatting: 'Formatting',
              fontSize: 'Font Size',
              align: 'Align',
              hr: 'Insert Horizontal Rule',
              undo: 'Undo',
              redo: 'Redo',
              heading1: 'Heading 1',
              heading2: 'Heading 2',
              heading3: 'Heading 3',
              heading4: 'Heading 4',
              heading5: 'Heading 5',
              heading6: 'Heading 6',
              paragraph: 'Paragraph',
              code: 'Code',
              size1: 'Very small',
              size2: 'A bit small',
              size3: 'Normal',
              size4: 'Medium-large',
              size5: 'Big',
              size6: 'Very big',
              size7: 'Maximum',
              defaultFont: 'Default Font',
              viewSource: 'View Source'
            },
            tree: {
              noNodes: 'No nodes available',
              noResults: 'No matching nodes found'
            }
          })
        ).toBeUndefined()

        expect(Lang.props.nativeName).toBe('New Language')
        expect(wrapper.vm.$q.lang.nativeName).toBe('New Language')
      })

      test('should work with an imported lang pack', async () => {
        const { vm: { $q } } = mountPlugin()
        const { default: deLang } = await import('quasar/lang/de-DE.js')

        Lang.set(deLang)
        expect(Lang.props.nativeName).toBe(deLang.nativeName)
        expect($q.lang.nativeName).toBe(deLang.nativeName)

        const { default: itLang } = await import('quasar/lang/it.js')
        $q.lang.set(itLang)
        expect(Lang.props.nativeName).toBe(itLang.nativeName)
        expect($q.lang.nativeName).toBe(itLang.nativeName)
      })
    })

    describe('[(method)getLocale]', () => {
      test('should be callable', () => {
        const wrapper = mountPlugin()

        expect(
          Lang.getLocale()
        ).$any([
          expect.any(String),
          undefined
        ])

        expect(
          wrapper.vm.$q.lang.getLocale()
        ).$any([
          expect.any(String),
          undefined
        ])
      })
    })
  })
})
