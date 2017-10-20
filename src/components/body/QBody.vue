<template>
  <div :class="cls" id="q-root-body">
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
  methods: {
    setClasses () {
      this.cls = [
        __THEME__,
        this.$q.platform.is.desktop ? 'desktop' : 'mobile',
        this.$q.platform.has.touch ? 'touch' : 'no-touch',
        this.$isServer ? 'server' : 'browser',
        `platform-${this.$q.platform.is.ios ? 'ios' : 'mat'}`
      ]
      console.log(`this.cls`, this.cls)

      this.$q.platform.within.iframe && this.cls.push('within-iframe')
      this.$q.platform.is.cordova && this.cls.push('cordova')
      this.$q.platform.is.electron && this.cls.push('electron')
    }
  },
  created () {
    this.setClasses()
  },
  beforeMount () {
    this.setClasses()
  }
}
</script>