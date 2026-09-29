<template>
  <div class="q-pa-md scroll">
    <q-infinite-scroll @load="onLoad" :offset="250" horizontal>
      <q-card
        v-for="(item, index) in items"
        :key="index"
        class="q-mr-md"
        style="width: 180px"
        flat
        bordered
      >
        <q-card-section class="text-h6">Card {{ index + 1 }}</q-card-section>
        <q-card-section class="q-pt-none"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro.</q-card-section
        >
      </q-card>
      <template #loading>
        <div class="column justify-center q-mx-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([{}, {}, {}, {}, {}, {}, {}])

function onLoad(index, done) {
  setTimeout(() => {
    items.value.push({}, {}, {}, {}, {}, {}, {})
    done()
  }, 2000)
}
</script>
