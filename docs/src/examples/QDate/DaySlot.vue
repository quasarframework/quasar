<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date
        class="day-slot--example"
        v-model="date"
        :events="eventsFn"
        :event-color="eventDetailsFn"
      >
        <template v-slot:day="day">
          <small v-if="day.fill === true" class="text-grey-4">
            {{ day.i }}
          </small>
          <div v-else-if="day.event" class="day-slot__events--example absolute-full">
            <div
              v-for="({ color, label, details }, index) in day.event"
              :key="index"
              :class="'bg-' + color"
            >
              <q-tooltip
                :content-class="'day-slot__tooltip--example q-px-md q-py-sm rounded-borders bg-white text-subtitle2 text-' + color"
                anchor="bottom right"
                self="top left"
                :offset="[ 4, 4 ]"
              >
                {{ label }}
              </q-tooltip>
            </div>
          </div>
        </template>
      </q-date>
    </div>
  </div>
</template>

<style lang="sass">
.day-slot__events--example
  border-radius: 50%
  mix-blend-mode: overlay

  > div
    position: absolute
    left: 0
    right: 0
    height: 50%

  > div:first-child
    top: 0
    border-top-left-radius: 15px
    border-top-right-radius: 15px

  > div:last-child
    bottom: 0
    border-bottom-left-radius: 15px
    border-bottom-right-radius: 15px

  > div:first-child:last-child
    height: 100%

.day-slot--example
  .q-btn--unelevated
    .day-slot__events--example
      border: 2px solid transparent

  .q-date__calendar-item--fill
    visibility: visible

.day-slot__tooltip--example
  border: 2px solid currentColor
</style>

<script>
export default {
  data () {
    return {
      date: '2019/02/01'
    }
  },

  methods: {
    eventsFn (date) {
      const parts = date.split('/')
      return [ 1, 3 ].indexOf(parts[2] % 6) > -1
    },

    eventDetailsFn (date) {
      const parts = date.split('/')
      return parts[2] % 6 === 1
        ? [
          {
            color: 'red',
            label: `Event on ${date}`
          }
        ]
        : [
          {
            color: 'orange',
            label: `Task on ${date}`
          },
          {
            color: 'green',
            label: `Recurring event on ${date}`
          }
        ]
    }
  }
}
</script>
