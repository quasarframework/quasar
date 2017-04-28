<template>
  <div
    class="q-modal-layout column absolute-full"
    :style="headerStyle"
    :class="headerClass"
  >
    <div class="layout-header">
      <slot name="header"></slot>
      <slot v-if="$q.theme !== 'ios'" name="navigation"></slot>
    </div>

    <div
      class="q-modal-layout-content auto scroll"
      :style="contentStyle"
      :class="contentClass"
    >
      <slot></slot>
    </div>

    <div
      class="layout-footer"
      :style="footerStyle"
      :class="footerClass"
    >
      <slot name="footer"></slot>
      <slot v-if="$q.theme === 'ios'" name="navigation"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'q-modal-layout',
  props: {
    headerStyle: [String, Object, Array],
    headerClass: [String, Object, Array],

    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],

    footerStyle: [String, Object, Array],
    footerClass: [String, Object, Array]
  }
}
</script>
