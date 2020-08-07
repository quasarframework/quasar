<template>
  <q-layout view="lHh LpR fFf">
    <q-page-container>
      <q-page padding class="q-pr-xl">
        <div class="q-pa-md">
          <div class="q-pa-md row q-gutter-sm items-center">
            <q-input
              style="min-width: 10em"
              type="number"
              :value="virtualListIndex"
              :min="0"
              :max="99999"
              label="Scroll to index"
              input-class="text-right"
              @input="onIndexChange"
            />

            <q-option-group type="radio" v-model="alignMode" :options="alignModes" inline />
          </div>

          <q-virtual-scroll
            ref="virtualListRef"
            class="q-my-md"
            style="max-height: 60vh;"
            component="q-list"
            :items="heavyList"
            separator
            @virtual-scroll="onVirtualScroll"
          >
            <template v-slot="{ item, index }">
              <q-item
                :key="index"
                dense
                :class="{
                  'bg-grey-8 text-white': index === virtualListIndex,
                  'q-py-xl': index % 4 === 0
                }"
                :style="index === 99999 ? 'height: 800px' : void 0"
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
const heavyList = []

for (let i = 0; i < 100000; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1),
    html: 'Option <em class="text-h6">' + (i + 1) + '</em>',
    value: Math.trunc(1 + Math.random() * 99)
  })
}

Object.freeze(heavyList)

export default {
  data () {
    return {
      heavyList,
      virtualListIndex: 1200,
      alignMode: void 0,
      alignModes: [ 'auto', 'start', 'center', 'end', 'start-force', 'center-force', 'end-force' ].map(label => ({ label, value: label === 'auto' ? void 0 : label }))
    }
  },

  mounted () {
    this.$refs.virtualListRef.scrollTo(this.virtualListIndex)
  },

  methods: {
    onIndexChange (index) {
      this.$refs.virtualListRef.scrollTo(index, this.alignMode)
    },
    onVirtualScroll ({ index }) {
      this.virtualListIndex = index
    }
  }
}
</script>
