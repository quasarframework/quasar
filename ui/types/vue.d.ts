import 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    meta?: object | ((this: ComponentPublicInstance) => object);
  }
}
