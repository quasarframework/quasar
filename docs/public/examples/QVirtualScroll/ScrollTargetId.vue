<template>
  <div id="virtual-scroll-target" class="scroll" style="max-height: 230px">
    <div class="q-pa-md bg-yellow">
      Above the list - scrolls with the list
    </div>

    <q-virtual-scroll
      scroll-target="#virtual-scroll-target"
      :items="heavyList"
      separator
    >
      <template v-slot="{ item, index }">
        <q-item
          :key="index"
          dense
        >
          <q-item-section>
            <q-item-label>
              #{{ index }} - {{ item.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>

    <div class="q-pa-md bg-yellow">
      Below the list - scrolls with the list
    </div>
  </div>
</template>

<script>
const maxSize = 10000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1)
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
