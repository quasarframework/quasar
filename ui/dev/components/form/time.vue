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

      <div class="text-h6">
        Null/Undefined model
        <q-btn outline color="primary" size="sm" label="Reset" @click="nullTime = null" />
      </div>
      <q-time
        v-model="nullTime"
        v-bind="props"
        :style="style"
      />

      <div class="text-h6">
        Colored
      </div>
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

      <div class="text-h6">
        Limited options
      </div>
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
          :options="optionsFn"
          :style="style"
        />
      </div>

      <div class="text-h6">
        Input: {{ input }}
      </div>
      <div class="q-gutter-md">
        <q-input :dark="dark" filled v-model="input" :mask="withSeconds ? 'fulltime' : 'time'" :rules="[withSeconds ? 'fulltime' : 'time']">
          <q-icon slot="append" name="access_time" class="cursor-pointer">
            <q-popup-proxy>
              <q-time
                v-model="input"
                v-bind="props"
                :style="style"
              />
            </q-popup-proxy>
          </q-icon>
        </q-input>
      </div>

      <div class="text-h6 q-mt-xl q-mb-none">
        ParseFormat: {{ timeParse }}
      </div>
      <div class="q-gutter-md column">
        <q-input :dark="dark" filled v-model="mask" label="Mask" />
        <q-select :dark="dark" filled v-model="locale" label="Locale" :options="localeOptions" emit-value map-options clearable />

        <div class="row q-gutter-sm items-center">
          <q-date
            v-model="timeParse"
            :mask="mask"
            :locale="localeComputed"
            v-bind="props"
            :style="style"
          />
          <q-time
            v-model="timeParse"
            :mask="mask"
            :locale="localeComputed"
            v-bind="props"
            :style="style"
          />
        </div>

        <q-input :dark="dark" filled v-model="timeParse" />
      </div>
    </div>
  </div>
</template>

<script>
import languages from '../../../lang/index.json'

const localeOptions = languages.map(lang => ({
  label: lang.nativeName,
  value: require(`../../../lang/${lang.isoName}.js`).default
}))

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

      mask: 'MMMM, Do YYYY, hh:mm A',

      time: '10:56',
      nullTime: null,
      input: null,
      timeParse: 'January, 23 2019, 11:23 PM',

      timeLimit: '10:56',
      hourOptions: [9, 10, 11, 13, 15],
      minuteOptions: [0, 15, 30, 45],
      secondOptions: [0, 10, 20, 30, 40, 50],

      locale: null,
      localeOptions
    }
  },

  computed: {
    props () {
      return {
        withSeconds: this.withSeconds,
        format24h: this.format24h,
        nowBtn: this.nowBtn,
        dark: this.dark,
        disable: this.disable,
        readonly: this.readonly
      }
    },

    style () {
      if (this.fullWidth) {
        return 'width: 100%;'
      }
    },

    localeComputed () {
      return this.locale ? this.locale.date : this.$q.lang.date
    }
  },

  methods: {
    onInput (val) {
      console.log('@input', val)
    },

    optionsFn (hr, min, sec) {
      if (hr < 6 || hr > 15 || hr % 2 !== 0) { return false }
      if (min !== null && (min <= 25 || min >= 58)) { return false }
      if (sec !== null && sec % 10 !== 0) { return false }
      return true
    }
  }
}
</script>
