import { morph } from '../utils/dom-morph.js'

const morphGroups = {}

function normalizeParams ({ value, arg, modifiers }) {
  const argSplit = typeof arg === 'string' && arg.length > 0 ? arg.split(':') : []
  const valueObj = value === Object(value) && typeof value !== 'function' ? value : { trigger: value }
  return {
    group: valueObj.group === void 0 ? argSplit[0] : valueObj.group,
    trigger: valueObj.trigger,
    selector: valueObj.selector,
    options: {
      forceResize: modifiers.resize === true,
      forceCssAnimation: modifiers.css === true,
      hideFromClone: modifiers.hideFrom === true,
      keepToClone: modifiers.keepTo === true,
      tween: modifiers.tween === true,
      waitFor: argSplit[2],

      duration: isNaN(valueObj.duration) === true
        ? (isNaN(argSplit[1]) === true ? 300 : parseInt(argSplit[1], 10))
        : parseInt(valueObj.duration, 10),

      ...valueObj
    }
  }
}

function checkMorph (ctx, binding) {
  const params = normalizeParams(binding)

  if (ctx.group !== params.group) {
    if (typeof ctx.group === 'string' && ctx.group.length > 0 && morphGroups[ctx.group] === ctx) {
      morphGroups[ctx.group] = void 0
    }

    ctx.group = params.group

    if (typeof ctx.group !== 'string' || ctx.group.length === 0) {
      ctx.initialized = false

      return
    }
  }

  if (ctx.initialized === true && ctx.trigger === params.trigger) {
    return
  }

  if (ctx.selector !== params.selector) {
    ctx.selector = params.selector
  }

  ctx.trigger = params.trigger

  const currentCtx = morphGroups[ctx.group]
  const elTo = ctx.getTarget()
  const defaultCancel = () => {
    elTo && elTo.classList.add('q-morph--invisible')
  }

  if (ctx.initialized !== true) {
    ctx.initialized = true

    defaultCancel()

    ctx.cancel = defaultCancel
  }

  if ([ void 0, null, false, 0, '' ].includes(ctx.trigger) === true) {
    if (currentCtx === ctx) {
      morphGroups[ctx.group] = void 0
    }

    ctx.cancel()

    return
  }

  if (currentCtx === void 0) {
    elTo && elTo.classList.remove('q-morph--invisible')

    ctx.cancel = defaultCancel

    morphGroups[ctx.group] = ctx

    return
  }

  const elFrom = currentCtx.getTarget()

  morphGroups[ctx.group] = ctx

  const done = currentCtx.done || Promise.resolve()

  done.then(() => {
    if (morphGroups[ctx.group] === ctx) {
      elFrom && elFrom.classList.remove('q-morph--invisible')

      ctx.done = new Promise(resolve => {
        const cancel = morph(
          {
            from: elFrom,
            to: elTo
          },
          () => {
            elFrom && elFrom.classList.add('q-morph--invisible')
            elTo && elTo.classList.remove('q-morph--invisible')
            typeof ctx.trigger === 'function' && ctx.trigger()
          },
          {
            ...params.options,

            onReady (end) {
              if (end !== 'to' || morphGroups[ctx.group] !== ctx) {
                if (morphGroups[ctx.group] === ctx) {
                  morphGroups[ctx.group] = currentCtx

                  elFrom && elFrom.classList.remove('q-morph--invisible')
                }

                defaultCancel()
              }

              ctx.cancel = defaultCancel

              if (typeof params.options.onReady === 'function') {
                params.options.onReady(end)
              }

              resolve(end)
            }
          }
        )

        ctx.cancel = () => {
          if (cancel() === false) {
            defaultCancel()
          }

          ctx.cancel = defaultCancel
        }
      })
    }
  })
}

export default {
  name: 'morph',

  inserted (el, binding) {
    const ctx = {
      selector: void 0,

      getTarget () {
        const type = typeof ctx.selector

        return type === 'function'
          ? ctx.selector(el)
          : (
            type === 'string'
              ? el.querySelector(ctx.selector)
              : el
          )
      },

      cancel () {},

      initialized: false
    }

    checkMorph(ctx, binding)

    if (el.__qmorph) {
      el.__qmorph_old = el.__qmorph
    }

    el.__qmorph = ctx
  },

  update (el, binding) {
    if (el.__qmorph !== void 0) {
      checkMorph(el.__qmorph, binding)
    }
  },

  unbind (el) {
    const ctx = el.__qmorph_old || el.__qmorph
    if (ctx !== void 0) {
      if (typeof ctx.group === 'string' && ctx.group.length > 0 && morphGroups[ctx.group] === ctx) {
        morphGroups[ctx.group].cancel()

        morphGroups[ctx.group] = void 0
      }

      delete el[el.__qmorph_old ? '__qmorph_old' : '__qmorph']
    }
  }
}
