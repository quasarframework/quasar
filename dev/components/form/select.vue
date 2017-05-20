<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Single Selection</p>
      <q-select v-model="select" :options="selectOptions" @input="inputChange"></q-select>
      <q-select v-model="select" :options="selectOptions" delimiter></q-select>
      <q-select v-model="select" :options="selectListOptions"></q-select>

      <p class="caption">Single Selection with Radio</p>
      <q-field label="gogu">
        <q-select v-model="select" float-label="Gogu" radio :options="selectListOptions" :count="10"></q-select>
      </q-field>

      <p class="caption">Multiple Selection</p>
      <q-select multiple v-model="multipleSelect" :options="selectListOptions"></q-select>

      <p class="caption">Multiple Selection with Chips</p>
      <q-field label="gogu" :count="10">
        <q-select multiple chips v-model="multipleSelect" :options="selectListOptions" float-label="Some label" max-height="36px"></q-select>
      </q-field>

      <p class="caption">Multiple Selection with Checkboxes</p>
      <q-select multiple checkbox v-model="multipleSelect" :options="selectListOptions" @input="inputChange"></q-select>

      <p class="caption">Multiple Selection with Toggle</p>
      <q-select multiple toggle v-model="multipleSelect" :options="selectListOptions"></q-select>

      <p class="caption">Simple</p>
      <q-select simple v-model="select" :options="selectOptions"></q-select>

      <p class="caption">With Label</p>
      <q-select multiple v-model="multipleSelect" :options="selectOptions" label="Pick Company"></q-select>

      <p class="caption">With Placeholder</p>
      <q-select multiple v-model="multipleSelect" :options="selectOptions" placeholder="Pick Company"></q-select>

      <p class="caption">With Filter</p>
      <q-select filter v-model="select" :options="selectListOptions"></q-select>
      <q-select filter multiple checkbox v-model="multipleSelect" :options="selectListOptions"></q-select>

      <p class="caption">With Static Label</p>
      <q-select multiple v-model="multipleSelect" :options="selectOptions" static-label="Company"></q-select>

      <p class="caption">Disabled State</p>
      <q-select disable float-label="Disabled Select" multiple v-model="multipleSelect" :options="selectOptions"></q-select>

      <p class="caption">Error State</p>
      <q-select error multiple v-model="multipleSelect" :options="selectOptions"></q-select>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="list-label">Single Selection</div>
        <div class="item">
          <div class="item-primary"><q-icon name="supervisor_account" /></div>
          <div class="item-content">
            <q-select
              class="full-width"
              v-model="select"
              :options="selectOptions"
            ></q-select>
          </div>
        </div>
        <hr>
        <div class="list-label">Multiple Selection</div>
        <div class="item">
          <div class="item-primary"><q-icon name="supervisor_account" /></div>
          <div class="item-content">
            <q-select
              multiple
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
      ],
      selectListOptions: [
        {
          label: 'Google',
          icon: 'email',
          value: 'goog'
        },
        {
          label: 'Facebook',
          description: 'Enables communication',
          value: 'fb'
        },
        {
          label: 'Twitter',
          secondIcon: 'alarm',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          stamp: '10 min',
          value: 'appl'
        },
        {
          label: 'Oracle',
          description: 'Some Java for today?',
          icon: 'mail',
          secondIcon: 'alarm',
          value: 'ora'
        }
      ]
    }
  },
  methods: {
    inputChange (inp) {
      console.log(inp)
    }
  }
}
</script>
