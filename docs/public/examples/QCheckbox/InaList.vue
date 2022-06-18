<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
    <q-list>
      <!--
        Rendering a <label> tag (notice tag="label")
        so QCheckboxes will respond to clicks on QItems to
        change Toggle state.
      -->

      <q-item tag="label" v-ripple>
        <q-item-section avatar>
          <q-checkbox v-model="color" val="teal" color="teal" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Teal</q-item-label>
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section avatar>
          <q-checkbox v-model="color" val="orange" color="orange" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Orange</q-item-label>
          <q-item-label caption>With description</q-item-label>
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section avatar top>
          <q-checkbox v-model="color" val="cyan" color="cyan" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cyan</q-item-label>
          <q-item-label caption>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    </div>

    <div class="q-px-sm q-mt-sm">
      Your selection is: <strong>{{ color }}</strong>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      color: ref(['cyan'])
    }
  }
}
</script>
