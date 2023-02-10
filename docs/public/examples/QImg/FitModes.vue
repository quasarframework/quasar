<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-img
        v-for="mode in fitModes"
        :key="mode"
        src="https://picsum.photos/500/300"
        style="max-width: 300px; height: 150px;"
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
