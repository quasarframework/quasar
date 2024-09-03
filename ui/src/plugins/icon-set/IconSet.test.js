import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import IconSet from './IconSet.js'

const mountPlugin = () => mount({ template: '<div />' })

describe('[IconSet API]', () => {
  describe('[Injection]', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()

      expect(wrapper.vm.$q.iconSet).toBeDefined()
      expect(wrapper.vm.$q.iconSet.name).toBe(IconSet.props.name)
      expect(wrapper.vm.$q.iconSet.set).toBe(IconSet.set)
    })
  })

  describe('[Props]', () => {
    describe('[(prop)props]', () => {
      test('is correct type', () => {
        mountPlugin()

        expect(IconSet.props).toStrictEqual({
          name: expect.any(String),
          type: {
            positive: expect.any(String),
            negative: expect.any(String),
            info: expect.any(String),
            warning: expect.any(String)
          },
          arrow: {
            up: expect.any(String),
            right: expect.any(String),
            down: expect.any(String),
            left: expect.any(String),
            dropdown: expect.any(String)
          },
          chevron: {
            left: expect.any(String),
            right: expect.any(String)
          },
          colorPicker: {
            spectrum: expect.any(String),
            tune: expect.any(String),
            palette: expect.any(String)
          },
          pullToRefresh: {
            icon: expect.any(String)
          },
          carousel: {
            left: expect.any(String),
            right: expect.any(String),
            up: expect.any(String),
            down: expect.any(String),
            navigationIcon: expect.any(String)
          },
          chip: {
            remove: expect.any(String),
            selected: expect.any(String)
          },
          datetime: {
            arrowLeft: expect.any(String),
            arrowRight: expect.any(String),
            now: expect.any(String),
            today: expect.any(String)
          },
          editor: {
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
            heading: expect.any(String),
            code: expect.any(String),
            size: expect.any(String),
            font: expect.any(String),
            viewSource: expect.any(String)
          },
          expansionItem: {
            icon: expect.any(String),
            denseIcon: expect.any(String)
          },
          fab: {
            icon: expect.any(String),
            activeIcon: expect.any(String)
          },
          field: {
            clear: expect.any(String),
            error: expect.any(String)
          },
          pagination: {
            first: expect.any(String),
            prev: expect.any(String),
            next: expect.any(String),
            last: expect.any(String)
          },
          rating: {
            icon: expect.any(String)
          },
          stepper: {
            done: expect.any(String),
            active: expect.any(String),
            error: expect.any(String)
          },
          tabs: {
            left: expect.any(String),
            right: expect.any(String),
            up: expect.any(String),
            down: expect.any(String)
          },
          table: {
            arrowUp: expect.any(String),
            warning: expect.any(String),
            firstPage: expect.any(String),
            prevPage: expect.any(String),
            nextPage: expect.any(String),
            lastPage: expect.any(String)
          },
          tree: {
            icon: expect.any(String)
          },
          uploader: {
            done: expect.any(String),
            clear: expect.any(String),
            add: expect.any(String),
            upload: expect.any(String),
            removeQueue: expect.any(String),
            removeUploaded: expect.any(String)
          }
        })
      })

      test('can be set', () => {
        const wrapper = mountPlugin()

        IconSet.props.name = 'new-icon-set'
        expect(IconSet.props.name).toBe('new-icon-set')
        expect(wrapper.vm.$q.iconSet.name).toBe('new-icon-set')

        wrapper.vm.$q.iconSet.name = 'another-icon-set'
        expect(IconSet.props.name).toBe('another-icon-set')
        expect(wrapper.vm.$q.iconSet.name).toBe('another-icon-set')
      })
    })

    describe('[(prop)iconMapFn]', () => {
      test('is correct type', () => {
        mountPlugin()
        expect(IconSet.iconMapFn).$any([
          expect.any(Function),
          null
        ])
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)set]', () => {
      test('should be callable', () => {
        const wrapper = mountPlugin()

        expect(
          IconSet.set({
            name: 'new-icon-set',
            type: {
              positive: 'check_circle',
              negative: 'warning',
              info: 'info',
              warning: 'priority_high'
            },
            arrow: {
              up: 'arrow_upward',
              right: 'arrow_forward',
              down: 'arrow_downward',
              left: 'arrow_back',
              dropdown: 'arrow_drop_down'
            },
            chevron: {
              left: 'chevron_left',
              right: 'chevron_right'
            },
            colorPicker: {
              spectrum: 'gradient',
              tune: 'tune',
              palette: 'style'
            },
            pullToRefresh: {
              icon: 'refresh'
            },
            carousel: {
              left: 'chevron_left',
              right: 'chevron_right',
              up: 'keyboard_arrow_up',
              down: 'keyboard_arrow_down',
              navigationIcon: 'lens'
            },
            chip: {
              remove: 'cancel',
              selected: 'check'
            },
            datetime: {
              arrowLeft: 'chevron_left',
              arrowRight: 'chevron_right',
              now: 'access_time',
              today: 'today'
            },
            editor: {
              bold: 'format_bold',
              italic: 'format_italic',
              strikethrough: 'strikethrough_s',
              underline: 'format_underlined',
              unorderedList: 'format_list_bulleted',
              orderedList: 'format_list_numbered',
              subscript: 'vertical_align_bottom',
              superscript: 'vertical_align_top',
              hyperlink: 'link',
              toggleFullscreen: 'fullscreen',
              quote: 'format_quote',
              left: 'format_align_left',
              center: 'format_align_center',
              right: 'format_align_right',
              justify: 'format_align_justify',
              print: 'print',
              outdent: 'format_indent_decrease',
              indent: 'format_indent_increase',
              removeFormat: 'format_clear',
              formatting: 'text_format',
              fontSize: 'format_size',
              align: 'format_align_left',
              hr: 'remove',
              undo: 'undo',
              redo: 'redo',
              heading: 'format_size',
              heading1: 'format_size',
              heading2: 'format_size',
              heading3: 'format_size',
              heading4: 'format_size',
              heading5: 'format_size',
              heading6: 'format_size',
              code: 'code',
              size: 'format_size',
              size1: 'format_size',
              size2: 'format_size',
              size3: 'format_size',
              size4: 'format_size',
              size5: 'format_size',
              size6: 'format_size',
              size7: 'format_size',
              font: 'font_download',
              viewSource: 'code'
            },
            expansionItem: {
              icon: 'keyboard_arrow_down',
              denseIcon: 'arrow_drop_down'
            },
            fab: {
              icon: 'add',
              activeIcon: 'close'
            },
            field: {
              clear: 'cancel',
              error: 'error'
            },
            pagination: {
              first: 'first_page',
              prev: 'keyboard_arrow_left',
              next: 'keyboard_arrow_right',
              last: 'last_page'
            },
            rating: {
              icon: 'grade'
            },
            stepper: {
              done: 'check',
              active: 'edit',
              error: 'warning'
            },
            tabs: {
              left: 'chevron_left',
              right: 'chevron_right',
              up: 'keyboard_arrow_up',
              down: 'keyboard_arrow_down'
            },
            table: {
              arrowUp: 'arrow_upward',
              warning: 'warning',
              firstPage: 'first_page',
              prevPage: 'chevron_left',
              nextPage: 'chevron_right',
              lastPage: 'last_page'
            },
            tree: {
              icon: 'play_arrow'
            },
            uploader: {
              done: 'done',
              clear: 'clear',
              add: 'add_box',
              upload: 'cloud_upload',
              removeQueue: 'clear_all',
              removeUploaded: 'done_all'
            }
          })
        ).toBeUndefined()

        expect(IconSet.props.name).toBe('new-icon-set')
        expect(wrapper.vm.$q.iconSet.name).toBe('new-icon-set')
      })

      test('should work with an imported icon set', async () => {
        const { vm: { $q } } = mountPlugin()
        const { default: newIconSet } = await import('quasar/icon-set/fontawesome-v6.js')

        IconSet.set(newIconSet)
        expect(IconSet.props.name).toBe(newIconSet.name)
        expect($q.iconSet.name).toBe(newIconSet.name)

        const { default: anotherIconSet } = await import('quasar/icon-set/ionicons-v4.js')
        $q.iconSet.set(anotherIconSet)
        expect(IconSet.props.name).toBe(anotherIconSet.name)
        expect($q.iconSet.name).toBe(anotherIconSet.name)
      })
    })
  })
})
