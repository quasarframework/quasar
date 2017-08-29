<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">
          On a real mobile device Color Picker opens up a Modal
          instead of a Popover.
        </span>
        <span class="mobile-only">
          On a desktop platform Color Picker opens up a Popover
          instead of a Modal.
        </span>
      </p>

      <div class="label bg-secondary text-white">
        <pre>{{model}}</pre>
      </div>

      <div :style="{background: `rgba(${model.rgba.r}, ${model.rgba.g}, ${model.rgba.b}, ${model.rgba.a})`, padding: '2rem', color: '#000', 'text-shadow': '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff'}">{{model.hex}}</div>

      <!-- <p class="caption">
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
      </p> -->
      <q-color-picker v-model="model" />
      <!-- <q-color-picker stack-label="Stack Label" v-model="model" type="date" />
      <q-color-picker float-label="Float Label" v-model="model" type="date" />

      <q-color-picker inverted v-model="model" type="date" />
      <q-color-picker inverted color="secondary" stack-label="Stack Label" v-model="model" type="date" />
      <q-color-picker inverted color="amber" float-label="Float Label" v-model="model" type="date" />

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
      <q-color-picker v-model="model" type="time" />

      <p class="caption">Time 24hr Format</p>
      <q-color-picker v-model="model" type="time" format24h />

      <p class="caption">Date & Time</p>
      <q-color-picker @change="onChange" v-model="model" type="datetime" />

      <p class="caption">Default Selection</p>
      <q-color-picker v-model="model" :default-selection="defaultSelection" type="datetime" />
      <q-color-picker v-model="model" :default-selection="defaultSelection" type="time" />

      <p class="caption">With Label</p>
      <q-color-picker v-model="model" type="date" label="Pick Date" />

      <p class="caption">With Placeholder</p>
      <q-color-picker v-model="model" type="date" placeholder="Pick Date" />

      <p class="caption">With Static Label</p>
      <q-color-picker v-model="model" type="date" static-label="Party Date" />

      <p class="caption">Disabled State</p>
      <q-color-picker disable v-model="model" type="datetime" />

      <p class="caption">Error State</p>
      <q-color-picker error v-model="model" type="datetime" />

      <p class="caption">Min & Max</p>
      <q-color-picker type="datetime" v-model="minMaxModel" :min="min" :max="max" />

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-list-header>Date or Time</q-list-header>
        <q-item>
          <q-item-side icon="access_time" />
          <q-item-main>
            <q-color-picker class="no-margin" v-model="model" type="time" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="update" />
          <q-item-main>
            <q-color-picker class="no-margin" v-model="model" type="date" />
          </q-item-main>
        </q-item>
        <q-item-separator />
        <q-list-header>Date & Time</q-list-header>
        <q-item>
          <q-item-side icon="notifications" />
          <q-item-main>
            <q-color-picker class="no-margin" v-model="model" type="datetime" />
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
      <q-inline-color-picker v-model="model" type="date" />

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
      <q-inline-color-picker v-model="model" type="time" />

      <p class="caption">Time 24hr Format</p>
      <q-inline-color-picker v-model="model" type="time" format24h />

      <p class="caption">Date & Time</p>
      <q-inline-color-picker @change="onChange" color="secondary" v-model="model" type="datetime" />

      <p class="caption">Date - Monday as First</p>
      <q-inline-color-picker v-model="model" monday-first type="date" />
      <p class="caption">Date - Saturday as First</p>
      <q-inline-color-picker v-model="model" saturday-first type="date" />

      <p class="caption">Disabled State</p>
      <q-inline-color-picker disable v-model="model" type="datetime" />

      <p class="caption">Readonly State</p>
      <q-inline-color-picker readonly v-model="model" type="datetime" />
      <p class="caption">Min & Max</p>
      <q-inline-color-picker type="datetime" v-model="minMaxModel" :min="min" :max="max" />


      <p class="caption">I18n</p>
      <q-color-picker inverted format="YYYY-MMMM-dddd" v-model="model" type="date" monday-first :day-names="dayNames" :month-names="monthNames" />
      <q-inline-color-picker v-model="model" monday-first type="date" :day-names="dayNames" :month-names="monthNames" /> -->
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      model: {
        hex: '#194d33',
        hsl: {
          h: 150,
          s: 0.5,
          l: 0.2,
          a: 1
        },
        hsv: {
          h: 150,
          s: 0.66,
          v: 0.30,
          a: 1
        },
        rgba: {
          r: 25,
          g: 77,
          b: 51,
          a: 1
        },
        a: 1
      }
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', val)
    }
  }
}
</script>
