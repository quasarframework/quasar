---
title: useMutation composable
desc: What is useMutation() composable and how you can use it
keys: useMutation
badge: v2.34+
examples: useMutation
related:
  - /vue-directives/mutation
  - /vue-composables/use-element-resize
  - /vue-composables/use-intersection
---

The `useMutation()` composable watches for changes being made to the DOM tree of an element (or of a component): child nodes added or removed, attributes changed, text changed. Under the hood it uses the [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

It is the setup-code counterpart of the [v-mutation](/vue-directives/mutation) directive. Use the composable when you want to observe your component's own root, or any element or component ref, without touching the template.

> [!NOTE]
> On the server-side of SSR or SSG modes, the composable never observes anything.

## Syntax

```js
import { useTemplateRef } from 'vue'
import { useMutation } from 'quasar'

setup () {
  const target = useTemplateRef('target') // an Element or a component

  const { mutationRecords, stop } = useMutation({
    // all optional:
    target,               // omit it to observe the component's own root element

    // MutationObserver options; with none of them set,
    // every kind of change gets observed
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
    attributeFilter: [ 'class', 'style' ],

    once: false,          // stop after the first batch of records
    disabled: false,      // pause observing
    onMutation (records) { // called with the Array of MutationRecord
      // return false to stop observing for good
    }
  })

  // ...
}
```

```ts
function useMutation(
  options?: MaybeRefOrGetter<{
    target?: MaybeRefOrGetter<
      Element | ComponentPublicInstance | null | undefined
    >
    childList?: boolean
    attributes?: boolean
    characterData?: boolean
    subtree?: boolean
    attributeOldValue?: boolean
    characterDataOldValue?: boolean
    attributeFilter?: string[]
    once?: boolean
    disabled?: boolean
    onMutation?: (records: MutationRecord[]) => boolean | void
  }>
): {
  mutationRecords: Ref<MutationRecord[]>
  stop: () => void
}
```

Without a `target`, the composable observes the root element of the component it is called in, as of the moment the component gets mounted. A component rendering a fragment (multiple root nodes) has no root element to observe, so supply a `target` there.

Reading the [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) first will be best in your understanding of the observing options. When none of `childList`, `attributes`, `characterData`, `subtree`, `attributeOldValue`, `characterDataOldValue` or `attributeFilter` is set, every kind of change gets observed, with the old values included, the same as the [v-mutation](/vue-directives/mutation) directive without modifiers. Setting any of them observes only what you ask for.

Every batch of [MutationRecord](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord) that the browser delivers after the changes lands in the reactive `mutationRecords` (the last batch only, so it never grows) and is handed to the `onMutation` handler. Returning `false` from the handler stops the observation for good. With `once`, the observation stops by itself after the first batch.

`stop()` ends the observation for good. You will rarely need it, as the composable stops by itself when the component gets destroyed.

> [!WARNING]
> **Warning! Avoid feedback loops**
>
> Whatever your handler (or the reactive state it updates) does to the observed DOM is a new mutation, which calls the handler again, and so on without end: rendering the state inside the observed element, toggling a class on it, appending a node to it. Keep the effects of the handler out of the observed element, or observe only what you need (the element's own `attributes`, its direct `childList`).

## Changing the options while running

The options can be a plain Object, a Ref or a getter Function. A plain Object is read once. With a Ref or a getter, the composable tracks whatever reactive state the options read and re-applies them whenever that state changes, so you never call anything to "update" it:

- toggling `disabled` pauses and resumes the observation (a `once` that already fired stays off for as long as `once` holds; setting `once` back to `false` starts observing again)
- pointing `target` to another element (or letting a template ref change through `v-if`) follows it
- changing what gets observed applies right away, keeping the changes not delivered yet
- swapping `onMutation` takes effect from the next batch

```js
import { ref } from 'vue'
import { useMutation } from 'quasar'

setup () {
  const paused = ref(false)

  useMutation(() => ({
    childList: true,
    disabled: paused.value,
    onMutation (records) { /* ... */ }
  }))

  // ...
}
```

## Example

Observing a list through a template ref: add, remove and rename items, and see every batch of changes as the browser reports it through `mutationRecords`:

<DocExample title="Observing a list" file="Basic" />
