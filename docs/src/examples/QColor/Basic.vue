<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="q-pa-sm">
        <q-chip>{{ hex }}</q-chip>
        <q-color
          v-model="hex"
        />
      </div>
      <div class="q-pa-sm">
        <q-chip>{{ hexa }}</q-chip>
        <q-color
          v-model="hexa"
        />
      </div>
      <div class="q-pa-sm">
        <q-chip>{{ rgb }}</q-chip>
        <q-color
          v-model="rgb"
        />
      </div>
      <div class="q-pa-sm">
        <q-chip>{{ rgba }}</q-chip>
        <q-color
          v-model="rgba"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hex: '#FF00FF',
      hexa: '#FF00FFCC',
      rgb: 'rgb(0,0,0)',
      rgba: 'rgba(255,0,255,0.8)'
    }
  }
}
</script>
