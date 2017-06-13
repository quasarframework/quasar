<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Single Selection</p>
      <q-select v-model="select" :options="selectOptions" @input="inputChange"></q-select>
      <q-select v-model="select" :options="selectOptions" delimiter></q-select>
      <q-select v-model="select" :options="selectListOptions"></q-select>

      <p class="caption">Coloring</p>
      <q-select color="amber" v-model="select" :options="selectListOptions"></q-select>
      <q-select inverted color="secondary" v-model="select" :options="selectListOptions"></q-select>
      <q-select inverted float-label="Float Label" color="amber" v-model="select" :options="selectListOptions"></q-select>

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
      <q-field label="gogu" :count="10">
        <q-select multiple v-model="multipleSelect" :options="selectListOptions" float-label="Some label" max-height="36px"></q-select>
      </q-field>
      <q-select inverted color="dark" bg-color="amber" multiple chips v-model="multipleSelect" :options="selectListOptions" float-label="Some label" max-height="36px"></q-select>

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
      <q-select filter v-model="select" :options="selectLongListOptions"></q-select>
      <q-select filter inverted v-model="select" :options="selectListOptions"></q-select>
      <q-select filter inverted v-model="select" :options="selectLongListOptions"></q-select>
      <q-select filter multiple checkbox v-model="multipleSelect" :options="selectListOptions"></q-select>

      <p class="caption">With Static Label</p>
      <q-select multiple v-model="multipleSelect" :options="selectOptions" static-label="Company"></q-select>

      <p class="caption">Disabled State</p>
      <q-select disable float-label="Disabled Select" multiple v-model="multipleSelect" :options="selectOptions"></q-select>

      <p class="caption">Error State</p>
      <q-select error multiple v-model="multipleSelect" :options="selectOptions"></q-select>

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-list-header>Single Selection</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-select
              class="no-margin"
              v-model="select"
              :options="selectOptions"
            />
          </q-item-main>
        </q-item>
        <q-item-delimiter />
        <q-list-header>Multiple Selection</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-select
              multiple
              class="no-margin"
              v-model="multipleSelect"
              :options="selectOptions"
            />
          </q-item-main>
        </q-item>
      </q-list>


      <p class="caption">Scroll into View</p>
      <q-select v-model="select" :options="selectLongListOptions"></q-select>
      <q-select multiple v-model="multipleSelect" :options="selectLongListOptions"></q-select>
      <q-select multiple toggle v-model="multipleSelect" :options="selectLongListOptions"></q-select>
      <q-select filter v-model="select" :options="selectLongListOptions"></q-select>
      <q-select filter multiple v-model="multipleSelect" :options="selectLongListOptions"></q-select>
      <q-select filter multiple toggle v-model="multipleSelect" :options="selectLongListOptions"></q-select>

      <p class="caption">Display Value</p>
      <q-select multiple v-model="multipleSelect" float-label="Gigi" :options="selectLongListOptions" :display-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`"></q-select>
      <q-select multiple toggle v-model="multipleSelect" :options="selectLongListOptions" :display-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`"></q-select>
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
      ],
      selectLongListOptions: [
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
        },
        {
          label: 'Google - again',
          icon: 'email',
          value: 'goog-a'
        },
        {
          label: 'Facebook - again',
          description: 'Enables communication',
          value: 'fb-a'
        },
        {
          label: 'Twitter - again',
          secondIcon: 'alarm',
          value: 'twtr-a'
        },
        {
          label: 'Apple Inc. - again',
          stamp: '10 min',
          value: 'appl-a'
        },
        {
          label: 'Oracle - again',
          description: 'Some Java for today?',
          icon: 'mail',
          secondIcon: 'alarm',
          value: 'ora-a'
        },
        {
          label: 'Google - trice',
          icon: 'email',
          value: 'goog-b'
        },
        {
          label: 'Facebook - trice',
          description: 'Enables communication',
          value: 'fb-b'
        },
        {
          label: 'Twitter - trice',
          secondIcon: 'alarm',
          value: 'twtr-b'
        },
        {
          label: 'Apple Inc. - trice',
          stamp: '10 min',
          value: 'appl-b'
        },
        {
          label: 'Oracle - trice',
          description: 'Some Java for today?',
          icon: 'mail',
          secondIcon: 'alarm',
          value: 'ora-b'
        },
        {
          label: 'Google - more',
          icon: 'email',
          value: 'goog-c'
        },
        {
          label: 'Facebook - more',
          description: 'Enables communication',
          value: 'fb-c'
        },
        {
          label: 'Twitter - more',
          secondIcon: 'alarm',
          value: 'twtr-c'
        },
        {
          label: 'Apple Inc. - more',
          stamp: '10 min',
          value: 'appl-c'
        },
        {
          label: 'Oracle - more',
          description: 'Some Java for today?',
          icon: 'mail',
          secondIcon: 'alarm',
          value: 'ora-c'
        },
        {
          label: 'Google - extra',
          icon: 'email',
          value: 'goog-d'
        },
        {
          label: 'Facebook - extra',
          description: 'Enables communication',
          value: 'fb-d'
        },
        {
          label: 'Twitter - extra',
          secondIcon: 'alarm',
          value: 'twtr-d'
        },
        {
          label: 'Apple Inc. - extra',
          stamp: '10 min',
          value: 'appl-d'
        },
        {
          label: 'Oracle - extra',
          description: 'Some Java for today?',
          icon: 'mail',
          secondIcon: 'alarm',
          value: 'ora-d'
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
