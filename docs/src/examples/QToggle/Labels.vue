<template>
  <div class="q-pa-md q-gutter-lg">
    <q-toggle
      v-model="value"
      label="On Right"
    />
    <q-toggle
      v-model="value"
      color="green"
      label="On Right"
    />
    <q-toggle
      v-model="value"
      color="yellow"
      label="On Right"
    />
    <q-toggle
      v-model="value"
      color="red"
      label="On Right"
    />
    <br>
    <q-toggle
      v-model="value"
      label="On Left"
      left-label
    />
    <q-toggle
      v-model="value"
      color="green"
      label="On Left"
      left-label
    />
    <q-toggle
      v-model="value"
      color="yellow"
      label="On Left"
      left-label
    />
    <q-toggle
      v-model="value"
      color="red"
      label="On Left"
      left-label
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: true
    }
  }
}
</script>
