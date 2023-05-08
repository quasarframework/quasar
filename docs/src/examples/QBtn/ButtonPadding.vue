<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      padding="none"
      color="primary"
      icon="eco"
    />

    <q-btn
      padding="xs"
      color="primary"
      icon="eco"
    />

    <q-btn
      padding="lg"
      color="primary"
      icon="eco"
    />

    <q-btn
      padding="10px 5px"
      color="primary"
      icon="eco"
    />

    <q-btn
      padding="xs lg"
      color="primary"
      icon="eco"
    />

    <q-btn
      padding="xl"
      color="primary"
      round
      icon="eco"
    />

    <q-btn
      padding="xs lg"
      color="primary"
      round
      icon="eco"
    />

    <q-btn
      padding="lg xs"
      color="primary"
      round
      icon="eco"
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
