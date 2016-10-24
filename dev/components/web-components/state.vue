<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Switch between two views easily with State component.
      </p>
      <p class="caption">
        In the example below, the first state displays a button and
        the second one displays an hourglass animated icon along with
        a text.
      </p>

      <div class="row justify-center" style="margin-top: 20px;">
        <quasar-state :active="state">
          <div slot="active">
            <spinner name="hourglass" :size="40" color="#90caf9"></spinner>
            &nbsp;&nbsp;&nbsp;Active State
          </div>

          <button class="primary" @click="changeState()">
            Default State - Hit me!
          </button>
        </quasar-state>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      state: false
    }
  },
  methods: {
    changeState () {
      this.state = true
      setTimeout(() => {
        this.state = false
      }, 2000)
    }
  }
}
</script>
