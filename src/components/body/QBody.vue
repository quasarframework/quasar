<template>
  <div :class="cls">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'q-body',
  data () {
    return {
      cls: []
    }
  },
  created () {
    this.cls = [
      __THEME__,
      this.$q.platform.is.desktop ? 'desktop' : 'mobile',
      this.$q.platform.has.touch ? 'touch' : 'no-touch',
      `platform-${this.$q.platform.is.ios ? 'ios' : 'mat'}`
    ]

    this.$q.platform.within.iframe && this.cls.push('within-iframe')
    this.$q.platform.is.cordova && this.cls.push('cordova')
    this.$q.platform.is.electron && this.cls.push('electron')
  }
}
</script>