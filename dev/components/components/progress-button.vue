<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Click on Buttons below to see them in action.</p>

      <p class="caption">Determined Progress</p>
      <div class="group">
        <q-progress-btn
          class="yellow"
          :percentage="progressBtn"
          @click.native="workButton()"
          dark-filler
        >
          Work it!
        </q-progress-btn>
        <q-progress-btn
          class="dark"
          :percentage="progressBtn"
          @click.native="workButton()"
        >
          Work it!
        </q-progress-btn>
      </div>

      <p class="caption">Indetermined Progress</p>
      <div class="group">
        <q-progress-btn
          class="primary"
          indeterminate
          :percentage="progressBtn"
          @click.native="workButton()"
        >
          Work it!
        </q-progress-btn>
        <q-progress-btn
          class="negative"
          indeterminate
          :percentage="progressBtn"
          @click.native="workButton()"
        >
          Work it!
        </q-progress-btn>
      </div>

      <p class="caption">Control Progress with Buttons below</p>
      <div class="group">
        <q-btn class="secondary clear" @click="stopWorkButton()">
          Stop
        </q-btn>
        <q-btn class="secondary clear" @click="progressBtn = -1">
          Error
        </q-btn>
        <q-btn class="secondary clear" @click="progressBtn = 100">
          Success
        </q-btn>
        <q-btn class="secondary clear" @click="progressBtn = 0">
          Reset
        </q-btn>
        <div class="label tag bg-light">{{ progressBtn }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      progressBtn: 0
    }
  },
  methods: {
    workButton () {
      this.stopWorkButton()

      this.progressBtn = 15
      this.workingButton = setInterval(() => {
        this.progressBtn += parseInt(Math.random() * 12, 10)
        if (this.progressBtn >= 100) {
          this.stopWorkButton()
        }
      }, 500)
    },
    stopWorkButton () {
      clearInterval(this.workingButton)
      this.workingButton = null
    }
  },
  beforeDestroy () {
    this.stopWorkButton()
  }
}
</script>
