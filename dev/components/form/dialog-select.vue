<template>
  <div>
    <div class="layout-padding">
      <p class="caption">With Radios</p>
      <quasar-dialog-select type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Radios"></quasar-dialog-select>
      <p class="caption">With Checkboxes</p>
      <quasar-dialog-select type="checkbox" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Checkboxes"></quasar-dialog-select>
      <p class="caption">With Toggles</p>
      <quasar-dialog-select type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Toggles"></quasar-dialog-select>

      <p class="caption">With Placeholder</p>
      <quasar-dialog-select type="radio" v-model="select" :options="selectOptions" placeholder="Pick Company"></quasar-dialog-select>

      <p class="caption">Disabled State</p>
      <quasar-dialog-select disable type="radio" v-model="select" :options="selectOptions"></quasar-dialog-select>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="list-label">Single Selection</div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <label style="margin-right: 10px;">Radio:</label>
            <br>
            <quasar-dialog-select class="auto" type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></quasar-dialog-select>
          </div>
        </div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <label style="margin-right: 10px;">Radio:</label>
            <quasar-dialog-select class="auto" type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></quasar-dialog-select>
          </div>
        </div>
        <hr>
        <div class="list-label">Multiple Selection</div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <label style="margin-right: 10px;">Checkbox:</label>
            <quasar-dialog-select class="auto" type="checkbox" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-dialog-select>
          </div>
        </div>
        <div class="item multiple-lines">
          <i class="item-primary">supervisor_account</i>
          <div class="item-content row items-baseline">
            <label style="margin-right: 10px;">Toggle:</label>
            <quasar-dialog-select class="auto" type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></quasar-dialog-select>
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
