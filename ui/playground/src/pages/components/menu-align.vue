<template>
  <div class="q-layout-padding q-pa-xl q-ma-xl">
    <div class="bg-red position-relative" style="width: 507px; height: 150px;">
      <div class="row">
        <q-btn color="black" class="col-auto q-ml-auto no-border-radius" label="Button">
          <q-menu :model-value="true" persistent class="bg-grey-9 text-white q-pa-md" anchor="bottom right" self="top right" square>
            Menu item
          </q-menu>
        </q-btn>
      </div>
    </div>

    <div>
      <div class="row items-center q-mb-sm">
        <div> Anchor Origin</div>
        <q-option-group
          v-model="anchorOrigin"
          :options="options"
          color="primary"
          inline
        />
      </div>

      <div class="row items-center q-mb-sm">
        <div> Self Origin</div>
        <q-option-group
          v-model="selfOrigin"
          :options="options"
          color="primary"
          inline
        />
      </div>
    </div>

    <div
      v-for="(color, index) in ['red', 'green', 'blue', 'purple', 'red', 'green', 'blue', 'purple']"
      :key="index"
      class="position-relative"
      :class="`bg-${color}`"
      :style="`width: ${505 + index}px; height: 100px;`"
    >
      <div class="row justify-around">
        <q-btn color="black" class="col-auto no-border-radius" :label="`Button ${index} L`">
          <q-menu :model-value="true" persistent class="bg-grey-9 text-white q-pa-md" square :anchor="`center ${anchorOrigin}`" :self="`top ${selfOrigin}`">
            Menu item {{ index }} L
          </q-menu>
        </q-btn>

        <q-btn color="black" class="col-auto no-border-radius" :label="`Button ${index} R`">
          <q-menu :model-value="true" persistent class="bg-grey-9 text-white q-pa-md" square :anchor="`center ${anchorOrigin}`" :self="`top ${selfOrigin}`">
            Menu item {{ index }} R
          </q-menu>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      anchorOrigin: 'left',
      selfOrigin: 'left',
      options: [
        {
          label: 'Left',
          value: 'left'
        },
        {
          label: 'Middle',
          value: 'middle'
        },
        {
          label: 'Right',
          value: 'right'
        },
        {
          label: 'Start (left on LTR / right on RTL)',
          value: 'start'
        },
        {
          label: 'End (right on LTR / left on RTL)',
          value: 'end'
        }
      ]
    }
  }
}
</script>
