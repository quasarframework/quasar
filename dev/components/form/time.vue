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

      <div class="text-h6">Limited options</div>
      <div class="q-gutter-md">
        <q-time
          v-model="time"
          v-bind="props"
          :options="options"
          :style="style"
        />

        <q-time
          v-model="time"
          v-bind="props"
          :options="optionsFn"
          :style="style"
        />

        <q-time
          v-model="time"
          v-bind="props"
          :options="optionsFn2"
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
      events: ['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23'],
      options: ['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23']
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

    optionsFn (date) {
      return date[9] % 3 === 0
    },

    optionsFn2 (date) {
      return date >= '2018/11/03' && date <= '2018/11/15'
    }
  }
}
</script>
