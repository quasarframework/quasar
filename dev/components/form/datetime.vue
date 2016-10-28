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

      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{model}}</em></span>
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
      <quasar-datetime v-model="model" type="date"></quasar-datetime>

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
      <quasar-datetime v-model="model" type="time"></quasar-datetime>

      <p class="caption">Date & Time</p>
      <quasar-datetime v-model="model" type="datetime"></quasar-datetime>

      <p class="caption">Disabled State</p>
      <quasar-datetime disable v-model="model" type="datetime"></quasar-datetime>

      <p class="caption">Readonly State</p>
      <quasar-datetime readonly v-model="model" type="datetime"></quasar-datetime>

      <p class="caption">Error State</p>
      <quasar-datetime class="has-error" v-model="model" type="datetime"></quasar-datetime>

      <p class="caption">Min & Max</p>
      <quasar-datetime type="datetime" v-model="minMaxModel" :min="min" :max="max"></quasar-datetime>

      <p class="caption">Range <sup>(beta)</sup></p>
      <quasar-datetime type="datetime" v-model="range.start" :min="range.min" :max="range.end"></quasar-datetime>
      <quasar-datetime type="datetime" v-model="range.end" :min="range.start" :max="range.max"></quasar-datetime>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="list-label">Date or Time</div>
        <div class="item two-lines">
          <i class="item-primary">access_time</i>
          <div class="item-content">
            <quasar-datetime class="full-width" v-model="model" type="time"></quasar-datetime>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">update</i>
          <div class="item-content row items-baseline">
            <quasar-datetime class="full-width" v-model="model" type="date"></quasar-datetime>
          </div>
        </div>
        <hr>
        <div class="list-label">Date & Time</div>
        <div class="item two-lines">
          <i class="item-primary">notifications</i>
          <div class="item-content row items-baseline">
            <quasar-datetime class="full-width" v-model="model" type="datetime"></quasar-datetime>
          </div>
        </div>
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
      <quasar-inline-datetime v-model="model" type="date"></quasar-inline-datetime>

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
      <quasar-inline-datetime v-model="model" type="time"></quasar-inline-datetime>

      <p class="caption">Date & Time</p>
      <quasar-inline-datetime v-model="model" type="datetime"></quasar-inline-datetime>

      <p class="caption">Disabled State</p>
      <quasar-inline-datetime disable v-model="model" type="datetime"></quasar-inline-datetime>

      <p class="caption">Readonly State</p>
      <quasar-inline-datetime readonly v-model="model" type="datetime"></quasar-inline-datetime>

      <p class="caption">Min & Max</p>
      <quasar-inline-datetime type="datetime" v-model="minMaxModel" :min="min" :max="max"></quasar-inline-datetime>

      <p class="caption">Range <sup>(beta)</sup></p>
      <quasar-inline-datetime type="datetime" v-model="range.start" :min="range.min" :max="range.end"></quasar-inline-datetime>
      <quasar-inline-datetime type="datetime" v-model="range.end" :min="range.start" :max="range.max"></quasar-inline-datetime>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      model: '2016-09-18T10:45:00.000Z',
      minMaxModel: '2016-10-24T10:40:14.674Z',
      min: moment('2016-10-24T10:40:14.674Z').subtract(5, 'days').format(),
      max: moment('2016-10-24T10:40:14.674Z').add(4, 'hours').add(10, 'minutes').format(),
      range: {
        start: moment('2016-10-24T10:40:14.674Z').subtract(3, 'days').format(),
        end: moment('2016-10-24T10:40:14.674Z').add(4, 'hours').add(10, 'minutes').add(1, 'month').format(),
        min: moment('2016-10-24T10:40:14.674Z').subtract(3, 'days').format(),
        max: moment('2016-10-24T10:40:14.674Z').add(4, 'hours').add(10, 'minutes').add(1, 'month').format()// .add(1, 'month').add(1, 'year')
      }
    }
  }
}
</script>
