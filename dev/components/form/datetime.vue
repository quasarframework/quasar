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
      @input<q-datetime @change="value => log('@change', value)" @input="value => log('@input', value)" stack-label="Stack Label" v-model="model" type="date" clearable />
      @change<q-datetime :value="model" @change="value => { model = value; log('@change', value) }" @input="value => log('@input', value)" stack-label="Stack Label" type="date" clearable />

      <q-datetime @change="value => log('@change', value)" @input="value => log('@input', value)" stack-label="Stack Label" v-model="model" type="date" clearable />
      <q-datetime float-label="Float Label" v-model="model" type="date" />
      <q-datetime hide-underline float-label="Float Label (hide underline)" v-model="model" type="date" />

      <q-datetime default-view="month" v-model="model" type="date" float-label="Default view" />
      <q-datetime inverted v-model="model" type="date" />
      <q-datetime inverted color="secondary" stack-label="Stack Label" v-model="model" type="date" />
      <q-datetime inverted color="amber" float-label="Float Label" v-model="model" type="date" />

      <p class="caption">Format Model</p>
      <div class="bg-secondary text-white">
        Model: <em>{{modelVar}}</em> <strong>{{modelVarType}}</strong>
      </div>
      <div class="bg-secondary text-white">
        Formatted: <em>{{modelVarFormatted}}</em>
      </div>
      <q-datetime @change="value => log('@change', value)" @input="value => log('@input', value)" v-model="modelVar" type="date" clearable stack-label="Format Model 'auto'" format-model="auto" />
      <q-datetime @change="value => log('@change', value)" @input="value => log('@input', value)" v-model="modelVar" type="date" clearable stack-label="Format Model 'date'" format-model="date" />
      <q-datetime @change="value => log('@change', value)" @input="value => log('@input', value)" v-model="modelVar" type="date" clearable stack-label="Format Model 'number'" format-model="number" />
      <q-datetime @change="value => log('@change', value)" @input="value => log('@input', value)" v-model="modelVar" type="date" clearable stack-label="Format Model 'string'" format-model="string" />

      <p class="caption">
        Lazy Input
      </p>
      <q-datetime :value="model" @change="val => { model = val; log('@change', val) }" @input="value => log('@input', value)" type="date" clearable />

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

      <p class="caption">Force 12hr Format for Picker, independent of time format</p>
      <q-datetime v-model="model" type="time" format24h="12h" />
      
      <p class="caption">Force 24hr Format for Picker, independent of time format</p>
      <q-datetime v-model="model" type="time" format24h />
      
      <p class="caption">Force i18n Format for Picker, independent of time format</p>
      <q-datetime v-model="model" type="time" format24h="i18n" />

      <p class="caption">Date & Time</p>
      <q-datetime @change="value => log('@change', value)" v-model="model" type="datetime" />

      <p class="caption">Default Selection</p>
      <q-datetime v-model="model" :default-selection="defaultSelection" type="datetime" />
      <q-datetime v-model="model" :default-selection="defaultSelection" type="time" />

      <p class="caption">With explicit popover</p>
      <q-datetime v-model="model" popover type="date"     float-label="Pick Date" />
      <q-datetime v-model="model" popover type="time"     float-label="Pick Time" />
      <q-datetime v-model="model" popover type="datetime" float-label="Pick DateTime" />

      <p class="caption">With explicit modal</p>
      <q-datetime v-model="model" modal type="date"     float-label="Pick Date" />
      <q-datetime v-model="model" modal type="time"     float-label="Pick Time" />
      <q-datetime v-model="model" modal type="datetime" float-label="Pick DateTime" />

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
            <q-datetime v-model="model" type="time" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="update" />
          <q-item-main>
            <q-datetime v-model="model" type="date" />
          </q-item-main>
        </q-item>
        <q-item-separator />
        <q-list-header>Date & Time</q-list-header>
        <q-item>
          <q-item-side icon="notifications" />
          <q-item-main>
            <q-datetime v-model="model" type="datetime" />
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
      <q-datetime-picker v-model="model" type="date" @change="value => log('@change', value)" @input="value => log('@input', value)" />
      <br><br>
      <q-datetime-picker default-view="year" :value="model" type="date" @change="value => { model = value; log('@change', value) }" @input="value => log('@input', value)" />

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
      <q-datetime-picker v-model="model" type="time" />

      <p class="caption">Force 12hr Format for Picker, independent of time format</p>
      <q-datetime-picker v-model="model" type="time" format24h="12h" />
      
      <p class="caption">Force 24hr Format for Picker, independent of time format</p>
      <q-datetime-picker v-model="model" type="time" format24h="24h" />
      
      <p class="caption">Force i18n Format for Picker, independent of time format</p>
      <q-datetime-picker v-model="model" type="time" format24h="i18n" />

      <p class="caption">Date & Time</p>
      @input<q-datetime-picker @input="value => log('@input', value)" @change="value => log('@change', value)" color="secondary" v-model="model" type="datetime" />
      @change<q-datetime-picker :value="model" @input="value => log('@input', value)" @change="value => { model = value; log('@change', value) }" color="secondary" type="datetime" />

      <p class="caption">Date - Monday as First</p>
      <q-datetime-picker v-model="model" monday-first type="date" />
      <p class="caption">Date - Saturday as First</p>
      <q-datetime-picker v-model="model" saturday-first type="date" />

      <p class="caption">Disabled State</p>
      <q-datetime-picker disable v-model="model" type="datetime" />

      <p class="caption">Readonly State</p>
      <q-datetime-picker readonly v-model="model" type="datetime" />
      <p class="caption">Min & Max</p>
      <q-datetime-picker type="datetime" v-model="minMaxModel" :min="min" :max="max" />
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
      modelVar: undefined,
      // model: 0,
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
    },
    modelVarFormatted () {
      return date.formatDate(this.modelVar, this.format)
    },
    modelVarType () {
      return typeof this.modelVar
    }
  },
  methods: {
    log (name, data) {
      console.log(name, JSON.stringify(data))
    }
  }
}
</script>
