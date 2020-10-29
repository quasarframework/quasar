import QBtn from '../btn/QBtn.js'
import QBtnDropdown from '../btn-dropdown/QBtnDropdown.js'
import QIcon from '../icon/QIcon.js'
import QTooltip from '../tooltip/QTooltip.js'
import QList from '../item/QList.js'
import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'

import { prevent, stop } from '../../utils/event.js'
import { slot } from '../../utils/slot.js'
import { shouldIgnoreKey } from '../../utils/key-composition.js'

function run (e, btn, vm) {
  if (btn.handler) {
    btn.handler(e, vm, vm.caret)
  }
  else {
    vm.runCmd(btn.cmd, btn.param)
  }
}

function __getGroup (h, children) {
  return h('div', {
    staticClass: 'q-editor__toolbar-group'
  }, children)
}

function getBtn (h, vm, btn, clickHandler, active = false) {
  const
    toggled = active || (btn.type === 'toggle'
      ? (btn.toggled ? btn.toggled(vm) : btn.cmd && vm.caret.is(btn.cmd, btn.param))
      : false),
    child = [],
    events = {
      click (e) {
        clickHandler && clickHandler()
        run(e, btn, vm)
      }
    }

  if (btn.tip && vm.$q.platform.is.desktop) {
    const Key = btn.key
      ? h('div', [h('small', `(CTRL + ${String.fromCharCode(btn.key)})`)])
      : null
    child.push(
      h(QTooltip, { props: { delay: 1000 } }, [
        h('div', { domProps: { innerHTML: btn.tip } }),
        Key
      ])
    )
  }

  return h(QBtn, {
    props: {
      ...vm.buttonProps,
      icon: btn.icon !== null ? btn.icon : void 0,
      color: toggled ? btn.toggleColor || vm.toolbarToggleColor : btn.color || vm.toolbarColor,
      textColor: toggled && !vm.toolbarPush ? null : btn.textColor || vm.toolbarTextColor,
      label: btn.label,
      disable: btn.disable ? (typeof btn.disable === 'function' ? btn.disable(vm) : true) : false,
      size: 'sm'
    },
    on: events
  }, child)
}

function getDropdown (h, vm, btn) {
  const onlyIcons = btn.list === 'only-icons'
  let
    label = btn.label,
    icon = btn.icon !== null ? btn.icon : void 0,
    contentClass,
    Items

  function closeDropdown () {
    Dropdown.componentInstance.hide()
  }

  if (onlyIcons) {
    Items = btn.options.map(btn => {
      const active = btn.type === void 0
        ? vm.caret.is(btn.cmd, btn.param)
        : false

      if (active) {
        label = btn.tip
        icon = btn.icon !== null ? btn.icon : void 0
      }
      return getBtn(h, vm, btn, closeDropdown, active)
    })
    contentClass = vm.toolbarBackgroundClass
    Items = [
      __getGroup(h, Items)
    ]
  }
  else {
    const activeClass = vm.toolbarToggleColor !== void 0
      ? `text-${vm.toolbarToggleColor}`
      : null
    const inactiveClass = vm.toolbarTextColor !== void 0
      ? `text-${vm.toolbarTextColor}`
      : null

    const noIcons = btn.list === 'no-icons'

    Items = btn.options.map(btn => {
      const disable = btn.disable ? btn.disable(vm) : false
      const active = btn.type === void 0
        ? vm.caret.is(btn.cmd, btn.param)
        : false

      if (active) {
        label = btn.tip
        icon = btn.icon !== null ? btn.icon : void 0
      }

      const htmlTip = btn.htmlTip

      return h(
        QItem,
        {
          props: { active, activeClass, clickable: true, disable: disable, dense: true },
          on: {
            click (e) {
              closeDropdown()
              vm.$refs.content && vm.$refs.content.focus()
              vm.caret.restore()
              run(e, btn, vm)
            }
          }
        },
        [
          noIcons === true
            ? null
            : h(QItemSection, {
              class: active ? activeClass : inactiveClass,
              props: { side: true }
            }, [
              h(QIcon, { props: { name: btn.icon !== null ? btn.icon : void 0 } })
            ]),

          h(QItemSection, [
            htmlTip
              ? h('div', {
                staticClass: 'text-no-wrap',
                domProps: { innerHTML: btn.htmlTip }
              })
              : (
                btn.tip
                  ? h('div', { staticClass: 'text-no-wrap' }, [ btn.tip ])
                  : null
              )
          ])
        ]
      )
    })
    contentClass = [vm.toolbarBackgroundClass, inactiveClass]
    Items = [
      h(QList, [ Items ])
    ]
  }

  const highlight = btn.highlight && label !== btn.label
  const Dropdown = h(
    QBtnDropdown,
    {
      props: {
        ...vm.buttonProps,
        noCaps: true,
        noWrap: true,
        color: highlight ? vm.toolbarToggleColor : vm.toolbarColor,
        textColor: highlight && !vm.toolbarPush ? null : vm.toolbarTextColor,
        label: btn.fixedLabel ? btn.label : label,
        icon: btn.fixedIcon ? (btn.icon !== null ? btn.icon : void 0) : icon,
        contentClass
      }
    },
    Items
  )
  return Dropdown
}

export function getToolbar (h, vm) {
  if (vm.caret) {
    return vm.buttons
      .filter(f => {
        return !vm.isViewingSource || f.find(fb => fb.cmd === 'viewsource')
      })
      .map(group => __getGroup(
        h,
        group.map(btn => {
          if (vm.isViewingSource && btn.cmd !== 'viewsource') {
            return false
          }

          if (btn.type === 'slot') {
            return slot(vm, btn.slot)
          }

          if (btn.type === 'dropdown') {
            return getDropdown(h, vm, btn)
          }

          return getBtn(h, vm, btn)
        })
      ))
  }
}

export function getFonts (defaultFont, defaultFontLabel, defaultFontIcon, fonts = {}) {
  const aliases = Object.keys(fonts)
  if (aliases.length === 0) {
    return {}
  }

  const def = {
    default_font: {
      cmd: 'fontName',
      param: defaultFont,
      icon: defaultFontIcon,
      tip: defaultFontLabel
    }
  }

  aliases.forEach(alias => {
    const name = fonts[alias]
    def[alias] = {
      cmd: 'fontName',
      param: name,
      icon: defaultFontIcon,
      tip: name,
      htmlTip: `<font face="${name}">${name}</font>`
    }
  })

  return def
}

export function getLinkEditor (h, vm, ie11) {
  if (vm.caret) {
    const color = vm.toolbarColor || vm.toolbarTextColor
    let link = vm.editLinkUrl
    const updateLink = () => {
      vm.caret.restore()

      if (link !== vm.editLinkUrl) {
        document.execCommand('createLink', false, link === '' ? ' ' : link)
      }

      vm.editLinkUrl = null

      ie11 === true && vm.$nextTick(vm.__onInput)
    }

    return [
      h('div', { staticClass: 'q-mx-xs', 'class': `text-${color}` }, [`${vm.$q.lang.editor.url}: `]),
      h('input', {
        key: 'qedt_btm_input',
        staticClass: 'col q-editor__link-input',
        domProps: {
          value: link
        },
        on: {
          input: e => {
            stop(e)
            link = e.target.value
          },
          keydown: event => {
            if (shouldIgnoreKey(event) === true) {
              return
            }

            switch (event.keyCode) {
              case 13: // ENTER key
                prevent(event)
                return updateLink()
              case 27: // ESCAPE key
                prevent(event)
                vm.caret.restore()
                if (!vm.editLinkUrl || vm.editLinkUrl === 'https://') {
                  document.execCommand('unlink')
                }
                vm.editLinkUrl = null
                break
            }
          }
        }
      }),
      __getGroup(h, [
        h(QBtn, {
          key: 'qedt_btm_rem',
          attrs: { tabindex: -1 },
          props: {
            ...vm.buttonProps,
            label: vm.$q.lang.label.remove,
            noCaps: true
          },
          on: {
            click: () => {
              vm.caret.restore()
              document.execCommand('unlink')
              vm.editLinkUrl = null

              ie11 === true && vm.$nextTick(vm.__onInput)
            }
          }
        }),
        h(QBtn, {
          key: 'qedt_btm_upd',
          props: {
            ...vm.buttonProps,
            label: vm.$q.lang.label.update,
            noCaps: true
          },
          on: {
            click: updateLink
          }
        })
      ])
    ]
  }
}
