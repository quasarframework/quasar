<template>
  <div>
    <div class="layout-padding">
      <div>
        <div class="light-paragraph">
          Size: {{ size }}px
        </div>
        <div>
          <quasar-range label v-model="size" :min="20" :max="256"></quasar-range>
        </div>

        <i class="text-grey-7" style="font-size: 2rem">palette</i>
        <label for="color-spinner" class="auto">Color</label>
        <input id="color-spinner" v-model="color" style="width: 80px; text-align: center; margin-right: 10px;">
        <quasar-dialog-select
          type="radio"
          v-model="color"
          :options="colorOptions"
          ok-label="Pick"
          title="Spinner Color"
          style="vertical-align: middle"
        ></quasar-select>
      </div>

      <p class="caption">
        Hover over them to see their names
      </p>

      <div style="margin-top: 20px" class="group">
        <div v-for="spinner in spinners" v-tooltip.inline="spinner">
          <spinner
            :name="spinner"
            :color="color"
            :size="size"
          ></spinner>
        </div>
      </div>

      <p class="caption">
        Default Theme Spinner:
        <spinner :color="color" :size="size" style="margin-left: 1rem;"></spinner>
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
