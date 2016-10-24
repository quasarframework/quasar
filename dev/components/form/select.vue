<template>
  <div>
    <div class="layout-padding">
      <p class="caption">With Radios</p>
      <quasar-select type="radio" v-model="select" :options="selectOptions"></quasar-select>
      <p class="caption">With Checkboxes</p>
      <quasar-select type="checkbox" v-model="multipleSelect" :options="selectOptions"></quasar-select>
      <p class="caption">With Toggles</p>
      <quasar-select type="toggle" v-model="multipleSelect" :options="selectOptions"></quasar-select>

      <p class="caption">With Placeholder</p>
      <quasar-select type="radio" v-model="select" :options="selectOptions" :placeholder="'Pick Company'"></quasar-select>

      <p class="caption">Disabled State</p>
      <quasar-select disable type="radio" v-model="select" :options="selectOptions"></quasar-select>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="list-label">Single Selection</div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <quasar-select
              class="full-width"
              type="radio"
              v-model="select"
              :options="selectOptions"
            ></quasar-select>
          </div>
        </div>
        <hr>
        <div class="list-label">Multiple Selection</div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <quasar-select
              class="full-width"
              type="checkbox"
              v-model="multipleSelect"
              :options="selectOptions"
            ></quasar-select>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <quasar-select
              class="full-width"
              type="toggle"
              v-model="multipleSelect"
              :options="selectOptions"
            ></quasar-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      select: 'fb',
      multipleSelect: ['goog', 'twtr'],
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        },
        {
          label: 'Twitter',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          value: 'appl'
        },
        {
          label: 'Oracle',
          value: 'ora'
        }
      ]
    }
  }
}
</script>
