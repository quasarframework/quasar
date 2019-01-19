<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <div style="height: 250px; width: 80%; border: 1px solid lightgray;" class="scroll">
        <q-infinite-scroll @load="onLoad" :offset="250">
          <div v-for="(item, index) in items" :key="index" class="caption">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
          </div>
          <div slot="message" class="row justify-center q-my-md">
            <q-spinner-dots  :size="40"></q-spinner-dots>
          </div>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}]
    }
  },

  methods: {
    onLoad (index, done) {
      setTimeout(() => {
        this.items.push({}, {}, {}, {}, {}, {}, {})
        done()
      }, 2000)
    }
  }
}
</script>
