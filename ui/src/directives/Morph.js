import { createDirective } from '../utils/private/create.js'
import morph from '../utils/morph.js'

const morphGroups = {}
const props = [
  'duration', 'delay', 'easing', 'fill',
  'classes', 'style', 'duration', 'resize',
  'useCSS', 'hideFromClone', 'keepToClone', 'tween',
  'tweenFromOpacity', 'tweenToOpacity',
  'waitFor', 'onEnd'
]
const mods = [
  'resize', 'useCSS', 'hideFromClone', 'keepToClone', 'tween'
]

function changeClass (ctx, action) {
  if (ctx.clsAction !== action) {
    ctx.clsAction = action
    ctx.el.classList[ action ]('q-morph--invisible')
  }
}

function trigger (group) {
  if (group.animating === true || group.queue.length < 2) {
    return
  }

  const [ from, to ] = group.queue

  group.animating = true
  from.animating = true
  to.animating = true

  changeClass(from, 'remove')
  changeClass(to, 'remove')

  const cancelFn = morph({
    from: from.el,
    to: to.el,
    onToggle () {
      changeClass(from, 'add')
      changeClass(to, 'remove')
    },
    ...to.opts,
    onEnd (dir, aborted) {
      to.opts.onEnd !== void 0 && to.opts.onEnd(dir, aborted)

      if (aborted === true) {
        return
      }

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

function updateModifiers (mod, ctx) {
  const opts = ctx.opts

  mods.forEach(name => {
    opts[ name ] = mod[ name ] === true
  })
}

function insertArgs (arg, ctx) {
  const opts = typeof arg === 'string' && arg.length !== 0
    ? arg.split(':') : []

  ctx.name = opts[ 0 ]
  ctx.group = opts[ 1 ]

  Object.assign(ctx.opts, {
    duration: isNaN(opts[ 2 ]) === true
      ? 300
      : parseFloat(opts[ 2 ]),
    waitFor: opts[ 3 ]
  })
}

function updateArgs (arg, ctx) {
  if (arg.group !== void 0) {
    ctx.group = arg.group
  }
  if (arg.name !== void 0) {
    ctx.name = arg.name
  }

  const opts = ctx.opts

  props.forEach(name => {
    if (arg[ name ] !== void 0) {
      opts[ name ] = arg[ name ]
    }
  })
}

function updateModel (name, ctx) {
  if (ctx.name === name) {
    const group = morphGroups[ ctx.group ]

    // if group is not registered
    if (group === void 0) {
      morphGroups[ ctx.group ] = {
        name: ctx.group,
        model: name,
        queue: [ ctx ],
        animating: false
      }

      changeClass(ctx, 'remove')
    }
    // if model changed
    else if (group.model !== name) {
      group.model = name
      group.queue.push(ctx)

      if (group.animating === false && group.queue.length === 2) {
        trigger(group)
      }
    }

    return
  }

  if (ctx.animating === false) {
    changeClass(ctx, 'add')
  }
}

function updateValue (ctx, value) {
  let model

  if (Object(value) === value) {
    model = '' + value.model
    updateArgs(value, ctx)
    updateModifiers(value, ctx)
  }
  else {
    model = '' + value
  }

  if (model !== ctx.model) {
    ctx.model = model
    updateModel(model, ctx)
  }
  else if (ctx.animating === false && ctx.clsAction !== void 0) {
    // ensure HMR
    ctx.el.classList[ ctx.clsAction ]('q-morph--invisible')
  }
}

export default createDirective(__QUASAR_SSR_SERVER__
  ? {
      name: 'morph',
      getSSRProps: binding => {
        const name = binding.arg
          ? binding.arg.split(':')[ 0 ]
          : false

        return {
          class: name === binding.value ? '' : 'q-morph--invisible'
        }
      }
    }
  : {
      name: 'morph',

      mounted (el, binding) {
        const ctx = {
          el,
          animating: false,
          opts: {}
        }

        updateModifiers(binding.modifiers, ctx)
        insertArgs(binding.arg, ctx)
        updateValue(ctx, binding.value)

        el.__qmorph = ctx
      },

      updated (el, binding) {
        updateValue(el.__qmorph, binding.value)
      },

      beforeUnmount (el) {
        const ctx = el.__qmorph

        const group = morphGroups[ ctx.group ]

        if (group !== void 0) {
          const index = group.queue.indexOf(ctx)

          if (index !== -1) {
            group.queue = group.queue.filter(item => item !== ctx)

            if (group.queue.length === 0) {
              group.cancel !== void 0 && group.cancel()
              delete morphGroups[ ctx.group ]
            }
          }
        }

        if (ctx.clsAction === 'add') {
          el.classList.remove('q-morph--invisible')
        }

        delete el.__qmorph
      }
    }
)
