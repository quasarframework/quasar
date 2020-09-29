import { h } from 'vue'

import QBtn from '../btn/QBtn.js'
import QBtnDropdown from '../btn-dropdown/QBtnDropdown.js'
import QInput from '../input/QInput.js'
import QIcon from '../icon/QIcon.js'
import QTooltip from '../tooltip/QTooltip.js'
import QList from '../item/QList.js'
import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'

import { prevent } from '../../utils/event.js'
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

function __getGroup (children) {
  return h('div', { class: 'q-editor__toolbar-group' }, children)
}

function getBtn (vm, btn, clickHandler, active = false) {
  const
    toggled = active || (btn.type === 'toggle'
      ? (btn.toggled ? btn.toggled(vm) : btn.cmd && vm.caret.is(btn.cmd, btn.param))
      : false),
    child = []

  if (btn.tip && vm.$q.platform.is.desktop) {
    const Key = btn.key
      ? h('div', [
        h('small', `(CTRL + ${String.fromCharCode(btn.key)})`)
      ])
      : null
    child.push(
      h(QTooltip, { delay: 1000 }, () => [
        h('div', { innerHTML: btn.tip }),
        Key
      ])
    )
  }

  return h(QBtn, {
    ...vm.buttonProps,
    icon: btn.icon,
    color: toggled ? btn.toggleColor || vm.toolbarToggleColor : btn.color || vm.toolbarColor,
    textColor: toggled && !vm.toolbarPush ? null : btn.textColor || vm.toolbarTextColor,
    label: btn.label,
    disable: btn.disable ? (typeof btn.disable === 'function' ? btn.disable(vm) : true) : false,
    size: 'sm',
    onClick (e) {
      clickHandler && clickHandler()
      run(e, btn, vm)
    }
  }, () => child)
}

function getDropdown (vm, btn) {
  const onlyIcons = btn.list === 'only-icons'
  let
    label = btn.label,
    icon = btn.icon,
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
      return getBtn(vm, btn, closeDropdown, active)
    })
    contentClass = vm.toolbarBackgroundClass
    Items = [
      __getGroup(Items)
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

      return h(QItem, {
        active,
        activeClass,
        clickable: true,
        disable: disable,
        dense: true,
        onClick (e) {
          closeDropdown()
          vm.$refs.content && vm.$refs.content.focus()
          vm.caret.restore()
          run(e, btn, vm)
        }
      }, () => [
        btn.list === 'no-icons'
          ? null
          : h(QItemSection, {
            class: active ? activeClass : inactiveClass,
            side: true
          }, () => [
            h(QIcon, { name: btn.icon })
          ]),

        h(
          QItemSection,
          htmlTip
            ? () => [ h('div', { innerHTML: btn.htmlTip }) ]
            : (btn.tip ? () => h('div', btn.tip) : void 0)
        )
      ])
    })
    contentClass = [ vm.toolbarBackgroundClass, inactiveClass ]
    Items = [
      h(QList, () => [ Items ])
    ]
  }

  const highlight = btn.highlight && label !== btn.label
  const Dropdown = h(QBtnDropdown, {
    ...vm.buttonProps,
    noCaps: true,
    noWrap: true,
    color: highlight ? vm.toolbarToggleColor : vm.toolbarColor,
    textColor: highlight && !vm.toolbarPush ? null : vm.toolbarTextColor,
    label: btn.fixedLabel ? btn.label : label,
    icon: btn.fixedIcon ? btn.icon : icon,
    contentClass
  }, () => Items)

  return Dropdown
}

export function getToolbar (vm) {
  if (vm.caret) {
    return vm.buttons
      .filter(f => {
        return !vm.isViewingSource || f.find(fb => fb.cmd === 'viewsource')
      })
      .map(group => __getGroup(
        group.map(btn => {
          if (vm.isViewingSource && btn.cmd !== 'viewsource') {
            return false
          }

          if (btn.type === 'slot') {
            return slot(vm, btn.slot)
          }

          if (btn.type === 'dropdown') {
            return getDropdown(vm, btn)
          }

          return getBtn(vm, btn)
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

export function getLinkEditor (vm, ie11) {
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
      h('div', { class: `q-mx-xs text-${color}` }, `${vm.$q.lang.editor.url}: `),
      h(QInput, {
        key: 'qedt_btm_input',
        class: 'q-ma-none q-pa-none col q-editor-input',
        modelValue: link,
        color,
        autofocus: true,
        borderless: true,
        dense: true,
        'onUpdate:modelValue': val => { link = val },
        onKeydown: event => {
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
      }),
      __getGroup([
        h(QBtn, {
          key: 'qedt_btm_rem',
          tabindex: -1,
          ...vm.buttonProps,
          label: vm.$q.lang.label.remove,
          noCaps: true,
          onClick: () => {
            vm.caret.restore()
            document.execCommand('unlink')
            vm.editLinkUrl = null

            ie11 === true && vm.$nextTick(vm.__onInput)
          }
        }),
        h(QBtn, {
          key: 'qedt_btm_upd',
          ...vm.buttonProps,
          label: vm.$q.lang.label.update,
          noCaps: true,
          onClick: updateLink
        })
      ])
    ]
  }
}
