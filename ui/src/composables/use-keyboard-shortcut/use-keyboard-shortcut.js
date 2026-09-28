import { computed, toValue } from 'vue'

import useEventListener from '../use-event-listener/use-event-listener.js'
import { client } from '../../plugins/platform/Platform.js'
import { shouldIgnoreKey } from '../../utils/private.keyboard/key-composition.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      stopKeyboardShortcut
 *    } = useKeyboardShortcut(shortcut, handler, options)
 *
 * shortcut - "Mod+K" style String, or an Array of them for aliases of the
 *            same action (ref or getter accepted); modifiers are Ctrl,
 *            Alt, Shift, Meta and Mod (Meta on macOS, Ctrl elsewhere), the
 *            key is a KeyboardEvent "key" ("k", "Escape", "?") or "code"
 *            ("KeyK", "Digit1") value, case-insensitive
 * handler  - called with the KeyboardEvent and the shortcut String that
 *            matched it
 * options  - plain object, ref or getter of:
 *    target         - element, component or window to listen on (default:
 *                     window)
 *    keyup          - fire on keyup instead of keydown (default: false)
 *    capture        - listen in the capture phase (default: false)
 *    repeat         - also fire for the auto-repeated events of a held key
 *                     (default: false)
 *    preventDefault - false keeps the browser's own action for a matched
 *                     key (default: true)
 *    ignoreInputs   - false lets printable, unmodified shortcuts fire while
 *                     typing in a text field (default: true)
 *    disabled       - pause listening (default: false)
 */

const modifierAliases = {
  ctrl: 'ctrl',
  control: 'ctrl',
  alt: 'alt',
  option: 'alt',
  shift: 'shift',
  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
  win: 'meta',
  super: 'meta',
  mod: 'mod'
}

// KeyboardEvent "key" values when the modifier is the key itself
const modifierKeyValues = {
  ctrl: 'control',
  alt: 'alt',
  shift: 'shift',
  meta: 'meta'
}

const keyAliases = {
  esc: 'escape',
  space: ' ',
  spacebar: ' ',
  plus: '+',
  return: 'enter',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright'
}

// "code" values that produce text, so they count as typing too; the
// symbol ones are also Shift-agnostic, like the characters they produce
const letterCodeRE = /^key[a-z]$/
const symbolCodeRE =
  /^(digit\d|numpad(\d|add|subtract|multiply|divide|decimal|comma|equal)|minus|equal|bracketleft|bracketright|backslash|semicolon|quote|backquote|comma|period|slash|intlbackslash|intlro|intlyen)$/
const letterRE = /^[a-z]$/

// resolved once: the platform never changes at runtime; the server-side
// client stub has no "is"
const modFlag =
  !__QUASAR_SSR_SERVER__ && client.is.mac === true ? 'meta' : 'ctrl'

const nonTypingInputRE =
  /^(button|checkbox|radio|submit|reset|file|range|color|image)$/

function getModifierFlag(name) {
  return name === 'mod' ? modFlag : name
}

// null for a shortcut that cannot match anything (unknown modifier)
function parseShortcut(shortcut) {
  const parts = shortcut.split('+')
  const last = parts.at(-1)

  // a trailing "+" is the plus key itself ("Ctrl++")
  const rawKey = last === '' && parts.length > 1 ? '+' : last.trim()

  if (rawKey === '') return null

  const combo = {
    shortcut,
    key: rawKey.toLowerCase(),
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  }

  combo.key = keyAliases[combo.key] ?? combo.key

  for (let i = 0; i < parts.length - 1; i++) {
    const name = parts[i].trim().toLowerCase()

    if (name === '') continue

    const modifier = modifierAliases[name]

    if (modifier === void 0) return null

    combo[getModifierFlag(modifier)] = true
  }

  // the key can be a modifier itself ("Shift"), which then also shows
  // up as pressed on the event
  const asModifier = modifierAliases[combo.key]

  if (asModifier !== void 0) {
    const flag = getModifierFlag(asModifier)
    combo[flag] = true
    combo.key = modifierKeyValues[flag]
  }

  const single = combo.key.length === 1
  const symbol = single
    ? !letterRE.test(combo.key)
    : symbolCodeRE.test(combo.key)

  // typing shortcuts are skipped while the focus is in a text field;
  // Shift is not checked for a punctuation/digit key ("?", "+", "1"):
  // whether it takes Shift depends on the keyboard layout
  combo.typing =
    !combo.ctrl &&
    !combo.alt &&
    !combo.meta &&
    (single || symbol || letterCodeRE.test(combo.key))
  combo.anyShift = !combo.shift && symbol

  return combo
}

function parseShortcuts(value) {
  const list = Array.isArray(value) ? value : [value]
  const combos = []

  list.forEach(shortcut => {
    if (typeof shortcut === 'string') {
      const combo = parseShortcut(shortcut)
      if (combo !== null) {
        combos.push(combo)
      }
    }
  })

  return combos
}

function isTypingTarget(el) {
  if (el === null || el === void 0) return false
  if (el.isContentEditable === true) return true

  const tag = el.tagName

  return tag === 'INPUT'
    ? !nonTypingInputRE.test(el.type)
    : tag === 'TEXTAREA' || tag === 'SELECT'
}

function matches(combo, evt, key, code) {
  return (
    combo.ctrl === evt.ctrlKey &&
    combo.alt === evt.altKey &&
    combo.meta === evt.metaKey &&
    (combo.anyShift || combo.shift === evt.shiftKey) &&
    (combo.key === key || combo.key === code)
  )
}

export default function useKeyboardShortcut(shortcut, handler, options) {
  if (__QUASAR_SSR_SERVER__) {
    return { stopKeyboardShortcut: noop }
  }

  const combos = computed(() => parseShortcuts(toValue(shortcut)))

  function onKey(evt) {
    // IME composition, Quasar's own synthetic key events, plain Events
    if (shouldIgnoreKey(evt) || typeof evt.key !== 'string') return

    const opts = toValue(options) ?? {}

    if (evt.repeat && opts.repeat !== true) return

    const list = combos.value

    if (list.length === 0) return

    const key = evt.key.toLowerCase()
    const code = typeof evt.code === 'string' ? evt.code.toLowerCase() : ''
    const typing = opts.ignoreInputs !== false && isTypingTarget(evt.target)

    for (const combo of list) {
      if ((!typing || !combo.typing) && matches(combo, evt, key, code)) {
        if (opts.preventDefault !== false) {
          evt.preventDefault()
        }

        handler(evt, combo.shortcut)
        return
      }
    }
  }

  const { stopEventListener } = useEventListener(
    () => toValue(toValue(options)?.target) ?? window,
    () => (toValue(options)?.keyup === true ? 'keyup' : 'keydown'),
    onKey,
    () => {
      const opts = toValue(options) ?? {}
      return {
        capture: opts.capture === true,
        disabled: opts.disabled === true
      }
    }
  )

  return {
    stopKeyboardShortcut: stopEventListener
  }
}
