<template>
  <div>
    <div class="layout-padding">
      <div>
        <div class="light-paragraph">
          Size: {{ size }}px
        </div>
        <div>
          <q-range label v-model="size" :min="20" :max="256"></q-range>
        </div>

        <q-icon class="text-grey-7" style="font-size: 2rem" name="palette" />
        <label for="color-spinner" class="auto">Color</label>
        <q-input id="color-spinner" class="inline" v-model="color" style="width: 80px; text-align: center; margin-right: 10px;" />
        <q-dialog-select
          type="radio"
          v-model="color"
          class="inline"
          :options="colorOptions"
          ok-label="Pick"
          title="Spinner Color"
          style="vertical-align: middle"
        ></q-dialog-select>
      </div>

      <p class="caption">
        Hover over them to see their names
      </p>

      <div style="margin-top: 20px" class="group" :style="{color: color}">
        <div v-for="spinner in spinners" class="inline-block">
          <spinner
            :name="spinner"
            :size="size"
          ></spinner>
          <q-tooltip>{{spinner}}</q-tooltip>
        </div>
      </div>

      <p class="caption" :style="{color: color}">
        Default Theme Spinner:
        <spinner :size="size" style="margin-left: 1rem;"></spinner>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      size: 36,
      color: '#00ff00',
      spinners: [
        'audio', 'ball', 'bars', 'circles', 'dots',
        'facebook', 'gears', 'grid', 'hearts',
        'hourglass', 'infinity', 'ios', 'oval',
        'pie', 'puff', 'radio', 'rings', 'tail'
      ],
      colorOptions: [
        {
          label: 'Black',
          value: '#000000'
        },
        {
          label: 'Red',
          value: '#ff0000'
        },
        {
          label: 'Green',
          value: '#00ff00'
        },
        {
          label: 'Blue',
          value: '#0000ff'
        }
      ]
    }
  }
}
</script>
