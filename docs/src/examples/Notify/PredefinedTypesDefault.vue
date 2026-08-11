<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn
        no-caps
        unelevated
        color="positive"
        @click="triggerPositive"
        label="Trigger 'positive'"
      />
      <q-btn
        no-caps
        unelevated
        color="negative"
        @click="triggerNegative"
        label="Trigger 'negative'"
      />
      <q-btn
        no-caps
        unelevated
        color="warning"
        text-color="dark"
        @click="triggerWarning"
        label="Trigger 'warning'"
      />
      <q-btn
        no-caps
        unelevated
        color="info"
        @click="triggerInfo"
        label="Trigger 'info'"
      />
      <q-btn
        no-caps
        unelevated
        color="grey-8"
        @click="triggerOngoing"
        label="Trigger 'ongoing'"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function triggerPositive() {
  $q.notify({
    type: 'positive',
    message: 'This is a "positive" type notification.'
  })
}

function triggerNegative() {
  $q.notify({
    type: 'negative',
    message: 'This is a "negative" type notification.'
  })
}

function triggerWarning() {
  $q.notify({
    type: 'warning',
    message: 'This is a "warning" type notification.'
  })
}

function triggerInfo() {
  $q.notify({
    type: 'info',
    message: 'This is a "info" type notification.'
  })
}

function triggerOngoing() {
  // we need to get the notification reference
  // otherwise it will never get dismissed ('ongoing' type has timeout 0)
  const notif = $q.notify({
    type: 'ongoing',
    message: 'Looking up the search terms...'
  })

  // simulate delay
  setTimeout(() => {
    notif({
      type: 'positive',
      message: 'Found the results that you were looking for',
      timeout: 1000
    })
  }, 4000)
}
</script>
