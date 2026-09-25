import { ref } from 'vue'

import useDropZone from '../../composables/use-drop-zone/use-drop-zone.js'
import { createDirective } from '../../utils/private.create/create.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const defaultActiveClass = 'q-drop-zone--over'

// the value is the handler itself or an Object carrying it next to
// the validation options; anything else (false, undefined, an Object
// without a handler) disables in place
function getOptions(value) {
  if (typeof value === 'function') {
    return { handler: value }
  }

  return Object(value) === value && typeof value.handler === 'function'
    ? value
    : null
}

function update(el, ctx, value) {
  ctx.opts = getOptions(value)

  // disabled: the zone is released until a handler is supplied again;
  // a handler or options swap only replaces what the zone reads at drop
  if (ctx.opts === null) {
    ctx.armed.value = false
    // the release is silent, so the hover feedback is withdrawn here
    setOver(el, ctx, false)
    return
  }

  const activeClass = ctx.opts.activeClass || defaultActiveClass

  if (activeClass !== ctx.activeClass) {
    if (ctx.isOver) {
      el.classList.replace(ctx.activeClass, activeClass)
    }
    ctx.activeClass = activeClass
  }

  ctx.armed.value = true
}

function setOver(el, ctx, isOver) {
  if (ctx.isOver !== isOver) {
    ctx.isOver = isOver
    el.classList.toggle(ctx.activeClass, isOver)
  }
}

function destroy(el) {
  const ctx = el.__qdropzone

  if (ctx !== void 0) {
    ctx.stop()
    setOver(el, ctx, false)
    el.__qdropzone = void 0
  }
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'drop-zone', getSSRProps }
    : {
        name: 'drop-zone',

        mounted(el, { modifiers, value }) {
          const ctx = {
            opts: null,
            armed: ref(false),
            activeClass: defaultActiveClass,
            isOver: false
          }

          // the directive hook runs outside of any component instance, so
          // the composable takes the instance-free path (nothing is
          // released on its own; destroy() does it); the validation
          // options and the hooks are read from ctx at each drop
          ctx.stop = useDropZone(() => {
            const opts = ctx.opts ?? {}

            return {
              target: el,
              disabled: !ctx.armed.value,
              multiple:
                opts.multiple !== void 0
                  ? opts.multiple === true
                  : modifiers.multiple === true,
              accept: opts.accept,
              maxFileSize: opts.maxFileSize,
              maxTotalSize: opts.maxTotalSize,
              maxFiles: opts.maxFiles,
              filter: opts.filter,
              onDrop(files, evt) {
                ctx.opts.handler(files, evt)
              },
              onRejected(rejected) {
                ctx.opts.onRejected?.(rejected)
              },
              onEnter() {
                setOver(el, ctx, true)
              },
              onLeave() {
                setOver(el, ctx, false)
              }
            }
          }).stopDropZone

          update(el, ctx, value)

          el.__qdropzone = ctx
        },

        updated(el, { oldValue, value }) {
          if (oldValue !== value) {
            const ctx = el.__qdropzone
            if (ctx !== void 0) {
              update(el, ctx, value)
            }
          }
        },

        beforeUnmount: destroy
      }
)
