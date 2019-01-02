import QBtn from '../btn/QBtn.js'
import QBtnDropdown from '../btn/QBtnDropdown.js'
import QBtnGroup from '../btn/QBtnGroup.js'
import QInput from '../input/QInput.js'
import QIcon from '../icon/QIcon.js'
import QTooltip from '../tooltip/QTooltip.js'
import QList from '../list/QList.js'
import QItem from '../list/QItem.js'
import QItemSection from '../list/QItemSection.js'

function run (e, btn, vm) {
  if (btn.handler) {
    btn.handler(e, vm, vm.caret)
  }
  else {
    vm.runCmd(btn.cmd, btn.param)
  }
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
    child.push(h(QTooltip, { props: {delay: 1000} }, [
      h('div', { domProps: { innerHTML: btn.tip } }),
      Key
    ]))
  }

  return h(QBtn, {
    props: Object.assign({}, vm.buttonProps, {
      icon: btn.icon,
      color: toggled ? btn.toggleColor || vm.toolbarToggleColor : btn.color || vm.toolbarColor,
      textColor: toggled && (vm.toolbarFlat || vm.toolbarOutline) ? null : btn.textColor || vm.toolbarTextColor,
      label: btn.label,
      disable: btn.disable ? (typeof btn.disable === 'function' ? btn.disable(vm) : true) : false
    }),
    on: events
  }, child)
}

function getDropdown (h, vm, btn) {
  let
    label = btn.label,
    icon = btn.icon,
    onlyIcons = btn.list === 'only-icons',
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
        icon = btn.icon
      }
      return getBtn(h, vm, btn, closeDropdown, active)
    })
    contentClass = vm.toolbarBackgroundClass
    Items = [
      h(
        QBtnGroup,
        {
          props: vm.buttonProps,
          staticClass: 'relative-position q-editor-toolbar-padding',
          style: { borderRadius: '0' }
        },
        Items
      )
    ]
  }
  else {
    const activeClass = vm.toolbarToggleColor !== void 0
      ? `text-${vm.toolbarToggleColor}`
      : null
    const inactiveClass = vm.toolbarTextColor !== void 0
      ? `text-${vm.toolbarTextColor}`
      : null

    Items = btn.options.map(btn => {
      const disable = btn.disable ? btn.disable(vm) : false
      const active = btn.type === void 0
        ? vm.caret.is(btn.cmd, btn.param)
        : false

      if (active) {
        label = btn.tip
        icon = btn.icon
      }

      const htmlTip = btn.htmlTip

      return h(
        QItem,
        {
          props: { active, activeClass, clickable: true, disable: disable },
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
          btn.list === 'no-icons'
            ? null
            : h(QItemSection, {
              class: active ? activeClass : inactiveClass,
              props: { side: true }
            }, [
              h(QIcon, { props: { name: btn.icon } })
            ]),

          h(QItemSection, [
            htmlTip
              ? h('div', {
                domProps: { innerHTML: btn.htmlTip }
              })
              : (btn.tip ? h('div', [ btn.tip ]) : null)
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
      props: Object.assign({}, vm.buttonProps, {
        noCaps: true,
        noWrap: true,
        color: highlight ? vm.toolbarToggleColor : vm.toolbarColor,
        textColor: highlight && (vm.toolbarFlat || vm.toolbarOutline) ? null : vm.toolbarTextColor,
        label: btn.fixedLabel ? btn.label : label,
        icon: btn.fixedIcon ? btn.icon : icon,
        contentClass
      })
    },
    Items
  )
  return Dropdown
}

export function getToolbar (h, vm) {
  if (vm.caret) {
    return vm.buttons.map(group => h(
      QBtnGroup,
      { props: vm.buttonProps, staticClass: 'items-center relative-position' },
      group.map(btn => {
        if (btn.type === 'slot') {
          return vm.$slots[btn.slot]
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

export function getLinkEditor (h, vm) {
  if (vm.caret) {
    const color = vm.toolbarColor || vm.toolbarTextColor
    let link = vm.editLinkUrl
    const updateLink = () => {
      vm.caret.restore()
      if (link !== vm.editLinkUrl) {
        document.execCommand('createLink', false, link === '' ? ' ' : link)
      }
      vm.editLinkUrl = null
    }

    return [
      h('div', { staticClass: 'q-mx-xs', 'class': `text-${color}` }, [`${vm.$q.lang.editor.url}: `]),
      h(QInput, {
        key: 'qedt_btm_input',
        staticClass: 'q-ma-none q-pa-none col q-editor-input',
        props: {
          value: link,
          color,
          autofocus: true,
          borderless: true,
          dense: true
        },
        on: {
          input: val => { link = val },
          keydown: event => {
            switch (event.keyCode) {
              case 13: // ENTER key
                event.preventDefault()
                return updateLink()
              case 27: // ESCAPE key
                vm.caret.restore()
                !vm.editLinkUrl && document.execCommand('unlink')
                vm.editLinkUrl = null
                break
            }
          }
        }
      }),
      h(QBtnGroup, {
        key: 'qedt_btm_grp',
        props: vm.buttonProps
      }, [
        h(QBtn, {
          key: 'qedt_btm_rem',
          attrs: {
            tabindex: -1
          },
          props: Object.assign({}, vm.buttonProps, {
            label: vm.$q.lang.label.remove,
            noCaps: true
          }),
          on: {
            click: () => {
              vm.caret.restore()
              document.execCommand('unlink')
              vm.editLinkUrl = null
            }
          }
        }),
        h(QBtn, {
          key: 'qedt_btm_upd',
          props: Object.assign({}, vm.buttonProps, {
            label: vm.$q.lang.label.update,
            noCaps: true
          }),
          on: {
            click: updateLink
          }
        })
      ])
    ]
  }
}
