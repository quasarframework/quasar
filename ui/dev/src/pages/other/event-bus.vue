<template>
  <div class="q-layout-padding">
    Check console.log
  </div>
</template>

<script setup>
/* eslint-disable */
import { h, ref, computed, watch, nextTick, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue'
import { EventBus } from 'quasar'

const bus = new EventBus()

function onMyEvent () {
  console.log('called onMyEvent')
}

function onceMyEvent () {
  console.log('called onceMyEvent')
}

function onSomeOtherEvent () {
  console.log('called onSomeOtherEvent')
}

bus.on('my-event', onMyEvent)
bus.once('my-event', onceMyEvent)
bus.on('some-other-event', onSomeOtherEvent)

bus.emit('my-event')
bus.emit('my-event')
bus.emit('some-other-event')
bus.emit('bogus-event')

bus.off('my-event', onMyEvent)
bus.emit('my-event')

/**
 * Output should be:
 *   called onMyEvent
 *   called onceMyEvent
 *   called onMyEvent
 *   called onSomeOtherEvent
 */
</script>
