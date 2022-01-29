<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <div>
        <q-checkbox v-model="right" label="Label on Right" />
      </div>

      <div>
        <q-checkbox left-label v-model="left" label="Label on Left" />
      </div>

      <div>
        <q-checkbox
          v-model="right2"
          label="Swipe"
          checked-icon="swipe_left"
          unchecked-icon="swipe_right"
          color="green"
          keep-color
        />
      </div>

      <div>
        <q-checkbox
          left-label
          v-model="left2"
          label="I agree"
          checked-icon="task_alt"
          unchecked-icon="highlight_off"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      left: true,
      right: false,
      left2: true,
      right2: false
    }
  }
}
</script>
