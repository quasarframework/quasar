<template>
  <div class="q-layout-padding q-mx-auto">
    <div class="row q-gutter-x-sm items-center">
      <q-toggle v-model="horizontal" label="Horizontal" />
      <q-toggle v-model="modelReverse" label="Reverse model" />
      <q-toggle v-model="modelPixels" label="Pixel model" />
      <q-toggle v-model="disable" label="Disable" />
      <q-toggle v-model="funkyLimits" label="Funky limits" />
      <q-toggle v-model="showSeparator" label="Show separator" />
    </div>
    <div class="row q-gutter-x-sm items-center">
      <q-input
        v-model="model"
        standout
        dense
        color="primary"
        input-class="text-right"
      >
        <template v-slot:prepend>
          <q-chip color="primary" square text-color="white">
            Model between {{ limits[0] }} and {{ limits[1] }}
          </q-chip>
        </template>

        <template v-slot:append>
          <q-btn color="primary" flat round dense icon="clear" @click="model = 50" />
        </template>
      </q-input>
    </div>

    <q-splitter
      v-model="model"
      :horizontal="horizontal"
      :model-reverse="modelReverse"
      :model-pixels="modelPixels"
      :limits="limits"
      :disable="disable"

      class="q-mt-md"
      style="height: 700px; border: 1px solid black"
    >
      <div slot="before" class="q-layout-padding">
        <div class="text-h1 q-mb-md">
          Before
        </div>
        <div v-for="n in 20" :key="n" class="q-my-md">
          {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
        </div>
      </div>

      <q-icon
        v-if="showSeparator"
        color="primary"
        slot="separator"
        size="40px"
        name="drag_indicator"
        @click="separatorLog"
      />

      <div slot="after" class="q-layout-padding">
        <div class="text-h1 q-mb-md">
          After
        </div>
        <div v-for="n in 20" :key="n" class="q-my-md">
          {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
        </div>
      </div>
    </q-splitter>

    <q-splitter
      v-model="model"
      :limits="limits"
      :disable="disable"

      class="q-mt-md stylish-splitter"
      separator-class="bg-deep-orange"
    >
      <div slot="before" class="q-layout-padding">
        <div class="text-h1 q-mb-md">
          Before
        </div>
        <div v-for="n in 20" :key="n" class="q-my-md">
          {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
        </div>
      </div>

      <div v-if="showSeparator" slot="separator" class="flex justify-center">
        <q-btn
          color="primary"
          unelevated
          class="q-px-sm"
          icon="drag_indicator"
          @click="separatorLog"
        />
        <q-splitter
          v-model="innerSeparatorSplitModel"
          vertical
          :disable="disable"
          separator-class="bg-deep-orange"
          class="bg-white rounded-borders"
          style="width: 50vw; height: 30vh"
        >
          <div slot="before" class="q-layout-padding">
            <div v-for="n in 20" :key="n" class="q-my-md">
              {{ n }}. Lorem ipsum dolor sit.
            </div>
          </div>

          <div slot="after" class="q-layout-padding">
            <div v-for="n in 20" :key="n" class="q-my-md">
              {{ n }}. Lorem ipsum dolor sit.
            </div>
          </div>
        </q-splitter>
      </div>

      <q-splitter
        slot="after"
        v-model="insideModel"
        horizontal
        :disable="disable"
        separator-class="bg-deep-orange"
      >
        <div slot="before" class="q-layout-padding">
          <div class="text-h1 q-mb-md">
            After - Before
          </div>
          <div v-for="n in 20" :key="n" class="q-my-md">
            {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
          </div>
        </div>

        <q-btn
          v-if="showSeparator"
          color="primary"
          unelevated
          class="q-px-sm test-separator"
          slot="separator"
          icon="touch_app"
          @click="separatorLog"
        />

        <div slot="after" class="q-layout-padding">
          <div class="text-h1 q-mb-md">
            After - After
          </div>
          <div v-for="n in 20" :key="n" class="q-my-md">
            {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
          </div>
        </div>
      </q-splitter>
    </q-splitter>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 50,
      insideModel: 50,
      innerSeparatorSplitModel: 50,
      horizontal: false,
      modelReverse: false,
      modelPixels: false,
      funkyLimits: false,
      disable: false,
      showSeparator: true
    }
  },

  computed: {
    limits () {
      if (this.modelPixels === true) {
        return this.funkyLimits === true ? [100, 500] : [0, Infinity]
      }

      return this.funkyLimits === true ? [0, 30] : [10, 90]
    }
  },

  methods: {
    separatorLog (e) {
      this.$q.notify('Clicked on separator')
      console.log('separatorLog', e)
    }
  }
}
</script>

<style lang="stylus">
.stylish-splitter
  border 3px solid $deep-orange
  height 700px
.test-separator
  position absolute
  left auto
  right 0
</style>
