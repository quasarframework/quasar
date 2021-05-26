<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-dialog v-model="dlg">
      <q-card>
        <q-stepper v-model="stepNum"
          vertical
          header-nav
        >
          <q-step v-for="(step, index) in steps" :key="index"
            :name="index"
            :title="step.title"
          >
            <!-- <div>gigi</div>
            <q-toggle v-model="tog" label="Toggle me" /> -->
            <q-input v-model="text" autofocus />
          </q-step>
        </q-stepper>
      </q-card>
    </q-dialog>

    <q-btn label="Show Popup" @click="dlg = true" />
  </div>
</template>

<script>
/* eslint-disable */
import { h, ref, computed, watch, nextTick, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue'

export default {
  setup () {
    return {
      text: ref(''),
      tog: ref(false),
      dlg: ref(false),
      stepNum: ref(0),
      steps: [{
        title: 'Step 1',
      }, {
        title: 'Step 2',
      }, {
        title: 'Step 3',
      }, {
        title: 'Step 4',
      }, {
        title: 'Step 5',
      // }, {
      //   title: 'Step 6',
      }]
    }
  }
}
</script>

<style lang="sass">
</style>
