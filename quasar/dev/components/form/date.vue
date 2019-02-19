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
        <q-toggle :dark="dark" v-model="todayBtn" label="Today Button" />
      </div>

      <div>{{ date }}</div>

      <div class="q-gutter-y-md column">
        <q-date
          v-model="date"
          v-bind="props"
          :style="style"
        />

        <q-date
          v-model="date"
          v-bind="props"
          :style="style"
          landscape
        />
      </div>

      <div class="text-h6">
        Null/Undefined model
        <q-btn outline color="primary" size="sm" label="Reset" @click="nullDate = null" />
      </div>
      <div class="q-gutter-md column">
        <q-date
          v-model="nullDate"
          v-bind="props"
          :style="style"
        />

        <q-date
          default-year-month="1986/02"
          v-model="nullDate"
          v-bind="props"
          :style="style"
          landscape
        />
      </div>

      <div class="text-h6">
        Colored
      </div>
      <div class="q-gutter-md column">
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

      <div class="text-h6">
        Events
      </div>
      <div class="q-gutter-md column">
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

      <div class="text-h6">
        Limited options
      </div>
      <div class="q-gutter-md column">
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

      <div class="text-h6">
        Negative years: {{ dateNeg }}
      </div>
      <div class="q-gutter-md column">
        <q-date
          v-model="dateNeg"
          v-bind="props"
          :style="style"
        />

        <q-input :dark="dark" filled v-model="dateNeg">
          <q-icon slot="append" name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date
                v-model="dateNeg"
                v-bind="props"
                :style="style"
              />
            </q-popup-proxy>
          </q-icon>
        </q-input>
      </div>

      <div class="text-h6">
        Input: {{ input }}
      </div>
      <div class="q-gutter-md column">
        <q-input :dark="dark" filled v-model="input" mask="date" :rules="['date']">
          <q-icon slot="append" name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date
                v-model="input"
                v-bind="props"
                :style="style"
              />
            </q-popup-proxy>
          </q-icon>
        </q-input>
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
      todayBtn: false,

      date: '2018/11/03',
      dateNeg: '-13/11/03',
      events: ['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23'],
      options: ['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23'],

      nullDate: null,

      input: null
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        disable: this.disable,
        readonly: this.readonly,
        minimal: this.minimal,
        todayBtn: this.todayBtn
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
