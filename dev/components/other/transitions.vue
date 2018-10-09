<template>
  <div class="q-layout-padding">
    <q-btn push color="teal" label="Trigger" @click="trigger" class="q-my-lg" />

    <div class="q-gutter-lg row items-start">

      <q-img
        v-for="transition in transitions"
        :key="transition"
        :transition="'q-transition--' + transition"
        :src="url"
        style="width: 200px"
        ratio="1"
      >
        <div class="absolute-bottom text-center text-body2">
          q-transition--{{ transition }}
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
