import { createDirective } from '../../utils/private.create/create.js'
import morph from '../../utils/morph/morph.js'

const morphGroups = new Map()
const optionKeys = new Set([
  'duration',
  'delay',
  'easing',
  'fill',
  'classes',
  'style',
  'resize',
  'useCSS',
  'hideFromClone',
  'keepToClone',
  'tween',
  'tweenFromOpacity',
  'tweenToOpacity',
  'waitFor',
  'onEnd'
])
const mods = ['resize', 'useCSS', 'hideFromClone', 'keepToClone', 'tween']

function changeClass(ctx, action) {
  if (ctx.clsAction !== action) {
    ctx.clsAction = action
    ctx.el.classList[action]('q-morph--invisible')
  }
}

function trigger(group) {
  if (group.animating || group.queue.length < 2) return

  const [from, to] = group.queue

  group.animating = true
  from.animating = true
  to.animating = true

  changeClass(from, 'remove')
  changeClass(to, 'remove')

  const cancelFn = morph({
    from: from.el,
    to: to.el,
    onToggle() {
      changeClass(from, 'add')
      changeClass(to, 'remove')
    },
    ...to.opts,
    onEnd(dir, aborted) {
      to.opts.onEnd?.(dir, aborted)
      if (aborted) return

      from.animating = false
      to.animating = false

      group.animating = false
      group.cancel = void 0
      group.queue.shift()

      trigger(group)
    }
  })

  group.cancel = () => {
    cancelFn(true) // abort
    group.cancel = void 0
  }
}

function updateModifiers(mod, ctx) {
  const opts = ctx.opts

  for (const name of mods) {
    opts[name] = mod[name] === true
  }
}

function insertArgs(arg, ctx) {
  const opts = typeof arg === 'string' && arg.length !== 0 ? arg.split(':') : []

  ctx.name = opts[0]
  ctx.group = opts[1]

  const parsedOpt = Number.parseFloat(opts[2])
  ctx.opts.duration = Number.isFinite(parsedOpt) ? parsedOpt : 300
  ctx.opts.waitFor = opts[3]
}

function updateArgs(arg, ctx) {
  for (const key in arg) {
    const value = arg[key]

    if (value === void 0) continue

    if (key === 'group') {
      ctx.group = value
    } else if (key === 'name') {
      ctx.name = value
    } else if (optionKeys.has(key)) {
      ctx.opts[key] = value
    }
  }
}

function updateModel(name, ctx) {
  if (ctx.name === name) {
    const group = morphGroups.get(ctx.group)

    // if group is not registered
    if (group === void 0) {
      morphGroups.set(ctx.group, {
        name: ctx.group,
        model: name,
        queue: [ctx],
        animating: false,
        cancel: void 0
      })

      changeClass(ctx, 'remove')
    }
    // if model changed
    else if (group.model !== name) {
      group.model = name
      group.queue.push(ctx)

      if (!group.animating && group.queue.length === 2) {
        trigger(group)
      }
    }

    return
  }

  if (!ctx.animating) changeClass(ctx, 'add')
}

function updateValue(ctx, value, classPatched) {
  let model

  if (Object(value) === value) {
    model = String(value.model)
    updateArgs(value, ctx)
    updateModifiers(value, ctx)
  } else {
    model = String(value)
  }

  if (model !== ctx.model) {
    ctx.model = model
    updateModel(model, ctx)
  } else if (classPatched && ctx.clsAction === 'add' && !ctx.animating) {
    ctx.el.classList.add('q-morph--invisible')
  }
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? {
        name: 'morph',
        getSSRProps: binding => {
          const name = binding.arg ? binding.arg.split(':')[0] : false
          const model =
            Object(binding.value) === binding.value
              ? binding.value.model
              : binding.value

          return {
            class: name === model ? '' : 'q-morph--invisible'
          }
        }
      }
    : {
        name: 'morph',

        // the initial visibility class as early as possible (mirrors
        // getSSRProps); its presence alone also makes Vue skip the
        // hydration prop-mismatch check for the element (vuejs/core
        // #11189), which would otherwise report the server-rendered
        // q-morph--invisible class as a false-positive mismatch
        created(el, binding, vnode) {
          const ctx = {
            el,
            name: void 0,
            group: void 0,
            model: void 0,
            clsAction: void 0,
            animating: false,
            opts: {}
          }

          updateModifiers(binding.modifiers, ctx)
          insertArgs(binding.arg, ctx)
          el.__qmorph = ctx

          // a class prop makes Vue write className right after this
          // hook, which would drop the class again before mounted()
          const props = vnode.props
          if (props === null || !('class' in props)) {
            const { value } = binding
            const model = Object(value) === value ? value.model : value
            const invisible = ctx.name !== model

            el.classList.toggle('q-morph--invisible', invisible)
            ctx.clsAction = invisible ? 'add' : 'remove'
          }
        },

        mounted(el, binding) {
          updateValue(el.__qmorph, binding.value, false)
        },

        updated(el, binding, vnode, prevVNode) {
          // Vue writes className (dropping the class it does not
          // own) only when the class prop changed, HMR included
          updateValue(
            el.__qmorph,
            binding.value,
            vnode.props?.class !== prevVNode.props?.class
          )
        },

        beforeUnmount(el) {
          const ctx = el.__qmorph
          const group = morphGroups.get(ctx.group)

          if (group !== void 0) {
            const index = group.queue.indexOf(ctx)

            if (index !== -1) {
              group.queue.splice(index, 1)

              if (group.queue.length === 0) {
                group.cancel?.()
                morphGroups.delete(ctx.group)
              }
            }
          }

          if (ctx.clsAction === 'add') {
            el.classList.remove('q-morph--invisible')
          }

          el.__qmorph = void 0
        }
      }
)
