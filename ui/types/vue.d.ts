import Vue from 'vue'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    meta?: object | ((this: V) => object)
  }
}
