---
title: useKeyboardShortcut composable
desc: What is useKeyboardShortcut() composable and how you can use it
keys: useKeyboardShortcut
badge: v2.34+
examples: useKeyboardShortcut
related:
  - /vue-composables/use-event-listener
  - /vue-components/dialog
  - /vue-components/menu
---

The `useKeyboardShortcut()` composable runs a handler when the user presses a keyboard shortcut like `Mod+K`, `Ctrl+Shift+P`, `?` or `Escape`. It takes care of the parts that a plain `keydown` listener gets wrong: matching the exact set of modifiers, mapping `Mod` to the Command key on macOS and to Ctrl everywhere else, ignoring the auto-repeated events of a held key, staying out of the way while the user types in a text field, skipping the key events of an IME composition and preventing the browser's own action for the matched key.

Use it for command palettes, "press ? for help", navigation keys on a page, or any action you want reachable from the keyboard without a focused button.

> [!NOTE]
> On the server-side of SSR or SSG modes, the composable never listens to anything.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. It then starts listening on `window` right away and nothing stops it by itself: call `stopKeyboardShortcut()` when you are done.

## Syntax

```js
import { useKeyboardShortcut } from 'quasar'

setup () {
  const { stopKeyboardShortcut } = useKeyboardShortcut(
    'Mod+K', // a shortcut, or an Array of shortcuts for the same action
    (evt, shortcut) => {
      // evt      - the KeyboardEvent
      // shortcut - the shortcut String that matched it
    },
    { // all optional:
      target: window,        // element, component or window to listen on (default: window)
      keyup: true,           // fire on keyup instead of keydown (default: false)
      capture: true,         // listen in the capture phase (default: false)
      repeat: true,          // also fire while the key is held down (default: false)
      preventDefault: false, // prevent the browser's own action for the key (default: true)
      ignoreInputs: false,   // skip typing shortcuts while in a text field (default: true)
      disabled: true         // pause listening (default: false)
    }
  )

  // ...
}
```

```ts
function useKeyboardShortcut(
  shortcut: MaybeRefOrGetter<string | string[]>,
  handler: (evt: KeyboardEvent, shortcut: string) => void,
  options?: MaybeRefOrGetter<{
    target?: MaybeRefOrGetter<
      EventTarget | ComponentPublicInstance | null | undefined
    >
    keyup?: boolean
    capture?: boolean
    repeat?: boolean
    preventDefault?: boolean
    ignoreInputs?: boolean
    disabled?: boolean
  }>
): {
  stopKeyboardShortcut: () => void
}
```

Each call registers one action. Pass an Array of shortcuts when several key combinations should trigger the same action; the handler receives the one that matched, so it can still tell them apart. A press runs the handler once, for the first shortcut in the Array it matches, so overlapping entries are safe: `['Mod+K', 'Ctrl+K']` fires once on every platform, even where `Mod` is Ctrl.

## Writing a shortcut

A shortcut is a String of zero or more modifiers followed by a key, joined by `+`. Names are case-insensitive.

The modifiers are `Ctrl` (or `Control`), `Alt` (or `Option`), `Shift`, `Meta` (or `Cmd`, `Command`, `Win`, `Super`) and `Mod`. `Mod` stands for the modifier that platform conventions use for application shortcuts: the Command key on macOS and Ctrl everywhere else. Write `Mod+S` once and it works as `⌘S` on a Mac and `Ctrl+S` on Windows and Linux.

The key is compared to two properties of the `KeyboardEvent`, and matches when it equals either one:

- its `key`: the character or key name that the press produced, like `k`, `?`, `Escape`, `ArrowDown`, `F1` or `Enter` (see the [full list on MDN](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)). This follows the user's keyboard layout, so `z` is the key labeled Z whether the layout is QWERTY or QWERTZ.
- its `code`: the physical key, like `KeyK`, `Digit1` or `Numpad5`. This ignores the layout and the modifiers. Use it when the `key` would not be what you expect: on macOS, Alt together with a letter produces a symbol (`Alt+K` yields `˚`), so write `Alt+KeyK`; with Shift, a digit becomes a symbol on most layouts, so write `Shift+Digit1` rather than `Shift+1`.

A few aliases are accepted for convenience: `Esc`, `Space`, `Return`, `Plus`, `Up`, `Down`, `Left`, `Right`. A trailing `+` is the plus key itself, so `Ctrl++` is the same as `Ctrl+Plus`.

The modifiers must match exactly: `Ctrl+K` does not fire for Ctrl+Shift+K or Ctrl+Alt+K, so you can register both `Ctrl+K` and `Ctrl+Shift+K` for different actions. The one exception is Shift with a punctuation or digit key: `?`, `+` or `1` take Shift on some keyboard layouts and not on others, so a shortcut like `?` fires regardless of Shift. Include `Shift` explicitly (`Shift+?`) when you do want to require it. The character produced still has to match, though: on a US layout Shift with the minus key produces `_`, so `-` does not fire for it. Use the `code` (`Minus`) when you mean the physical key whatever Shift makes of it.

## Typing and text fields

By default, a shortcut that could be typed (a printable character with no Ctrl, Alt or Meta, like `k`, `?` or `Shift+D`) does not fire while the focus is in an `<input>`, a `<textarea>`, a `<select>` or a `contenteditable` element, so a search field can receive the letter `k` even when `k` is a page shortcut. Shortcuts with those modifiers (`Mod+K`) and non-printing keys (`Escape`, `Enter`, `F1`, the arrows) still fire there. Set `ignoreInputs: false` to receive typing shortcuts in text fields too, typically when the `target` is the field itself.

Key events fired while an [Input Method Editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) composes a character (`isComposing`) are never treated as shortcuts. This keeps `Enter`, which commits a composition, from also triggering an action.

## Default action and repeat

A matched key gets its default browser action prevented, so `Mod+S` does not open the "Save page" dialog and `?` does not get typed. Set `preventDefault: false` to keep the browser's action alongside your own (or when the handler needs to decide for itself; it receives the event). Keys that do not match any shortcut are never touched.

Holding a key down makes the browser fire `keydown` repeatedly. Only the first event triggers the handler; set `repeat: true` when the action should keep going while the key is held (a "next item" key, for instance).

## Where it listens

The listener goes on `window` by default, so a shortcut works wherever the focus is. Give a `target` (an element, a component, or a ref or getter of one) to scope it: to a list that handles its own arrow keys, to a dialog, or to an input for the shortcuts you want only there. As with [useEventListener](/vue-composables/use-event-listener), the target can change over time and the listener follows it. `capture: true` listens in the capture phase, which lets the shortcut act before the handlers of the element under focus (and even when one of them stops the propagation).

The `keyup` option fires the handler when the key is released rather than when it is pressed. Keep in mind that `preventDefault()` on `keyup` no longer stops the browser's action, which happened on `keydown`.

## Changing the options while running

The shortcut and the options can be a plain value, a Ref or a getter Function. Plain values are read once. With a Ref or a getter, the composable tracks whatever reactive state it reads and re-applies it whenever that state changes: user-configurable key bindings are a getter returning the current shortcut, and `disabled` pauses the listening while a dialog is open or a mode is inactive.

```js
import { ref } from 'vue'
import { useKeyboardShortcut } from 'quasar'

setup () {
  const binding = ref('Mod+K')
  const dialogOpen = ref(false)

  useKeyboardShortcut(
    binding,
    () => { /* ... */ },
    () => ({ disabled: dialogOpen.value })
  )

  // ...
}
```

`stopKeyboardShortcut()` ends the listening for good; you will rarely need it, as the composable stops by itself when the component gets destroyed.

## Examples

<DocExample title="Page-wide shortcuts" file="PageWide" />

Shortcuts scoped to a region through `target`. The card is the target (a component works, its root element is used), so the keys reach it from whichever element inside has the focus: `j`/`k` and the arrows move the highlight, `Enter` opens the item and `/` jumps to the filter field. Typing `j` in that field just types, since typing shortcuts stay out of text fields, while `ArrowDown` still moves the highlight from there. Outside the card the keys do nothing.

<DocExample title="Scoped to a region" file="Region" />

> [!TIP]
> For a single field you render yourself, Vue's own key modifiers (`@keydown.enter`, `@keydown.esc`) are all you need. The composable earns its place with modifier combos (`Mod+Enter`), regions and `window` scope, typing-aware shortcuts and bindings that change at runtime.

> [!TIP]
> Quasar components with their own keyboard handling ([QDialog](/vue-components/dialog) and [QMenu](/vue-components/menu) close on Escape, [QSelect](/vue-components/select) navigates with the arrows) keep working alongside your shortcuts. Avoid registering `Escape` on `window` for a page-level action while such a component is open, or pair it with `disabled` bound to the component's model, as both would react to the same press.
