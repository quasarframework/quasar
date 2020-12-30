<template>
  <div>
    <div class="q-pa-md row justify-center">
      <q-input
        style="min-width: 10em"
        type="number"
        v-model.number="virtualListIndex"
        :min="0"
        :max="9999"
        label="Scroll to index"
        input-class="text-right"
      />
      <q-btn
        class="q-ml-sm"
        label="Go"
        no-caps
        color="primary"
        @click="$refs.virtualListRef.scrollTo(virtualListIndex, 'start-force')"
      />
    </div>

    <q-virtual-scroll
      ref="virtualListRef"
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
    </q-virtual-scroll>
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
