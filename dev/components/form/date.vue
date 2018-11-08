<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div style="max-width: 600px" class="q-gutter-y-md">

      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="fullWidth" label="Full Width" />
        <q-toggle :dark="dark" v-model="biggerHeight" label="More Height" />
        <q-toggle :dark="dark" v-model="minimal" label="Minimal" />
        <q-toggle :dark="dark" v-model="todayButton" label="Today Button" />
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

      <div class="text-h6">Colored</div>
      <div class="q-gutter-md">
        <q-date
          v-model="date"
          v-bind="props"
          color="orange"
          :style="style"
        />

        <q-date
          v-model="date"
          v-bind="props"
          color="yellow"
          text-color="black"
          :style="style"
        />
      </div>

      <div class="text-h6">Events</div>
      <div class="q-gutter-md">
        <q-date
          v-model="date"
          v-bind="props"
          :events="events"
          event-color="orange"
          :style="style"
        />

        <q-date
          v-model="date"
          v-bind="props"
          :events="eventFn"
          :event-color="eventColor"
          :style="style"
        />
      </div>

      <div class="text-h6">Limited options</div>
      <div class="q-gutter-md">
        <q-date
          v-model="date"
          v-bind="props"
          :options="options"
          :style="style"
        />

        <q-date
          v-model="date"
          v-bind="props"
          :options="optionsFn"
          :style="style"
        />

        <q-date
          v-model="date"
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
      fullWidth: false,
      biggerHeight: false,
      minimal: false,
      todayButton: false,

      date: '2018/11/03',
      events: ['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23'],
      options: ['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23']
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        disable: this.disable,
        readonly: this.readonly,
        minimal: this.minimal,
        todayButton: this.todayButton
      }
    },

    style () {
      let style = ''
      if (this.fullWidth) {
        style += 'width: 100%;'
      }
      if (this.biggerHeight) {
        style += 'height: 650px'
      }
      return style
    }
  },

  methods: {
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
