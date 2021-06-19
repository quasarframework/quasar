<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        Click or tap below, to see the innerLoading component work with a div.
        It is simulating a delay from a server reply.
      </p>
      <q-btn color="primary" @click="showTextLoading()">
        Show Text Loading
      </q-btn>
    </div>
    <div class="q-layout-padding relative-position q-mx-auto"
         style="height: 450px; width: 600px; background-color: lightgrey; padding: 15px;"
    >
      <transition name="q-transition--fade">
        <div v-show="showSimulatedReturnData">
          <h4>Lorem Ipsum</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel magna eu risus laoreet tristique. Nulla ut fermentum elit, nec consequat augue. Morbi et dolor nec metus tincidunt pellentesque. Nullam non semper ante. Fusce pellentesque sagittis felis quis porta. Aenean condimentum neque sed erat suscipit malesuada. Nulla eget rhoncus enim. Duis dictum interdum eros.
          </p>
          <p>
            Duis bibendum mi nec lacus cursus fermentum. Ut elit odio, iaculis nec rutrum sollicitudin, sodales non neque. Nulla sit amet ex dui. Pellentesque nec feugiat magna. Aenean tempus mattis consectetur. Nam fermentum velit mi, nec aliquet lorem dictum in. Nulla placerat elit rhoncus condimentum accumsan. Integer sit amet metus sit amet metus commodo bibendum non vel mauris. Morbi ligula augue, tincidunt eget sagittis vitae, consectetur in quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis elit id mauris porttitor tincidunt.
          </p>
        </div>
      </transition>

      <q-inner-loading :showing="showing" transition-duration="1000">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import { QSpinnerGears } from 'quasar'
export default {
  data () {
    return {
      showing: false,
      showSimulatedReturnData: false
    }
  },
  components: {
    QSpinnerGears
  },
  methods: {
    showTextLoading () {
      this.show()
    },
    show () {
      this.showing = true
      this.showSimulatedReturnData = false

      setTimeout(() => {
        this.showing = false
        this.showSimulatedReturnData = true
      }, 5000)
    }
  }
}
</script>
