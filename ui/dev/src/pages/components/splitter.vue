<template>
  <div class="q-layout-padding q-mx-auto">
    <div class="row q-gutter-sm items-center">
      <q-toggle v-model="horizontal" label="Horizontal" />
      <q-toggle v-model="modelReverse" label="Reverse" />
      <q-select dense filled v-model="modelUnit" :options="[ '%', 'px', 'em' ]" prefix="Unit:" />
      <q-toggle v-model="disable" label="Disable" />
      <q-toggle v-model="funkyLimits" label="Funky limits" />
      <q-toggle v-model="showSeparator" label="Show separator" />
      <q-toggle v-model="emitImmediately" label="Emit immediately" />
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
      :reverse="modelReverse"
      :unit="modelUnit"
      :limits="limits"
      :disable="disable"
      :emit-immediately="emitImmediately"

      class="q-mt-md"
      style="height: 700px; border: 1px solid black"
    >
      <template v-slot:before>
        <div class="q-layout-padding">
          <div class="text-h1 q-mb-md">
            Before
          </div>
          <div v-for="n in 20" :key="n" class="q-my-md">
            {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
          </div>
        </div>
      </template>

      <template v-slot:separator v-if="showSeparator">
        <q-icon
          color="primary"
          size="40px"
          name="drag_indicator"
          @click="separatorLog"
        />
      </template>

      <template v-slot:after>
        <div class="q-layout-padding">
          <div class="text-h1 q-mb-md">
            After
          </div>
          <div v-for="n in 20" :key="n" class="q-my-md">
            {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
          </div>
        </div>
      </template>
    </q-splitter>

    <q-splitter
      v-model="model"
      :reverse="modelReverse"
      :unit="modelUnit"
      :limits="limits"
      :disable="disable"
      :emit-immediately="emitImmediately"

      class="q-mt-md stylish-splitter"
      separator-class="bg-deep-orange"
    >
      <template v-slot:before>
        <div class="q-layout-padding">
          <div class="text-h1 q-mb-md">
            Before
          </div>
          <div v-for="n in 20" :key="n" class="q-my-md">
            {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
          </div>
        </div>
      </template>

      <template v-slot:separator v-if="showSeparator">
        <div class="flex justify-center">
          <q-btn
            color="primary"
            unelevated
            class="q-px-sm"
            icon="drag_indicator"
            @click="separatorLog"
          />
          <q-splitter
            v-model="innerSeparatorSplitModel"
            :reverse="modelReverse"
            vertical
            :disable="disable"
            separator-class="bg-deep-orange"
            class="bg-white rounded-borders"
            style="width: 50vw; height: 30vh"
          >
            <template v-slot:before>
              <div class="q-layout-padding">
                <q-input outline v-model="text" dense />
                <div v-for="n in 20" :key="n" class="q-my-md">
                  {{ n }}. Lorem ipsum dolor sit.
                </div>
              </div>
            </template>

            <template v-slot:after>
              <div class="q-layout-padding">
                <div v-for="n in 20" :key="n" class="q-my-md">
                  {{ n }}. Lorem ipsum dolor sit.
                </div>
              </div>
            </template>
          </q-splitter>
        </div>
      </template>

      <template v-slot:after>
        <q-splitter
          v-model="insideModel"
          :reverse="modelReverse"
          horizontal
          :disable="disable"
          separator-class="bg-deep-orange"
        >
          <template v-slot:before>
            <div class="q-layout-padding">
              <div class="text-h1 q-mb-md">
                After - Before
              </div>
              <q-input outline v-model="text" dense />
              <div v-for="n in 20" :key="n" class="q-my-md">
                {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
              </div>
            </div>
          </template>

          <template v-slot:separator v-if="showSeparator">
            <q-btn
              color="primary"
              unelevated
              class="q-px-sm test-separator"
              icon="touch_app"
              @click="separatorLog"
            />
          </template>

          <template v-slot:after>
            <div class="q-layout-padding">
              <div class="text-h1 q-mb-md">
                After - After
              </div>
              <div v-for="n in 20" :key="n" class="q-my-md">
                {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
              </div>
            </div>
          </template>
        </q-splitter>
      </template>
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
      modelUnit: '%',
      funkyLimits: false,
      disable: false,
      showSeparator: true,
      emitImmediately: false,

      text: ''
    }
  },

  computed: {
    limits () {
      return this.modelUnit === '%'
        ? this.funkyLimits === true ? [ 70, 100 ] : [ 10, 90 ]
        : this.funkyLimits === true ? [ 100, 500 ] : [ 0, Infinity ]
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

<style lang="sass">
.stylish-splitter
  border: 3px solid $deep-orange
  height: 700px
.test-separator
  position: absolute
  left: auto
  right: 0
</style>
