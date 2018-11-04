<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div style="max-width: 600px" class="q-gutter-y-md">

      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="withSeconds" label="With Seconds" />
        <q-toggle :dark="dark" v-model="format24h" label="24H format" />
      </div>

      <div>{{ time }}</div>

      <q-time
        v-model="time"
        @input="onInput"
        v-bind="props"
      />

      <q-time
        v-model="time"
        v-bind="props"
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
      withSeconds: false,
      format24h: false,

      time: '10:56'
    }
  },

  computed: {
    props () {
      return {
        withSeconds: this.withSeconds,
        format24h: this.format24h,
        dark: this.dark,
        disable: this.disable,
        readonly: this.readonly
      }
    }
  },

  methods: {
    onInput (val) {
      console.log('@input', val)
    }
  }
}
</script>
