<template>
  <div>
    <div class="layout-padding">
      <p class="caption">With Radios</p>
      <q-dialog-select @change="onChange" @input="onInput" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Radios" />
      <p class="caption">With Checkboxes</p>
      <q-dialog-select @change="onChange" @input="onInput" multiple v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Checkboxes" />
      <p class="caption">With Toggles</p>
      <q-dialog-select toggle multiple v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Toggles" />

      <p class="caption">With Label</p>
      <q-dialog-select multiple v-model="multipleSelect" :options="selectOptions" label="Pick Company" />

      <p class="caption">With Float Label</p>
      <q-dialog-select float-label="Float Label" multiple v-model="multipleSelect" :options="selectOptions" placeholder="Pick Company" />

      <p class="caption">With Stack Label</p>
      <q-dialog-select stack-label="Stack Label" v-model="select" :options="selectOptions" static-label="Company" />

      <p class="caption">With Chips</p>
      <q-dialog-select @change="onChange" @input="onInput" chips float-label="Float Label" multiple v-model="multipleSelect" :options="selectOptions" placeholder="Pick Company" />

      <p class="caption">Disabled State</p>
      <q-dialog-select disable v-model="select" :options="selectOptions" />

      <p class="caption">Error State</p>
      <q-dialog-select error v-model="select" :options="selectOptions" />

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-list-header>Single Selection</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-dialog-select class="no-margin" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-dialog-select class="no-margin" v-model="select" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Company" />
          </q-item-main>
        </q-item>
        <q-item-separator />
        <q-list-header>Multiple Selection</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-dialog-select class="no-margin" multiple v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-dialog-select class="no-margin" toggle multiple v-model="multipleSelect" :options="selectOptions" ok-label="Pick" title="Companies" />
          </q-item-main>
        </q-item>
      </q-list>

      <p class="caption">Display Value</p>
      <q-dialog-select multiple v-model="multipleSelect" :options="selectOptions" float-label="Gigi" ok-label="Pick" cancel-label="Neah" title="Checkboxes" :display-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`" />
      <q-dialog-select toggle multiple v-model="multipleSelect" :options="selectOptions" ok-label="Pick" cancel-label="Neah" title="Toggles" :display-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`" />
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
          value: 'twtr',
          disable: true
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
  watch: {
    select (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    multipleSelect (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
