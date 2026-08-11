import { h } from 'vue'

import QBtn from '../btn/QBtn.js'
import QBtnDropdown from '../btn-dropdown/QBtnDropdown.js'
import QIcon from '../icon/QIcon.js'
import QTooltip from '../tooltip/QTooltip.js'
import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'

import { prevent, stop } from '../../utils/event/event.js'
import { hSlot } from '../../utils/private.render/render.js'
import { shouldIgnoreKey } from '../../utils/private.keyboard/key-composition.js'

function run(e, btn, eVm) {
  if (btn.handler) {
    btn.handler(e, eVm, eVm.caret)
  } else {
    eVm.runCmd(btn.cmd, btn.param)
  }
}

function getGroup(children) {
  return h('div', { class: 'q-editor__toolbar-group' }, children)
}

function isBtnDisabled(eVm, btn) {
  return btn.disable
    ? typeof btn.disable === 'function'
      ? btn.disable(eVm)
      : true
    : false
}

function getBtn(eVm, btn, clickHandler, active, tabAttrs) {
  const toggled =
      active ||
      (btn.type === 'toggle'
        ? btn.toggled
          ? btn.toggled(eVm)
          : btn.cmd && eVm.caret.is(btn.cmd, btn.param)
        : false),
    child = []

  if (eVm.$q.platform.is.desktop && (btn.tip || btn.htmlTip)) {
    const Key = btn.key
      ? h('div', [h('small', `(CTRL + ${String.fromCodePoint(btn.key)})`)])
      : null

    child.push(
      h(QTooltip, { delay: 1000 }, () => [
        h('div', btn.htmlTip ? { innerHTML: btn.htmlTip } : btn.tip),
        Key
      ])
    )
  }

  return h(
    QBtn,
    {
      ...eVm.buttonProps.value,
      icon: btn.icon !== null ? btn.icon : void 0,
      color: toggled
        ? btn.toggleColor || eVm.props.toolbarToggleColor
        : btn.color || eVm.props.toolbarColor,
      textColor:
        toggled && !eVm.props.toolbarPush
          ? null
          : btn.textColor || eVm.props.toolbarTextColor,
      label: btn.label,
      // icon-only buttons (no label) need an accessible name
      'aria-label':
        btn.label === void 0 || btn.label === null ? btn.tip : void 0,
      disable: isBtnDisabled(eVm, btn),
      size: 'sm',
      ...tabAttrs,
      onClick(e) {
        clickHandler?.()
        run(e, btn, eVm)
      }
    },
    () => child
  )
}

function getDropdown(eVm, btn, tabAttrs) {
  const onlyIcons = btn.list === 'only-icons'
  let label = btn.label,
    icon = btn.icon !== null ? btn.icon : void 0,
    contentClass,
    Items

  function closeDropdown() {
    Dropdown.component.proxy.hide()
  }

  if (onlyIcons) {
    Items = btn.options.map(localBtn => {
      const active =
        localBtn.type === void 0
          ? eVm.caret.is(localBtn.cmd, localBtn.param)
          : false

      if (active) {
        label = localBtn.tip
        icon = localBtn.icon !== null ? localBtn.icon : void 0
      }
      return getBtn(eVm, localBtn, closeDropdown, active)
    })
    contentClass = eVm.toolbarBackgroundClass.value
    Items = [getGroup(Items)]
  } else {
    const activeClass =
      eVm.props.toolbarToggleColor !== void 0
        ? `text-${eVm.props.toolbarToggleColor}`
        : null
    const inactiveClass =
      eVm.props.toolbarTextColor !== void 0
        ? `text-${eVm.props.toolbarTextColor}`
        : null

    const noIcons = btn.list === 'no-icons'

    Items = btn.options.map(localBtn => {
      const disable = localBtn.disable ? localBtn.disable(eVm) : false
      const active =
        localBtn.type === void 0
          ? eVm.caret.is(localBtn.cmd, localBtn.param)
          : false

      if (active) {
        label = localBtn.tip
        icon = localBtn.icon !== null ? localBtn.icon : void 0
      }

      const htmlTip = localBtn.htmlTip

      return h(
        QItem,
        {
          active,
          activeClass,
          clickable: true,
          disable,
          dense: true,
          onClick(e) {
            closeDropdown()
            if (e?.qAvoidFocus !== true) eVm.contentRef.value?.focus()
            eVm.caret.restore()
            run(e, localBtn, eVm)
          }
        },
        () => [
          noIcons
            ? null
            : h(
                QItemSection,
                {
                  class: active ? activeClass : inactiveClass,
                  side: true
                },
                () =>
                  h(QIcon, {
                    name: localBtn.icon !== null ? localBtn.icon : void 0
                  })
              ),

          h(
            QItemSection,
            htmlTip
              ? () =>
                  h('div', {
                    class: 'text-no-wrap',
                    innerHTML: localBtn.htmlTip
                  })
              : localBtn.tip
                ? () => h('div', { class: 'text-no-wrap' }, localBtn.tip)
                : void 0
          )
        ]
      )
    })

    contentClass = [eVm.toolbarBackgroundClass.value, inactiveClass]
  }

  const highlight = btn.highlight && label !== btn.label
  const Dropdown = h(
    QBtnDropdown,
    {
      ...eVm.buttonProps.value,
      noCaps: true,
      noWrap: true,
      color: highlight ? eVm.props.toolbarToggleColor : eVm.props.toolbarColor,
      textColor:
        highlight && !eVm.props.toolbarPush ? null : eVm.props.toolbarTextColor,
      label: btn.fixedLabel ? btn.label : label,
      // fixedLabel dropdowns without a label render icon-only;
      // name them after the currently active option, if any
      toggleAriaLabel:
        btn.fixedLabel && (btn.label === void 0 || btn.label === null)
          ? label
          : void 0,
      icon: btn.fixedIcon ? (btn.icon !== null ? btn.icon : void 0) : icon,
      contentClass,
      onShow: evt => eVm.emit('dropdownShow', evt),
      onHide: evt => eVm.emit('dropdownHide', evt),
      onBeforeShow: evt => eVm.emit('dropdownBeforeShow', evt),
      onBeforeHide: evt => eVm.emit('dropdownBeforeHide', evt),
      ...tabAttrs
    },
    () => Items
  )

  return Dropdown
}

export function getToolbar(eVm) {
  if (eVm.caret) {
    const skipsToken = btn =>
      (eVm.isViewingSource.value && btn.cmd !== 'viewsource') ||
      btn.type === 'slot'

    const groups = eVm.buttons.value.filter(
      f => !eVm.isViewingSource.value || f.find(fb => fb.cmd === 'viewsource')
    )

    // The toolbar acts as a single Tab stop (roving tabindex): only one
    // control keeps tabindex 0 -- the last one focused, falling back to
    // the first enabled one. Slot tokens stay out of the scheme (they
    // remain their own Tab stops). Flat indices follow render order.
    const disabledList = []
    groups.forEach(group => {
      group.forEach(btn => {
        if (skipsToken(btn)) return

        disabledList.push(
          btn.type === 'dropdown'
            ? eVm.buttonProps.value.disable
            : isBtnDisabled(eVm, btn)
        )
      })
    })

    let tabStop = eVm.toolbarTabStop.value
    if (
      tabStop === null ||
      tabStop >= disabledList.length ||
      disabledList[tabStop]
    ) {
      tabStop = disabledList.indexOf(false)
    }

    let flatIndex = -1

    return groups.map(group =>
      getGroup(
        group.map(btn => {
          if (eVm.isViewingSource.value && btn.cmd !== 'viewsource') {
            return false
          }

          if (btn.type === 'slot') {
            return hSlot(eVm.slots[btn.slot])
          }

          flatIndex++
          const tabAttrs = {
            'data-tbi': flatIndex,
            tabindex: flatIndex === tabStop ? 0 : -1
          }

          if (btn.type === 'dropdown') {
            return getDropdown(eVm, btn, tabAttrs)
          }

          return getBtn(eVm, btn, void 0, false, tabAttrs)
        })
      )
    )
  }
}

export function getFonts(
  defaultFont,
  defaultFontLabel,
  defaultFontIcon,
  fonts = {}
) {
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

export function getLinkEditor(eVm) {
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
      h(
        'div',
        { class: `q-mx-xs text-${color}` },
        `${eVm.$q.lang.editor.url}: `
      ),
      h('input', {
        key: 'qedt_btm_input',
        class: 'col q-editor__link-input',
        value: link,
        onInput: evt => {
          stop(evt)
          link = evt.target.value
        },
        onKeydown: evt => {
          if (shouldIgnoreKey(evt)) return

          switch (evt.keyCode) {
            case 13: {
              // ENTER key
              prevent(evt)
              return updateLink()
            }
            case 27: {
              // ESCAPE key
              prevent(evt)
              eVm.caret.restore()
              if (
                !eVm.editLinkUrl.value ||
                eVm.editLinkUrl.value === 'https://'
              ) {
                document.execCommand('unlink')
              }
              eVm.editLinkUrl.value = null
              break
            }
          }
        }
      }),
      getGroup([
        h(QBtn, {
          key: 'qedt_btm_rem',
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
