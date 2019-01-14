<template>
  <div>
    <div class="q-pa-sm">
      <q-list link>
        <!--
          Rendering a <label> tag (notice tag="label")
          so the whole QItem will respond to clicks to
          change Toggle state.
        -->
        <q-item tag="label">
          <q-item-section side>
            <q-radio v-model="color" val="teal" color="teal" ></q-radio>
          </q-item-section>
          <q-item-section>
            <q-item-label>Teal</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section side>
            <q-radio v-model="color" val="orange" color="orange" ></q-radio>
          </q-item-section>
          <q-item-section>
            <q-item-label>Orange</q-item-label>
            <q-item-label caption>With description </q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section side>
            <q-radio v-model="color" val="blue-grey" color="blue-grey" ></q-radio>
          </q-item-section>
          <q-item-section>
            <q-item-label>Blue Grey</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section side>
            <q-radio v-model="color" val="cyan" color="cyan" ></q-radio>
          </q-item-section>
          <q-item-section>
            <q-item-label>Cyan</q-item-label>
            <q-item-label caption>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="q-px-sm">
      Your selection is: <strong>{{ color }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QRadioList',

  data () {
    return {
      color: 'cyan'
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-radio
  margin 5px
</style>
