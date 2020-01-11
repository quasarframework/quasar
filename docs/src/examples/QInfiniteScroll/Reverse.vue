<template>
  <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" reverse>
      <template slot="loading">
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(item, index) in items" :key="index" class="caption q-py-sm">
        <q-badge class="shadow-1">
          {{ items.length - index }}
        </q-badge>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [ {}, {}, {}, {}, {}, {}, {} ]
    }
  },

  methods: {
    onLoad (index, done) {
      setTimeout(() => {
        if (this.items) {
          this.items.splice(0, 0, {}, {}, {}, {}, {}, {}, {})
          done()
        }
      }, 2000)
    }
  }
}
</script>
