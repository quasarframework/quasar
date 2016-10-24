<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{option}}</em></span>
      </div>

      <p class="caption">Standalone</p>
      <div class="column group">
        <label>
          <quasar-radio v-model="option" val="opt1"></quasar-radio>
          Option 1
        </label>
        <label>
          <quasar-radio v-model="option" val="opt2" class="teal"></quasar-radio>
          Option 2
        </label>
        <label>
          <quasar-radio v-model="option" val="opt3" class="orange"></quasar-radio>
          Option 3
        </label>
      </div>

      <p class="caption">Disabled State</p>
      <label>
        <quasar-radio v-model="option" val="opt1" disable></quasar-radio>
        Option 1
      </label>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <label class="item">
          <div class="item-primary">
            <quasar-radio v-model="option" val="opt1"></quasar-radio>
          </div>
          <div class="item-content">
            Option 1
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-primary">
            <quasar-radio v-model="option" val="opt2"></quasar-radio>
          </div>
          <div class="item-content">
            <div>Option 2</div>
            <div>Allows notifications</div>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-primary">
            <quasar-radio v-model="option" val="opt3"></quasar-radio>
          </div>
          <div class="item-content">
            <div>Option 3</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      option: 'opt1'
    }
  }
}
</script>

<style>
</style>
