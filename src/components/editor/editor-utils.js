import { QBtn, QBtnToggle, QBtnDropdown, QBtnGroup } from '../btn'
import { QTooltip } from '../tooltip'
import { QList, QItem, QItemMain } from '../list'

function run (btn, vm) {
  if (btn.handler) {
    btn.handler(vm)
  }
  else {
    vm.runCmd(btn.cmd, btn.param)
  }
}

function getBtn (h, vm, btn) {
  const child = []

  if (btn.type === 'slot') {
    return vm.$slots[btn.slot]
  }
  if (btn.type === 'dropdown') {
    let label = btn.label

    const Items = btn.options.map(btn => {
      const disable = btn.disable ? btn.disable(vm) : false
      const active = !disable && btn.type === void 0
        ? vm.caret.is(btn.cmd, btn.param)
        : false

      if (active) {
        label = btn.tip
      }
      return h(
        QItem,
        {
          props: { active, link: !disable },
          staticClass: disable ? 'disabled' : '',
          on: {
            click () {
              if (disable) { return }
              instance.componentInstance.close()
              vm.$refs.content.focus()
              vm.caret.restore()
              run(btn, vm)
            }
          }
        },
        [
          h(QItemMain, {
            props: {
              label: btn.tip
            }
          })
        ]
      )
    })

    const instance = h(
      QBtnDropdown,
      {
        props: {
          noCaps: true,
          noWrap: true,
          color: label !== btn.label ? vm.toggleColor : vm.color,
          label,
          ...vm.buttonProps
        }
      },
      [ h(QList, { props: { separator: true } }, [ Items ]) ]
    )
    return instance
  }
  else {
    if (btn.tip && vm.$q.platform.is.desktop) {
      const Key = btn.key
        ? h('div', [h('small', `(CTRL + ${String.fromCharCode(btn.key)})`)])
        : null
      child.push(h(QTooltip, { props: {delay: 1000} }, [btn.tip, Key]))
    }
  }

  if (btn.type === void 0) {
    return h(QBtnToggle, {
      props: {
        icon: btn.icon,
        label: btn.label,
        toggled: vm.caret.is(btn.cmd, btn.param),
        color: vm.color,
        toggleColor: vm.toggleColor,
        disable: btn.disable ? btn.disable(vm) : false,
        ...vm.buttonProps
      },
      on: {
        click () {
          run(btn, vm)
        }
      }
    }, child)
  }
  if (btn.type === 'no-state') {
    return h(QBtn, {
      props: {
        icon: btn.icon,
        color: vm.color,
        label: btn.label,
        disable: btn.disable ? btn.disable(vm) : false,
        ...vm.buttonProps
      },
      on: {
        click () {
          run(btn, vm)
        }
      }
    }, child)
  }
}

export function getToolbar (h, vm) {
  if (vm.caret) {
    return vm.buttons.map(group => h(
      QBtnGroup,
      { props: vm.buttonProps },
      group.map(btn => getBtn(h, vm, btn))
    ))
  }
}
