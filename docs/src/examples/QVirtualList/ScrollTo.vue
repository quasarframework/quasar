<template>
  <div class="q-pa-md">
    <div class="q-pa-md row">
      <q-space />
      <q-input
        style="min-width: 10em"
        type="number"
        :value="virtualListIndex"
        :min="0"
        :max="9999"
        label="Scroll to index"
        input-class="text-right"
        @input="val => { $refs.virtualListRef.scrollTo(val, val > virtualListIndex) }"
      />
    </div>

    <q-virtual-list
      ref="virtualListRef"
      class="q-my-md"
      style="max-height: 300px;"
      component="q-list"
      :items="heavyList"
      separator
      @virtual-scroll="onVirtualScroll"
    >
      <template v-slot="{ item, index }">
        <q-item
          :key="index"
          dense
          :class="{ 'bg-black text-white': index === virtualListIndex }"
        >
          <q-item-section>
            <q-item-label>
              #{{ index }} - {{ item.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-list>
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

Object.freeze(heavyList)

export default {
  data () {
    return {
      heavyList,
      virtualListIndex: 1200
    }
  },

  mounted () {
    this.$refs.virtualListRef.scrollTo(this.virtualListIndex)
  },

  methods: {
    onVirtualScroll ({ index }) {
      this.virtualListIndex = index
    }
  }
}
</script>
