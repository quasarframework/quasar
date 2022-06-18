<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      v-for="size in sizes" :key="`btn_size_sq_${size}`"
      color="primary"
      :size="size"
      :label="`Size ${size}`"
    />
    <br>
    <q-btn
      v-for="size in sizes" :key="`btn_size_rd_${size}`"
      rounded
      color="primary"
      :size="size"
      :label="`Size ${size}`"
    />
    <br>
    <q-btn
      v-for="(size, i) in sizes" :key="`btn_size_round_${size}`"
      round
      color="primary"
      :size="size"
      :icon="icons[i]"
    />

    <br>

    <q-btn
      v-for="size in sizes" :key="`btn_size_dense_sq_${size}`"
      dense
      color="primary"
      :size="size"
      :label="`Size ${size}`"
    />
    <br>
    <q-btn
      v-for="size in sizes" :key="`btn_size_dense_rd_${size}`"
      rounded
      dense
      color="primary"
      :size="size"
      :label="`Size ${size}`"
    />
    <br>
    <q-btn
      v-for="(size, i) in sizes" :key="`btn_size_dense_round_${size}`"
      round
      dense
      color="primary"
      :size="size"
      :icon="icons[i]"
    />

    <br>

    <q-btn
      size="10px"
      color="black"
      label="Text height: 10px"
    />
    <q-btn
      size="22px"
      class="q-px-xl q-py-xs"
      color="purple"
      label="Custom"
    />
    <q-btn
      size="35px"
      round
      color="teal"
      icon="map"
    />
  </div>
</template>

<script>
export default {
  setup () {
    return {
      sizes: [ 'xs', 'sm', 'md', 'lg', 'xl' ],
      icons: [
        'navigation',
        'add_a_photo',
        'camera',
        'camera_front',
        'my_location'
      ]
    }
  }
}
</script>
