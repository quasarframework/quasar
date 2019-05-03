<template>
  <div class="q-layout-padding">
    <q-btn push color="teal" label="Trigger" @click="trigger" class="q-my-lg" />

    <div class="q-gutter-lg row items-start">
      <q-img
        v-for="transition in transitions"
        :key="transition"
        :transition="transition"
        :src="url"
        style="width: 150px"
        ratio="1"
        spinner-color="white"
      >
        <div class="absolute-bottom text-center text-body2">
          {{ transition }}
        </div>
      </q-img>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: 'https://placeimg.com/500/300/nature',
      transitions: [
        'slide-right',
        'slide-left',
        'slide-up',
        'slide-down',
        'fade',
        'scale',
        'rotate',
        'flip-right',
        'flip-left',
        'flip-up',
        'flip-down',
        'jump-right',
        'jump-left',
        'jump-up',
        'jump-down'
      ]
    }
  },

  methods: {
    trigger () {
      this.url = 'https://placeimg.com/500/300/nature?t=' + Math.random()
    }
  }
}
</script>
