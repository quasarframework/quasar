<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{checked}}</em></span>
      </div>

      <p class="caption">Standalone</p>
      <div class="column group">
        <q-checkbox v-model="checked" style="margin-bottom: 15px"></q-checkbox>
        <label>
          <q-checkbox v-model="checked"></q-checkbox>
          Checkbox Label
        </label>

        <label>
          <q-checkbox v-model="checked" class="teal"></q-checkbox>
          Checkbox Label
        </label>

        <label>
          <q-checkbox v-model="checked" class="orange"></q-checkbox>
          Checkbox Label
        </label>

        <label>
          <q-checkbox v-model="checked" class="dark"></q-checkbox>
          Checkbox Label
        </label>
      </div>

      <p class="caption">Array Model</p>
      <div class="column group">
        <div class="label bg-secondary text-white">
          Model <span class="right-detail"><em>{{selection}}</em></span>
        </div>

        <label>
          <q-checkbox v-model="selection" val="one"></q-checkbox>
          One
        </label>
        <label>
          <q-checkbox v-model="selection" val="two"></q-checkbox>
          Two
        </label>
        <label>
          <q-checkbox v-model="selection" val="three"></q-checkbox>
          Three
        </label>
      </div>

      <p class="caption">Disabled State</p>
      <label>
        <q-checkbox v-model="checked" disable></q-checkbox>
        Checkbox Label
      </label>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-input-group
          inline
          type="checkbox"
          color="secondary"
          v-model="group"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3' },
            { label: 'Option 4', value: 'op4' }
          ]"
        />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-input-group
          type="checkbox"
          v-model="group"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3' },
            { label: 'Option 4', value: 'op4' }
          ]"
        />
      </q-field>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <label class="item">
          <div class="item-primary">
            <q-checkbox v-model="checked"></q-checkbox>
          </div>
          <div class="item-content">
            Notifications
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-primary">
            <q-checkbox v-model="checked"></q-checkbox>
          </div>
          <div class="item-content">
            <div>Notifications</div>
            <div>Allow notifications</div>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-primary">
            <q-checkbox v-model="checked"></q-checkbox>
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
      checked: true,
      group: ['op2'],
      selection: ['one', 'two', 'three']
    }
  }
}
</script>
