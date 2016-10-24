<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{checked}}</em></span>
      </div>

      <p class="caption">Standalone</p>
      <div class="column group">
        <label>
          <quasar-checkbox v-model="checked"></quasar-checkbox>
          Checkbox Label
        </label>

        <label>
          <quasar-checkbox v-model="checked" class="teal"></quasar-checkbox>
          Checkbox Label
        </label>

        <label>
          <quasar-checkbox v-model="checked" class="orange"></quasar-checkbox>
          Checkbox Label
        </label>

        <label>
          <quasar-checkbox v-model="checked" class="dark"></quasar-checkbox>
          Checkbox Label
        </label>
      </div>

      <p class="caption">Disabled State</p>
      <label>
        <quasar-checkbox v-model="checked" disable></quasar-checkbox>
        Checkbox Label
      </label>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <label class="item">
          <div class="item-primary">
            <quasar-checkbox v-model="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            Notifications
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-primary">
            <quasar-checkbox v-model="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications</div>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-primary">
            <quasar-checkbox v-model="checked"></quasar-checkbox>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications Allow notifications Allow notifications Allow notifications Allow notifications </div>
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
      checked: true
    }
  }
}
</script>
