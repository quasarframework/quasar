import { defineComponent, markRaw } from 'vue'

export const createComponent = raw => markRaw(defineComponent(raw))
export const createDirective = raw => markRaw(raw)
