<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
    <div style="max-width: 600px" class="q-gutter-y-md">
      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" :false-value="null" />
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
        flat
        bordered
      />

      <q-time
        v-model="time"
        v-bind="props"
        :style="style"
        flat
        bordered
      >
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn label="Cancel" color="primary" flat />
          <q-btn label="OK" color="primary" flat />
        </div>
      </q-time>

      <q-time
        v-model="time"
        v-bind="props"
        :style="style"
        landscape
        flat
        bordered
      />

      <q-time
        v-model="time"
        v-bind="props"
        :style="style"
        landscape
        flat
        bordered
      >
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn label="Cancel" color="primary" flat />
          <q-btn label="OK" color="primary" flat />
        </div>
      </q-time>

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
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer" @click.prevent>
              <q-popup-proxy>
                <q-time
                  v-model="input"
                  v-bind="props"
                  :style="style"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="text-h6">
        Input AM/PM: {{ input2 }}
      </div>
      <div class="q-gutter-md">
        <q-input :dark="dark" filled v-model="input2">
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer" @click.prevent>
              <q-popup-proxy>
                <q-time
                  v-model="input2"
                  mask="hh:mm A"
                  v-bind="props"
                  :style="style"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: null,
      disable: false,
      readonly: false,
      withSeconds: false,
      format24h: false,
      fullWidth: false,
      nowBtn: false,

      time: '10:56',
      nullTime: null,
      input: null,
      input2: '12:35 PM',

      timeLimit: '10:56',
      hourOptions: [ 9, 10, 11, 13, 15 ],
      minuteOptions: [ 0, 15, 30, 45 ],
      secondOptions: [ 0, 10, 20, 30, 40, 50 ]
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
    }
  },

  methods: {
    onInput (val) {
      console.log('@update:model-value', val)
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
