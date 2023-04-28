<template>
  <div class="q-layout-padding">
    <div>Check console.log</div>
    <div>Output should be:</div>
    <ul>
      <li>called onMyEvent</li>
      <li>called onceMyEvent</li>
      <li>called onMyEvent</li>
      <li>called onSomeOtherEvent</li>
      <li>called onMyEvent</li>
      <li>called onMyEvent2</li>
    </ul>
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

function onMyEvent2 () {
  console.log('called onMyEvent2')
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

bus.on('my-event', onMyEvent)
bus.on('my-event', onMyEvent2)
bus.emit('my-event')
bus.off('my-event')
bus.emit('my-event')
</script>
