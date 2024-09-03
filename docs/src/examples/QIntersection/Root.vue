<template>
  <div class="q-pa-md">
    <div ref="myListRef" class="scroll root-container">
      <div class="row justify-center q-gutter-sm">
        <q-intersection
          v-for="index in 60"
          :key="index"
          :root="myListRef"
          transition="scale"
          class="example-item"
        >
          <q-card flat bordered class="q-ma-sm">
            <img src="https://cdn.quasar.dev/img/mountains.jpg">

            <q-card-section>
              <div class="text-h6">Card #{{ index }}</div>
              <div class="text-subtitle2">by John Doe</div>
            </q-card-section>
          </q-card>
        </q-intersection>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      myListRef: ref(null)
    }
  }
}
</script>

<style lang="sass" scoped>
.root-container
  height: 250px
  border: 1px solid #fff
  outline: 1px solid #000
  border-radius: 4px

.example-item
  height: 290px
  width: 290px
</style>
