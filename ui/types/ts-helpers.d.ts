import { ComponentOptions, ComponentPublicInstance, ComputedOptions, MethodOptions, VNodeProps, AllowedComponentProps, ComponentCustomProps } from 'vue';

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

// https://github.com/vuejs/vue-next/blob/d84d5ecdbdf709570122175d6565bb61fae877f2/packages/runtime-core/src/apiDefineComponent.ts#L29-L31
// TODO: This can be imported from vue directly once this PR gets merged: https://github.com/vuejs/vue-next/pull/2403
export type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;

// Can't use `DefineComponent` because of the false prop inferring behavior, it doesn't pick up the required types when an interface is passed
// This PR will probably solve the problem as it moves the prop inferring behavior to `defineComponent` function: https://github.com/vuejs/vue-next/pull/4465
// GlobalComponentConstructor helper is kind of like the ComponentConstructor type helper, but simpler and keeps the Volar errors simpler,
// and also similar to the usage in official Vue packages: https://github.com/vuejs/vue-next/blob/d84d5ecdbdf709570122175d6565bb61fae877f2/packages/runtime-core/src/components/BaseTransition.ts#L258-L264 or https://github.com/vuejs/vue-router-next/blob/5dd5f47515186ce34efb9118dda5aad0bb773439/src/RouterView.ts#L160-L172 etc.
// TODO: This can be replaced with `DefineComponent` once this PR gets merged: https://github.com/vuejs/vue-next/pull/4465
export type GlobalComponentConstructor<Props = {}, Slots = {}> = {
  new (): {
    $props: PublicProps & Props
    $slots: Slots
  }
}
