<template>
  <div class="q-pa-md">
    <div class="q-pa-md bg-yellow">
      Above the list
    </div>

    <q-virtual-list
      class="q-my-md"
      style="max-height: 300px;"
      component="q-list"
      :items="heavyList"
      separator
    >
      <template v-slot="{ item, index }">
        <q-banner v-if="item.banner === true" class="bg-black text-white q-py-xl" :key="index">
          #{{ index }} - {{ item.label }}
        </q-banner>

        <q-item
          v-else
          :key="index"
          dense
          clickable
        >
          <q-item-section>
            <q-item-label>
              #{{ index }} - {{ item.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-list>

    <div class="q-pa-md bg-yellow">
      Below the list
    </div>
  </div>
</template>

<script>
const maxSize = 10000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1),
    banner: i % 5 === 0
  })
}

Object.freeze(heavyList)

export default {
  data () {
    return {
      heavyList
    }
  }
}
</script>
