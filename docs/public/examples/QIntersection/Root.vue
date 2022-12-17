<template>
  <div class="q-pa-md">
    <div ref="myListRef" class="row justify-center q-gutter-sm">
      <q-intersection
        v-for="index in 60"
        :key="index"
        :root="listEl"
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
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup () {
    const myListRef = ref(null)

    return {
      myListRef,
      listEl: computed(() => myListRef.value ? myListRef.value.$el : null)
    }
  }
}
</script>

<style lang="sass" scoped>
.example-item
  height: 290px
  width: 290px
</style>
