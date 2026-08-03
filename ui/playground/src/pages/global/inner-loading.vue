<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        Click or tap below, to see the innerLoading component work with a div.
        It is simulating a delay from a server reply.
      </p>
      <q-btn color="primary" @click="showTextLoading"> Show 1 </q-btn>

      <q-btn color="primary" @click="showTextLoading2" class="q-ml-md">
        Show 2
      </q-btn>
    </div>
    <div
      class="q-layout-padding relative-position q-mx-auto"
      style="
        height: 450px;
        width: 600px;
        background-color: lightgrey;
        padding: 15px;
      "
    >
      <transition name="q-transition--fade">
        <div v-show="showSimulatedReturnData">
          <h4>Lorem Ipsum</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            vel magna eu risus laoreet tristique. Nulla ut fermentum elit, nec
            consequat augue. Morbi et dolor nec metus tincidunt pellentesque.
            Nullam non semper ante. Fusce pellentesque sagittis felis quis
            porta. Aenean condimentum neque sed erat suscipit malesuada. Nulla
            eget rhoncus enim. Duis dictum interdum eros.
          </p>
          <p>
            Duis bibendum mi nec lacus cursus fermentum. Ut elit odio, iaculis
            nec rutrum sollicitudin, sodales non neque. Nulla sit amet ex dui.
            Pellentesque nec feugiat magna. Aenean tempus mattis consectetur.
            Nam fermentum velit mi, nec aliquet lorem dictum in. Nulla placerat
            elit rhoncus condimentum accumsan. Integer sit amet metus sit amet
            metus commodo bibendum non vel mauris. Morbi ligula augue, tincidunt
            eget sagittis vitae, consectetur in quam. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Sed facilisis elit id mauris
            porttitor tincidunt.
          </p>
        </div>
      </transition>

      <q-inner-loading :showing="showing" transition-duration="1000">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>

      <q-inner-loading :showing="showing2" label="My label" />
    </div>
  </div>
</template>

<script setup>
import { QSpinnerGears } from 'quasar'
import { ref } from 'vue'

const showing = ref(false)
const showing2 = ref(false)
const showSimulatedReturnData = ref(false)

function showTextLoading() {
  show()
}
function show() {
  showing.value = true
  showSimulatedReturnData.value = false

  setTimeout(() => {
    showing.value = false
    showSimulatedReturnData.value = true
  }, 5000)
}
function showTextLoading2() {
  showing2.value = true
}
</script>
