<template>
  <div class="relative-position">
    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <q-list>
        <q-item
          v-for="n in 30"
          :key="n"
          :data-id="n"
          class="q-my-md q-pa-sm bg-grey-3"
          style="min-height: 300px;"
          v-intersection="onIntersection"
        >
          <q-item-section
            class="text-center"
            style="background: #eee">
            <q-card
              v-if="inView.includes(n)"
              class="my-card"
            >
              <img src="https://cdn.quasar.dev/img/mountains.jpg">

              <q-card-section>
                <div class="text-h6">Our Changing Planet</div>
                <div class="text-subtitle2">by John Doe</div>
              </q-card-section>

              <q-card-section>
                {{ lorem }}
              </q-card-section>
            </q-card>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="example-filler" />
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      inView: [],
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  },

  methods: {
    onIntersection (entry) {
      if (entry.isIntersecting === true) {
        // give a slight delay to make it look better
        setTimeout(() => {
          // add id to array
          this.inView.push(parseInt(entry.target.dataset.id))
        }, 450)
      }
      else {
        let index = this.inView.indexOf(parseInt(entry.target.dataset.id))
        if (index > -1) {
          this.inView.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.example-area
  height: 300px

.example-filler
  height: 350px

.in-view-leave-active
  position: absolute

.my-card
  width: 100%
</style>
