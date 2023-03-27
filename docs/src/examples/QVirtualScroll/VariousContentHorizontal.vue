<template>
  <q-virtual-scroll
    :items="heavyList"
    virtual-scroll-horizontal
    v-slot="{ item, index }"
  >
    <div :key="index" class="row items-center">
      <q-separator v-if="index === 0" vertical spaced />

      <q-avatar v-if="item.avatar === true" class="bg-black text-white q-my-md">
        {{ index % 10 + 1 }}
      </q-avatar>

      <q-item
        v-else
        dense
        clickable
      >
        <q-item-section>
          <q-item-label>
            #{{ index }} - {{ item.label }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator vertical spaced />
    </div>
  </q-virtual-scroll>
</template>

<script>
const maxSize = 10000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1),
    avatar: i % 5 === 0
  })
}

export default {
  setup () {
    return {
      heavyList
    }
  }
}
</script>
