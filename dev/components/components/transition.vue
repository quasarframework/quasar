<template>
  <div class="layout-padding" style="max-width: 600px;">
    <div class="card" style="margin-top: 25px">
      <div class="card-title bg-primary text-center">
        <q-btn class="orange push" @click="show = !show">Toggle</q-btn>
      </div>

      <div class="card-content group column">
        <div class="auto column items-center">
          <div class="flex">
            <q-input float-label="Enter Class" v-model="enter" />
            <q-input float-label="Leave Class" v-model="leave" />
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: 25px">
      <div class="card-title text-center">
        Single
      </div>
      <div class="card-content overflow-hidden">
        <q-transition
          :enter="enter"
          :leave="leave"
          :disable="disable"
        >
          <div v-if="show" v-html="loremipsum"></div>
        </q-transition>
      </div>
    </div>

    <div class="card" style="margin-top: 25px">
      <div class="card-title text-center">
        Group
      </div>
      <div class="card-content overflow-hidden">
        <q-transition
          group
          appear
          :enter="enter"
          :leave="leave"
          :disable="disable"
          class="group"
        >
          <div
            v-if="show"
            v-for="n in 3"
            :key="n"
            v-html="loremipsum"
          ></div>
        </q-transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      enter: 'bounceInLeft',
      leave: 'bounceOutRight',
      show: true,
      disable: false,
      loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  }
}
</script>
