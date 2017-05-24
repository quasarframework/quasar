<template>
  <div>
    <div class="layout-padding">
      <p class="caption">With Radios</p>
      <q-dialog-select type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Radios"></q-dialog-select>
      <p class="caption">With Checkboxes</p>
      <q-dialog-select type="checkbox" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Checkboxes"></q-dialog-select>
      <p class="caption">With Toggles</p>
      <q-dialog-select type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Toggles"></q-dialog-select>

      <p class="caption">With Label</p>
      <q-dialog-select type="checkbox" v-model="multipleSelect" :options="selectOptions" label="Pick Company"></q-dialog-select>

      <p class="caption">With Float Label</p>
      <q-dialog-select float-label="Float Label" type="checkbox" v-model="multipleSelect" :options="selectOptions" placeholder="Pick Company"></q-dialog-select>

      <p class="caption">With Stack Label</p>
      <q-dialog-select stack-label="Stack Label" type="radio" v-model="select" :options="selectOptions" static-label="Company"></q-dialog-select>

      <p class="caption">With Chips</p>
      <q-dialog-select chips float-label="Float Label" type="checkbox" v-model="multipleSelect" :options="selectOptions" placeholder="Pick Company"></q-dialog-select>

      <p class="caption">Disabled State</p>
      <q-dialog-select disable type="radio" v-model="select" :options="selectOptions"></q-dialog-select>

      <p class="caption">Error State</p>
      <q-dialog-select error type="radio" v-model="select" :options="selectOptions"></q-dialog-select>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="list-label">Single Selection</div>
        <div class="item two-lines">
          <div class="item-primary"><q-icon name="supervisor_account" /></div>
          <div class="item-content row items-center">
            <label style="margin-right: 10px;">Radio:</label>
            <br>
            <q-dialog-select class="auto" type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></q-dialog-select>
          </div>
        </div>
        <div class="item two-lines">
          <div class="item-primary"><q-icon name="supervisor_account" /></div>
          <div class="item-content row items-center">
            <label style="margin-right: 10px;">Radio:</label>
            <q-dialog-select class="auto" type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company"></q-dialog-select>
          </div>
        </div>
        <hr>
        <div class="list-label">Multiple Selection</div>
        <div class="item two-lines">
          <div class="item-primary"><q-icon name="supervisor_account" /></div>
          <div class="item-content row items-center">
            <label style="margin-right: 10px;">Checkbox:</label>
            <q-dialog-select class="auto" type="checkbox" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></q-dialog-select>
          </div>
        </div>
        <div class="item two-lines">
          <div class="item-primary"><q-icon name="supervisor_account" /></div>
          <div class="item-content row items-center">
            <label style="margin-right: 10px;">Toggle:</label>
            <q-dialog-select class="auto" type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies"></q-dialog-select>
          </div>
        </div>
      </div>

      <p class="caption">Custom Value</p>
      <q-dialog-select type="checkbox" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Checkboxes" :custom-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`"></q-dialog-select>
      <q-dialog-select type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Toggles" :custom-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`"></q-dialog-select>
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
