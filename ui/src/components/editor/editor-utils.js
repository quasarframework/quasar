import { h } from 'vue'

import QBtn from '../btn/QBtn.js'
import QBtnDropdown from '../btn-dropdown/QBtnDropdown.js'
import QIcon from '../icon/QIcon.js'
import QTooltip from '../tooltip/QTooltip.js'
import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'

import { prevent, stop } from '../../utils/event.js'
import { hSlot } from '../../utils/private/render.js'
import { shouldIgnoreKey } from '../../utils/private/key-composition.js'

function run (e, btn, eVm) {
  if (btn.handler) {
    btn.handler(e, eVm, eVm.caret)
  }
  else {
    eVm.runCmd(btn.cmd, btn.param)
  }
}

function getGroup (children) {
  return h('div', { class: 'q-editor__toolbar-group' }, children)
}

function getBtn (eVm, btn, clickHandler, active = false) {
  const
    toggled = active || (btn.type === 'toggle'
      ? (btn.toggled ? btn.toggled(eVm) : btn.cmd && eVm.caret.is(btn.cmd, btn.param))
      : false),
    child = []

  if (btn.tip && eVm.$q.platform.is.desktop) {
    const Key = btn.key
      ? h('div', [
          h('small', `(CTRL + ${ String.fromCharCode(btn.key) })`)
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
    ...eVm.buttonProps.value,
    icon: btn.icon !== null ? btn.icon : void 0,
    color: toggled ? btn.toggleColor || eVm.props.toolbarToggleColor : btn.color || eVm.props.toolbarColor,
    textColor: toggled && !eVm.props.toolbarPush ? null : btn.textColor || eVm.props.toolbarTextColor,
    label: btn.label,
    disable: btn.disable ? (typeof btn.disable === 'function' ? btn.disable(eVm) : true) : false,
    size: 'sm',
    onClick (e) {
      clickHandler && clickHandler()
      run(e, btn, eVm)
    }
  }, () => child)
}

function getDropdown (eVm, btn) {
  const onlyIcons = btn.list === 'only-icons'
  let
    label = btn.label,
    icon = btn.icon !== null ? btn.icon : void 0,
    contentClass,
    Items

  function closeDropdown () {
    Dropdown.component.proxy.hide()
  }

  if (onlyIcons) {
    Items = btn.options.map(btn => {
      const active = btn.type === void 0
        ? eVm.caret.is(btn.cmd, btn.param)
        : false

      if (active) {
        label = btn.tip
        icon = btn.icon !== null ? btn.icon : void 0
      }
      return getBtn(eVm, btn, closeDropdown, active)
    })
    contentClass = eVm.toolbarBackgroundClass.value
    Items = [
      getGroup(Items)
    ]
  }
  else {
    const activeClass = eVm.props.toolbarToggleColor !== void 0
      ? `text-${ eVm.props.toolbarToggleColor }`
      : null
    const inactiveClass = eVm.props.toolbarTextColor !== void 0
      ? `text-${ eVm.props.toolbarTextColor }`
      : null

    const noIcons = btn.list === 'no-icons'

    Items = btn.options.map(btn => {
      const disable = btn.disable ? btn.disable(eVm) : false
      const active = btn.type === void 0
        ? eVm.caret.is(btn.cmd, btn.param)
        : false

      if (active) {
        label = btn.tip
        icon = btn.icon !== null ? btn.icon : void 0
      }

      const htmlTip = btn.htmlTip

      return h(QItem, {
        active,
        activeClass,
        clickable: true,
        disable,
        dense: true,
        onClick (e) {
          closeDropdown()
          eVm.contentRef.value !== null && eVm.contentRef.value.focus()
          eVm.caret.restore()
          run(e, btn, eVm)
        }
      }, () => [
        noIcons === true
          ? null
          : h(
            QItemSection,
            {
              class: active ? activeClass : inactiveClass,
              side: true
            },
            () => h(QIcon, { name: btn.icon !== null ? btn.icon : void 0 })
          ),

        h(
          QItemSection,
          htmlTip
            ? () => h('div', { class: 'text-no-wrap', innerHTML: btn.htmlTip })
            : (btn.tip ? () => h('div', { class: 'text-no-wrap' }, btn.tip) : void 0)
        )
      ])
    })
    contentClass = [ eVm.toolbarBackgroundClass.value, inactiveClass ]
  }

  const highlight = btn.highlight && label !== btn.label
  const Dropdown = h(QBtnDropdown, {
    ...eVm.buttonProps.value,
    noCaps: true,
    noWrap: true,
    color: highlight ? eVm.props.toolbarToggleColor : eVm.props.toolbarColor,
    textColor: highlight && !eVm.props.toolbarPush ? null : eVm.props.toolbarTextColor,
    label: btn.fixedLabel ? btn.label : label,
    icon: btn.fixedIcon ? (btn.icon !== null ? btn.icon : void 0) : icon,
    contentClass
  }, () => Items)

  return Dropdown
}

export function getToolbar (eVm) {
  if (eVm.caret) {
    return eVm.buttons.value
      .filter(f => {
        return !eVm.isViewingSource.value || f.find(fb => fb.cmd === 'viewsource')
      })
      .map(group => getGroup(
        group.map(btn => {
          if (eVm.isViewingSource.value && btn.cmd !== 'viewsource') {
            return false
          }

          if (btn.type === 'slot') {
            return hSlot(eVm.slots[ btn.slot ])
          }

          if (btn.type === 'dropdown') {
            return getDropdown(eVm, btn)
          }

          return getBtn(eVm, btn)
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
    const name = fonts[ alias ]
    def[ alias ] = {
      cmd: 'fontName',
      param: name,
      icon: defaultFontIcon,
      tip: name,
      htmlTip: `<font face="${ name }">${ name }</font>`
    }
  })

  return def
}

export function getLinkEditor (eVm) {
  if (eVm.caret) {
    const color = eVm.props.toolbarColor || eVm.props.toolbarTextColor
    let link = eVm.editLinkUrl.value
    const updateLink = () => {
      eVm.caret.restore()

      if (link !== eVm.editLinkUrl.value) {
        document.execCommand('createLink', false, link === '' ? ' ' : link)
      }

      eVm.editLinkUrl.value = null
    }

    return [
      h('div', { class: `q-mx-xs text-${ color }` }, `${ eVm.$q.lang.editor.url }: `),
      h('input', {
        key: 'qedt_btm_input',
        class: 'col q-editor__link-input',
        value: link,
        onInput: evt => {
          stop(evt)
          link = evt.target.value
        },
        onKeydown: evt => {
          if (shouldIgnoreKey(evt) === true) {
            return
          }

          switch (evt.keyCode) {
            case 13: // ENTER key
              prevent(evt)
              return updateLink()
            case 27: // ESCAPE key
              prevent(evt)
              eVm.caret.restore()
              if (!eVm.editLinkUrl.value || eVm.editLinkUrl.value === 'https://') {
                document.execCommand('unlink')
              }
              eVm.editLinkUrl.value = null
              break
          }
        }
      }),
      getGroup([
        h(QBtn, {
          key: 'qedt_btm_rem',
          tabindex: -1,
          ...eVm.buttonProps.value,
          label: eVm.$q.lang.label.remove,
          noCaps: true,
          onClick: () => {
            eVm.caret.restore()
            document.execCommand('unlink')
            eVm.editLinkUrl.value = null
          }
        }),
        h(QBtn, {
          key: 'qedt_btm_upd',
          ...eVm.buttonProps.value,
          label: eVm.$q.lang.label.update,
          noCaps: true,
          onClick: updateLink
        })
      ])
    ]
  }
}
