<template>
  <q-layout view="lHh LpR fFf">
    <q-page-container>
      <q-page padding>
        <q-input
          type="number"
          standout
          dense
          :min="0"
          :max="maxSize"
          input-class="text-right"
          style="width: 10em;"
          label="List size"
          :model-value="size"
          @update:model-value="val => { size = Math.max(0, Math.min(maxSize, parseInt(val, 10))); }"
        />
        <div class="text-h6 q-mt-lg">
          Heavy test - Different components ({{ size.toLocaleString() }} items)
        </div>
        <q-list class="q-my-md bg-grey-10">
          <q-virtual-scroll
            style="max-height: 300px;"
            :items="heavyList"
          >
            <template v-slot="{ item, index }">
              <q-item
                :key="'a'+index"
                v-if="(index % 3) === 0"
                dense
                dark
                clickable
              >
                <q-item-section>
                  <q-item-label>
                    Option - {{ item.label }} #{{ index }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-banner :key="'b'+index" v-else-if="(index % 5) === 0" class="bg-negative">
                <template v-slot:avatar>
                  <q-avatar square color="warning" text-color="negative">
                    {{ item.value }}
                  </q-avatar>
                </template>
                {{ item.label }} #{{ index }}
              </q-banner>

              <div :key="'c'+index" v-else class="bg-yellow q-py-lg text-center">
                {{ item.label }} #{{ index }}
              </div>
            </template>
          </q-virtual-scroll>
        </q-list>

        <div class="text-h6 q-mt-lg row items-center justify-between">
          Heavy test - Variable size ({{ size.toLocaleString() }} items)
          <q-input
            type="number"
            standout
            dense
            :min="0"
            :max="maxSize - 1"
            input-class="text-right"
            label="Scroll to index"
            :model-value="scrollTo"
            @update:model-value="val => { scrollTo = Math.max(0, Math.min(maxSize - 1, parseInt(val, 10))); }"
            @change="$refs.vList.scrollTo(scrollTo)"
          />
        </div>
        <q-virtual-scroll component="q-list" ref="vList" :items="heavyList" separator class="q-my-md" style="max-height: 300px;">
          <template v-slot="{ item, index }">
            <q-item :key="index">
              <q-item-section>
                <q-item-label>
                  {{ item.label }} #{{ index }}
                </q-item-label>

                <q-item-label class="q-py-sm" v-if="(index % 5) === 0">
                  {{ item.label }}
                </q-item-label>

                <q-item-label class="q-py-md text-negative" v-if="(index % 3) === 0">
                  {{ item.value }}
                </q-item-label>

                <q-item-label class="q-py-lg text-positive" v-if="(index % 4) === 0">
                  {{ index }} - {{ item.label }} - {{ item.value }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-virtual-scroll>

        <div class="text-h6 q-mt-lg row items-center justify-between">
          Horizontal - Variable size ({{ size.toLocaleString() }} items)
          <q-input
            type="number"
            standout
            dense
            :min="0"
            :max="maxSize - 1"
            input-class="text-right"
            label="Scroll to index"
            :model-value="scrollToH"
            @update:model-value="val => { scrollToH = Math.max(0, Math.min(maxSize - 1, parseInt(val, 10))); }"
            @change="$refs.vListH.scrollTo(scrollToH)"
          />
        </div>
        <q-virtual-scroll ref="vListH" virtual-scroll-horizontal :virtual-scroll-item-size="165" :items="heavyList" class="q-my-md" style="max-width: 80vw; margin-bottom: 200vh;">
          <template v-slot="{ item, index }">
            <div class="row no-wrap items-center" :key="index">
              <q-avatar square color="warning" text-color="negative">
                {{ item.value }}
              </q-avatar>
              <div class="bg-grey-4" :class="{ 'q-pa-sm': (index % 3) === 0, 'q-pa-xl': (index % 3) === 1, 'q-pa-md': (index % 3) === 2 }">
                {{ item.label }}
              </div>
              <div class="bg-grey-10 text-white q-pa-sm">
                #{{ index }}
              </div>
              <q-separator v-if="index < heavyList.length - 1" vertical spaced />
            </div>
          </template>
        </q-virtual-scroll>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
const maxSize = 100000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
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
      maxSize,
      size: heavyList.length,
      heavyList,
      scrollTo: 0,
      scrollToH: 0
    }
  },

  watch: {
    size (size) {
      this.heavyList = Object.freeze(heavyList.slice(0, size))
    }
  }
}
</script>
