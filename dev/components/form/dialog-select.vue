<template>
  <div>
    <div class="layout-padding">
      <p class="caption">With Radios</p>
      <q-dialog-select @change="onChange" type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Radios"></q-dialog-select>
      <p class="caption">With Checkboxes</p>
      <q-dialog-select @change="onChange" type="checkbox" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Checkboxes"></q-dialog-select>
      <p class="caption">With Toggles</p>
      <q-dialog-select type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Toggles"></q-dialog-select>

      <p class="caption">With Label</p>
      <q-dialog-select type="checkbox" v-model="multipleSelect" :options="selectOptions" label="Pick Company"></q-dialog-select>

      <p class="caption">With Float Label</p>
      <q-dialog-select float-label="Float Label" type="checkbox" v-model="multipleSelect" :options="selectOptions" placeholder="Pick Company"></q-dialog-select>

      <p class="caption">With Stack Label</p>
      <q-dialog-select stack-label="Stack Label" type="radio" v-model="select" :options="selectOptions" static-label="Company"></q-dialog-select>

      <p class="caption">With Chips</p>
      <q-dialog-select @change="onChange" chips float-label="Float Label" type="checkbox" v-model="multipleSelect" :options="selectOptions" placeholder="Pick Company"></q-dialog-select>

      <p class="caption">Disabled State</p>
      <q-dialog-select disable type="radio" v-model="select" :options="selectOptions"></q-dialog-select>

      <p class="caption">Error State</p>
      <q-dialog-select error type="radio" v-model="select" :options="selectOptions"></q-dialog-select>

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-list-header>Single Selection</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-dialog-select class="no-margin" type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-dialog-select class="no-margin" type="radio" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company" />
          </q-item-main>
        </q-item>
        <q-item-delimiter />
        <q-list-header>Multiple Selection</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-dialog-select class="no-margin" type="checkbox" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-dialog-select class="no-margin" type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies" />
          </q-item-main>
        </q-item>
      </q-list>

      <p class="caption">Display Value</p>
      <q-dialog-select type="checkbox" v-model="multipleSelect" :options="selectOptions" float-label="Gigi" ok-label="Pick" cancel-label="Neah" title="Checkboxes" :display-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`"></q-dialog-select>
      <q-dialog-select type="toggle" v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Toggles" :display-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`"></q-dialog-select>
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
  },
  methods: {
    onChange (val) {
      console.log('@change', val)
    }
  }
}
</script>
