import { defineComponent, markRaw } from 'vue'

export function createComponent (raw) { return markRaw(defineComponent(raw)) }
export function createDirective (raw) { return markRaw(raw) }
