<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">
          On a real mobile device DateTime Input opens up a Modal
          instead of a Popover.
        </span>
        <span class="mobile-only">
          On a desktop platform DateTime Input opens up a Popover
          instead of a Modal.
        </span>
      </p>

      <div class="bg-secondary text-white">
        Model: <em>{{model}}</em>
      </div>
      <q-input v-model="format" float-label="Format string" />
      <div class="bg-secondary text-white">
        Formatted: <em>{{modelFormatted}}</em>
      </div>

      <p class="caption">
        Date
        <br>
        <small class="mat-only">
          <span class="desktop-only">Click</span>
          <span class="mobile-only">Tap</span>
          on header labels to change month, day or year.
        </small>
        <small class="ios-only">
          Set month, day and years by
          <span class="desktop-only">
            clicking. On a mobile device you need to pan to change date or time.
          </span>
          <span class="mobile-only">
            panning. On a desktop device you need to click to change date or time.
          </span>
        </small>
      </p>
      <q-datetime format="YYYY-MMMM-dddd Do Qo Q" v-model="model" type="date" align="right" />
      <q-datetime stack-label="Stack Label" v-model="model" type="date" />
      <q-datetime float-label="Float Label" v-model="model" type="date" />

      <q-datetime inverted v-model="model" type="date" />
      <q-datetime inverted color="secondary" stack-label="Stack Label" v-model="model" type="date" />
      <q-datetime inverted color="amber" float-label="Float Label" v-model="model" type="date" />

      <p class="caption">
        Time
        <br>
        <small>
          <span class="desktop-only">
            Set hours and minutes by clicking and dragging (or simply clicking)
          </span>
          <span class="mobile-only">
            Set hours and minutes by panning <span class="mat-only">(or simply tapping)</span>
          </span>
          <span class="mat-only">inside of the clock</span>.
        </small>
      </p>
      <q-datetime v-model="model" type="time" />

      <p class="caption">Time 24hr Format (force)</p>
      <q-datetime v-model="model" type="time" format24h />

      <p class="caption">Date & Time</p>
      <q-datetime @change="onChange" v-model="model" type="datetime" />

      <p class="caption">Default Selection</p>
      <q-datetime v-model="model" :default-selection="defaultSelection" type="datetime" />
      <q-datetime v-model="model" :default-selection="defaultSelection" type="time" />

      <p class="caption">With Label</p>
      <q-datetime v-model="model" type="date" label="Pick Date" />

      <p class="caption">With Placeholder</p>
      <q-datetime v-model="model" type="date" placeholder="Pick Date" />

      <p class="caption">With Static Label</p>
      <q-datetime v-model="model" type="date" static-label="Party Date" />

      <p class="caption">Disabled State</p>
      <q-datetime disable v-model="model" type="datetime" />

      <p class="caption">Error State</p>
      <q-datetime error v-model="model" type="datetime" />

      <p class="caption">Min & Max</p>
      <q-datetime type="datetime" v-model="minMaxModel" :min="min" :max="max" />

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-list-header>Date or Time</q-list-header>
        <q-item>
          <q-item-side icon="access_time" />
          <q-item-main>
            <q-datetime class="no-margin" v-model="model" type="time" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="update" />
          <q-item-main>
            <q-datetime class="no-margin" v-model="model" type="date" />
          </q-item-main>
        </q-item>
        <q-item-separator />
        <q-list-header>Date & Time</q-list-header>
        <q-item>
          <q-item-side icon="notifications" />
          <q-item-main>
            <q-datetime class="no-margin" v-model="model" type="datetime" />
          </q-item-main>
        </q-item>
      </q-list>

      <p class="caption">
        Date
        <br>
        <small class="mat-only">
          <span class="desktop-only">Click</span>
          <span class="mobile-only">Tap</span>
          on header labels to change month, day or year.
        </small>
        <small class="ios-only">
          Set month, day and years by
          <span class="desktop-only">
            clicking. On a mobile device you need to pan to change date or time.
          </span>
          <span class="mobile-only">
            panning. On a desktop device you need to click to change date or time.
          </span>
        </small>
      </p>
      <q-inline-datetime v-model="model" type="date" />

      <p class="caption">
        Time
        <br>
        <small>
          <span class="desktop-only">
            Set hours and minutes by clicking and dragging (or simply clicking)
          </span>
          <span class="mobile-only">
            Set hours and minutes by panning <span class="mat-only">(or simply tapping)</span>
          </span>
          <span class="mat-only">inside of the clock</span>.
        </small>
      </p>
      <q-inline-datetime v-model="model" type="time" />

      <p class="caption">Time 24hr Format (force)</p>
      <q-inline-datetime v-model="model" type="time" format24h />

      <p class="caption">Date & Time</p>
      <q-inline-datetime @change="onChange" color="secondary" v-model="model" type="datetime" />

      <p class="caption">Date - Monday as First</p>
      <q-inline-datetime v-model="model" monday-first type="date" />
      <p class="caption">Date - Saturday as First</p>
      <q-inline-datetime v-model="model" saturday-first type="date" />

      <p class="caption">Disabled State</p>
      <q-inline-datetime disable v-model="model" type="datetime" />

      <p class="caption">Readonly State</p>
      <q-inline-datetime readonly v-model="model" type="datetime" />
      <p class="caption">Min & Max</p>
      <q-inline-datetime type="datetime" v-model="minMaxModel" :min="min" :max="max" />
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

const day = '2016-10-24T10:40:14.674Z'

export default {
  data () {
    return {
      // model: '2016-09-18T10:45:00.000Z',
      model: undefined,
      defaultSelection: '2016-09-18T10:45:00.000Z',

      format: 'MMMM D, YYYY [at] h:mm [[]a[\\]]',

      minMaxModel: date.formatDate(day),

      min: date.subtractFromDate(day, {days: 5}),
      max: date.addToDate(day, {days: 4, month: 1, minutes: 10})
    }
  },
  computed: {
    modelFormatted () {
      return date.formatDate(this.model, this.format)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', val)
    }
  }
}
</script>
