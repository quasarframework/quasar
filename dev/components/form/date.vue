<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div style="max-width: 600px" class="q-gutter-y-md">

      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="fullWidth" label="Full Width" />
        <q-toggle :dark="dark" v-model="moreHeight" label="More Height" />
      </div>

      <div>{{ date }}</div>

      <q-date
        v-model="date"
        v-bind="props"
        :style="style"
      />

      <q-date
        v-model="date"
        v-bind="props"
        :style="style"
        orientation="landscape"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false,
      disable: false,
      readonly: false,
      fullWidth: false,
      moreHeight: false,

      date: '2018/11/03'
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        disable: this.disable,
        readonly: this.readonly
      }
    },
    style () {
      let style = ''
      if (this.fullWidth) {
        style += 'width: 100%;'
      }
      if (this.moreHeight) {
        style += 'height: 650px'
      }
      return style
    }
  }
}
</script>
