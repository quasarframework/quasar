<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Click or tap below, to see the innerLoading component work with a div.
        It is simulating a delay from a server reply.
      </p>
      <q-btn color="primary" @click="showTextLoading()">
        Show Text Loading
      </q-btn>
    </div>
    <div class="layout-padding relative-position"
      style="height: 450px; width: 600px; background-color: lightgrey; padding: 15px;">
      <q-transition
        appear
        enter="fadeIn"
        leave="fadeOut"
        :disable="false"
      >
        <div v-show="showSimulatedReturnData">
          <h4>Lorem Ipsum</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel magna eu risus laoreet tristique. Nulla ut fermentum elit, nec consequat augue. Morbi et dolor nec metus tincidunt pellentesque. Nullam non semper ante. Fusce pellentesque sagittis felis quis porta. Aenean condimentum neque sed erat suscipit malesuada. Nulla eget rhoncus enim. Duis dictum interdum eros.
          </p>
          <p>
            Duis bibendum mi nec lacus cursus fermentum. Ut elit odio, iaculis nec rutrum sollicitudin, sodales non neque. Nulla sit amet ex dui. Pellentesque nec feugiat magna. Aenean tempus mattis consectetur. Nam fermentum velit mi, nec aliquet lorem dictum in. Nulla placerat elit rhoncus condimentum accumsan. Integer sit amet metus sit amet metus commodo bibendum non vel mauris. Morbi ligula augue, tincidunt eget sagittis vitae, consectetur in quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis elit id mauris porttitor tincidunt.
          </p>
        </div>
      </q-transition>
      <q-inner-loading :visible="visible">
        <q-spinner-gears :size="50" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import { QSpinnerGears } from 'quasar'
export default {
  data () {
    return {
      visible: false,
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
      this.visible = true
      this.showSimulatedReturnData = false

      setTimeout(() => {
        this.visible = false
        this.showSimulatedReturnData = true
      }, 3000)
    }
  }
}
</script>
