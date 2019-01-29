<template>
  <div class="q-pa-md">
    <div class="cursor-pointer">
      {{ label }}
      <q-popup-edit v-model="label">
        <q-input v-model="label" dense autofocus counter />
      </q-popup-edit>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      label: 'Click me'
    }
  }
}
</script>
