<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div style="max-width: 600px" class="q-gutter-y-md">

      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="withSeconds" label="With Seconds" />
        <q-toggle :dark="dark" v-model="format24h" label="24H format" />
        <q-toggle :dark="dark" v-model="fullWidth" label="Full Width" />
        <q-toggle :dark="dark" v-model="nowBtn" label="Now Button" />
        <q-toggle :dark="dark" v-model="autoSwitchView" label="Auto switch view" />
      </div>

      <div>{{ time }}</div>

      <q-time
        v-model="time"
        v-bind="props"
        :style="style"
      />

      <q-time
        v-model="time"
        v-bind="props"
        :style="style"
        landscape
      />

      <div class="text-h6">Colored</div>
      <div class="q-gutter-md">
        <q-time
          v-model="time"
          v-bind="props"
          color="orange"
          :style="style"
        />

        <q-time
          v-model="time"
          v-bind="props"
          color="yellow"
          text-color="black"
          :style="style"
        />
      </div>

      <!--
      <div class="text-h6">Events</div>
      <div class="q-gutter-md">
        <q-time
          v-model="time"
          v-bind="props"
          :events="events"
          event-color="orange"
          :style="style"
        />

        <q-time
          v-model="time"
          v-bind="props"
          :events="eventFn"
          :event-color="eventColor"
          :style="style"
        />
      </div>
      -->

      <div class="text-h6">Limited options</div>
      <div class="q-gutter-md">
        <q-time
          v-model="timeLimit"
          v-bind="props"
          :hour-options="hourOptions"
          :minute-options="minuteOptions"
          :second-options="secondOptions"
          :style="style"
        />

        <q-time
          v-model="timeLimit"
          v-bind="props"
          :hour-options="hourOptionsFn"
          :minute-options="minuteOptionsFn"
          :second-options="secondOptionsFn"
          :style="style"
        />
      </div>
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
      fullWidth: false,
      nowBtn: false,
      autoSwitchView: false,

      time: '10:56',

      timeLimit: '10:56',
      hourOptions: [9, 10, 11, 13],
      minuteOptions: [0, 15, 30, 45],
      secondOptions: [0, 10, 20, 30, 40, 50]
    }
  },

  computed: {
    props () {
      return {
        withSeconds: this.withSeconds,
        format24h: this.format24h,
        nowBtn: this.nowBtn,
        autoSwitchView: this.autoSwitchView,
        dark: this.dark,
        disable: this.disable,
        readonly: this.readonly
      }
    },

    style () {
      if (this.fullWidth) {
        return 'width: 100%;'
      }
    }
  },

  methods: {
    onInput (val) {
      console.log('@input', val)
    },

    eventFn (date) {
      return date[9] % 3 === 0
    },

    eventColor (date) {
      return date[9] % 2 === 0 ? 'teal' : 'orange'
    },

    hourOptionsFn (hr) {
      return hr % 2 === 0
    },

    minuteOptionsFn (min) {
      return min > 25 && min < 58
    },

    secondOptionsFn (sec) {
      return sec % 10 === 0
    }
  }
}
</script>
