<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-img
        v-for="mode in fitModes"
        :key="mode"
        src="https://placeimg.com/500/300/nature"
        style="max-width: 400px; height: 200px;"
        :fit="mode"
      >
        <div class="absolute-bottom text-subtitle1 text-center">
          {{ mode }}
        </div>
      </q-img>
    </div>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      fitModes: [ 'cover', 'fill', 'contain', 'none', 'scale-down' ]
    }
  }
}
</script>
