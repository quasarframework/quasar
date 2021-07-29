import { ComponentOptions, ComponentPublicInstance, ComputedOptions, MethodOptions } from 'vue';

export type LooseDictionary = { [index in string]: any };

export type StringDictionary<T extends string> = Required<
  { [index in T]: string }
>;

// See: https://stackoverflow.com/a/49936686/7931540
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

// Create a fake constructor signature for a Vue component, needed to correctly extract/infer Component type in many situation,
// especially into VTU to automatically infer Quasar components type when using `findComponent`
// This type is compatible with the Vue private `ComponentPublicInstanceConstructor` type
// https://github.com/vuejs/vue-next/blob/011dee8644bb52f5bdc6365c6e8404936d57e2cd/packages/runtime-core/src/componentPublicInstance.ts#L111
export type ComponentConstructor<Component extends ComponentPublicInstance<Props, RawBindings, D, C, M> = ComponentPublicInstance<any>, Props = any, RawBindings = any, D = any, C extends ComputedOptions = ComputedOptions, M extends MethodOptions = MethodOptions > = { new(): Component } & ComponentOptions<Props, RawBindings, D, C, M>