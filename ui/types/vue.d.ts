import Vue, { ComponentOptions } from 'vue'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    preFetch?: (options: any) => void | Promise<void>,
    meta?:  object | ((this: V) => object)
  }
}