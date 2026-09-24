import {
  ReactiveEffect,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toValue
} from 'vue'

import { getTargetElement } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const { mutationRecords, stop } = useMutation(options)
 *
 * mutationRecords - the last batch of MutationRecord delivered
 *
 * options - plain object, ref or getter of:
 *    target     - ref (or getter) of an Element or a component instance;
 *                 defaults to the root element of the current component
 *    childList, attributes, characterData, subtree, attributeOldValue,
 *    characterDataOldValue, attributeFilter
 *               - MutationObserver options; with none of them set, every
 *                 kind of change gets observed (same as v-mutation)
 *    once       - stop observing after the first batch of records;
 *                 setting it back to false starts observing again
 *    disabled   - pause observing (a `once` that already fired stays off
 *                 for as long as `once` holds)
 *    onMutation - called with the Array of MutationRecord; return false
 *                 to stop for good
 */

const observeKeys = [
  'childList',
  'attributes',
  'characterData',
  'subtree',
  'attributeOldValue',
  'characterDataOldValue',
  'attributeFilter'
]

const defaultInit = {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true,
  attributeOldValue: true,
  characterDataOldValue: true
}

function getObserveInit(opts) {
  let init

  observeKeys.forEach(key => {
    const value = opts[key]
    if (value !== void 0) {
      if (init === void 0) init = {}
      init[key] = value
    }
  })

  return init ?? defaultInit
}

export default function useMutation(options) {
  const mutationRecords = shallowRef([])

  if (__QUASAR_SSR_SERVER__) {
    return { mutationRecords, stop: noop }
  }

  const vm = getCurrentInstance()

  let el = null,
    observer = null,
    once = false,
    onMutation,
    // `done` once a `once` batch got delivered; `stopped` once the
    // handler (or stop()) asked to end it for good
    done = false,
    stopped = false

  function release() {
    if (observer !== null) {
      observer.disconnect()
      observer = null
    }
  }

  function onRecords(records) {
    // disconnect() empties the record queue, so the callback only ever
    // runs while observing
    mutationRecords.value = records
    const keep = onMutation?.(records)

    if (keep === false || once) {
      done = true
      if (keep === false) stopped = true
      release()
    }
  }

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the options (and a target ref) read
  const effect = new ReactiveEffect(() => {
    const opts = toValue(options) ?? {}
    const newEl = getTargetElement(opts.target, vm)

    once = opts.once === true
    onMutation = opts.onMutation

    // a `once` that fired re-arms when `once` goes away
    if (!once && stopped === false) {
      done = false
    }

    if (newEl !== el) {
      release()
      el = newEl
      // another element starts from scratch
      if (stopped === false) {
        done = false
      }
    }

    if (opts.disabled === true || done || el === null) {
      release()
      return
    }

    if (observer === null) {
      observer = new MutationObserver(onRecords)
    }

    // observe() on an already observed node only replaces the options,
    // keeping the pending records
    observer.observe(el, getObserveInit(opts))
  })

  effect.scheduler = () => {
    effect.run()
  }

  if (vm !== null) {
    // first run once the template refs and the root element exist
    onMounted(() => {
      effect.run()
    })
    onBeforeUnmount(release)
  } else {
    effect.run()
  }

  return {
    mutationRecords,

    stop() {
      done = true
      stopped = true
      release()
      el = null
      effect.stop()
    }
  }
}
