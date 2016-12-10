<template>
  <div>
    <div class="layout-padding">
      <p class="caption">With Radios</p>
      <q-select type="radio" v-model="select" :options="selectOptions"></q-select>
      <p class="caption">With Checkboxes</p>
      <q-select type="checkbox" v-model="multipleSelect" :options="selectOptions"></q-select>
      <p class="caption">With Toggles</p>
      <q-select type="toggle" v-model="multipleSelect" :options="selectOptions"></q-select>

      <p class="caption">With Label</p>
      <q-select type="checkbox" v-model="multipleSelect" :options="selectOptions" label="Pick Company"></q-select>

      <p class="caption">With Placeholder</p>
      <q-select type="checkbox" v-model="multipleSelect" :options="selectOptions" placeholder="Pick Company"></q-select>

      <p class="caption">With Static Label</p>
      <q-select type="checkbox" v-model="multipleSelect" :options="selectOptions" static-label="Company"></q-select>

      <p class="caption">Disabled State</p>
      <q-select disable type="radio" v-model="select" :options="selectOptions"></q-select>

      <p class="caption">Readonly State</p>
      <q-select readonly type="radio" v-model="select" :options="selectOptions"></q-select>

      <p class="caption">Error State</p>
      <q-select class="has-error" type="radio" v-model="select" :options="selectOptions"></q-select>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="list-label">Single Selection</div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <q-select
              class="full-width"
              type="radio"
              v-model="select"
              :options="selectOptions"
            ></q-select>
          </div>
        </div>
        <hr>
        <div class="list-label">Multiple Selection</div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <q-select
              class="full-width"
              type="checkbox"
              v-model="multipleSelect"
              :options="selectOptions"
            ></q-select>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content">
            <q-select
              class="full-width"
              type="toggle"
              v-model="multipleSelect"
              :options="selectOptions"
            ></q-select>
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
