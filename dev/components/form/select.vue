<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Single Selection</p>
      <q-select v-model="select" @change="onChange" @input="onInput" :options="selectOptions" align="right" clearable />
      <q-select v-model="select" :options="selectOptions" separator/>
      <q-select v-model="select" :options="selectListOptions"/>
      <q-select v-model="select" :options="selectDisabledOptions"/>

      <p class="caption">Hide Underline</p>
      <q-select hide-underline v-model="select" :options="selectDisabledOptions"/>
      <q-select hide-underline color="amber" v-model="select" :options="selectListOptions"/>
      <q-select hide-underline inverted color="secondary" v-model="select" :options="selectListOptions"/>

      <p class="caption">Coloring</p>
      <q-select color="amber" v-model="select" :options="selectListOptions"/>
      <q-select inverted color="secondary" v-model="select" :options="selectListOptions"/>
      <q-select inverted float-label="Float Label" color="amber" v-model="select" :options="selectListOptions"/>
      <q-select inverted float-label="Float Label" color="white" :dark="false" v-model="select" :options="selectListOptions"/>

      <p class="caption">Single Selection with Radio</p>
      <q-field label="gogu">
        <q-select @change="onChange" @input="onInput" v-model="select" float-label="Gogu" radio :options="selectListOptions" :count="10"/>
      </q-field>
      <q-field label="gogu">
        <q-select @change="onChange" @input="onInput" v-model="select" float-label="Gogu" radio :options="selectDisabledOptions" :count="10"/>
      </q-field>

      <p class="caption">Multiple Selection</p>
      <q-select @change="onChange" @input="onInput" multiple v-model="multipleSelect" :options="selectListOptions" clearable/>
      <q-select @change="val => { multipleSelect = val; onChange(val); }" @input="onInput" multiple :value="multipleSelect" :options="selectListOptions" clearable/>
      <q-select @change="onChange" @input="onInput" multiple v-model="multipleSelect" :options="selectDisabledOptions"/>

      <p class="caption">Multiple Selection with Chips</p>
      <q-field label="gogu" :count="10">
        <q-select @change="onChange" @input="onInput" multiple chips v-model="multipleSelect" :options="selectListOptions" float-label="Some label" placeholder="Gigi" max-height="36px" clearable/>
      </q-field>
      <q-field label="gogu" :count="10">
        <q-select @change="onChange" @input="onInput" multiple chips v-model="multipleSelectColor" :options="selectListOptions" float-label="Some label" max-height="36px" clearable/>
      </q-field>
      <q-field label="gogu" :count="10">
        <q-select @change="onChange" @input="onInput" multiple v-model="multipleSelect" :options="selectListOptions" float-label="Some label" max-height="36px"/>
      </q-field>
      <q-select inverted inverted-light color="amber" multiple chips v-model="multipleSelect" :options="selectListOptions" float-label="Some label" max-height="36px"/>
      <q-select inverted inverted-light color="amber" multiple chips v-model="multipleSelect" :options="selectDisabledOptions" float-label="Some label" max-height="36px"/>

      <p class="caption">Multiple Selection with Checkboxes</p>
      <q-select multiple checkbox v-model="multipleSelect" :options="selectListOptions"/>
      <q-select multiple checkbox v-model="multipleSelect" :options="selectListOptionColors"/>
      <q-select multiple checkbox v-model="multipleSelect" :options="selectDisabledOptions"/>

      <p class="caption">Multiple Selection with Toggle</p>
      <q-select multiple toggle v-model="multipleSelect" :options="selectListOptions"/>
      <q-select multiple toggle v-model="multipleSelect" :options="selectListOptionColors"/>
      <q-select multiple toggle v-model="multipleSelect" :options="selectDisabledOptions"/>

      <p class="caption">Simple</p>
      <q-select simple v-model="select" :options="selectOptions"/>

      <p class="caption">With Filter</p>
      <q-select filter v-model="select" :options="selectListOptions" />
      <q-select filter v-model="select" :options="selectLongListOptions" />
      <q-select filter inverted v-model="select" :options="selectListOptions" />
      <q-select filter inverted v-model="select" :options="selectLongListOptions" />
      <q-select filter multiple checkbox v-model="multipleSelect" :options="selectListOptions" />

      <p class="caption">With Static Label</p>
      <q-select multiple v-model="multipleSelect" :options="selectOptions" static-label="Company"/>

      <p class="caption">Disabled State</p>
      <q-select disable float-label="Disabled Select" multiple v-model="multipleSelect" :options="selectOptions"/>
      <q-select disable @change="onChange" @input="onInput" multiple chips v-model="multipleSelect" :options="selectListOptions" float-label="Disabled Select" max-height="36px" clearable/>
      <q-select disable inverted inverted-light color="amber" multiple chips v-model="multipleSelect" :options="selectListOptions" float-label="Disabled Select" max-height="36px"/>

      <p class="caption">Read Only State</p>
      <q-select readonly float-label="Read Only Select with Custom Icon" multiple v-model="multipleSelect" :options="selectOptions" :after="[{icon: 'visibility_off'}]"/>
      <q-select readonly @change="onChange" @input="onInput" multiple chips v-model="multipleSelect" :options="selectListOptions" float-label="Read Only Select" max-height="36px" clearable/>

      <p class="caption">With Custom Right Side Icon </p>
      <q-select color="amber" multiple v-model="multipleSelect" :options="selectListOptions" float-label="With Custom Icon" max-height="36px" :after="[{icon: 'radio_button_checked'}]"/>

      <p class="caption">Error State</p>
      <q-select error multiple v-model="multipleSelect" :options="selectOptions"/>

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-list-header>Single Selection</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-select
              v-model="select"
              :options="selectOptions"
            />
          </q-item-main>
        </q-item>
        <q-item-separator />
        <q-list-header>Multiple Selection</q-list-header>
        <q-item>
          <q-item-side icon="supervisor_account" />
          <q-item-main>
            <q-select
              multiple
              v-model="multipleSelect"
              :options="selectOptions"
            />
          </q-item-main>
        </q-item>
      </q-list>

      <p class="caption">Scroll into View</p>
      <q-select v-model="select" :options="selectLongListOptions"/>
      <q-select multiple v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select multiple toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select filter v-model="select" :options="selectLongListOptions"/>
      <q-select filter multiple v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select filter multiple toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select multiple multiple-toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select multiple multiple-toggle toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select filter multiple multiple-toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select filter multiple multiple-toggle toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select inverted multiple multiple-toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select inverted multiple multiple-toggle toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select inverted filter v-model="select" :options="selectLongListOptions"/>
      <q-select inverted filter multiple multiple-toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select inverted filter multiple multiple-toggle toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select color="orange" inverted multiple multiple-toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select color="orange" inverted multiple multiple-toggle toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select color="orange" inverted filter v-model="select" :options="selectLongListOptions"/>
      <q-select color="orange" inverted filter multiple multiple-toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>
      <q-select color="orange" inverted filter multiple multiple-toggle toggle v-model="multipleSelectLong" :options="selectLongListOptions"/>

      <p class="caption">Display Value</p>
      <q-select multiple v-model="multipleSelect" float-label="Gigi" :options="selectLongListOptions" :display-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`"/>
      <q-select multiple toggle v-model="multipleSelect" :options="selectLongListOptions" :display-value="`${ multipleSelect.length } item${ multipleSelect.length !== 1 ? 's' : '' } selected`"/>

      <p class="caption">Object Value1</p>
      <q-select v-model="selectObject" :options="selectObjectOptions"/>

      <p class="caption">Blur on destroy</p>
      <q-toggle v-model="blurTestVisible" label="Field rendered" />
      <div v-if="blurTestVisible">
        <q-select clearable :value="select" @change="(v) => { select = v; onChange(v) }" @blur="onBlur" :options="selectListOptions" float-label="Test here" />
      </div>
      <pre>Field value: `{{ select }}`</pre>

      <p class="caption">Size tests</p>
      <div class="row">
        <q-select clearable v-model="select" :options="selectListOptions"/>
      </div>
      <div class="row">
        <q-select clearable v-model="select" :options="selectListOptions" placeholder="Placeholder - Long text here, to fill space" />
      </div>
      <div class="row">
        <q-select clearable v-model="select" :options="selectListOptions" stack-label="Stack label - Long text here, to fill space" />
      </div>
      <div class="row">
        <q-select clearable v-model="select" :options="selectListOptions" float-label="Float label - Long text here, to fill space" />
      </div>
      <div class="row">
        <q-select clearable v-model="select" :options="selectListOptions" placeholder="Placeholder - Long text here, to fill space" stack-label="Stack label - Long text here, to fill space" />
      </div>
      <div class="row">
        <q-select clearable v-model="select" :options="selectListOptions" placeholder="Placeholder - Long text here, to fill space" float-label="Float label - Long text here, to fill space" />
      </div>

      <div class="row">
        <q-select prefix="Prefix" suffix="Suffix" clearable v-model="select" :options="selectListOptions"/>
      </div>
      <div class="row">
        <q-select prefix="Prefix" suffix="Suffix" clearable v-model="select" :options="selectListOptions" placeholder="Placeholder - Long text here, to fill space" />
      </div>
      <div class="row">
        <q-select prefix="Prefix" suffix="Suffix" clearable v-model="select" :options="selectListOptions" stack-label="Stack label - Long text here, to fill space" />
      </div>
      <div class="row">
        <q-select prefix="Prefix" suffix="Suffix" clearable v-model="select" :options="selectListOptions" float-label="Float label - Long text here, to fill space" />
      </div>
      <div class="row">
        <q-select prefix="Prefix" suffix="Suffix" clearable v-model="select" :options="selectListOptions" placeholder="Placeholder - Long text here, to fill space" stack-label="Stack label - Long text here, to fill space" />
      </div>
      <div class="row">
        <q-select prefix="Prefix" suffix="Suffix" clearable v-model="select" :options="selectListOptions" placeholder="Placeholder - Long text here, to fill space" float-label="Float label - Long text here, to fill space" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      select: 'fb',
      selectObject: null,
      blurTestVisible: true,
      multipleSelect: ['goog', 'twtr'],
      multipleSelectColor: ['goog', 'twtr', 'ora'],
      multipleSelectLong: [],
      selectOptions: [
        {
          label: 'VW&#x00B3; Google',
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
      selectDisabledOptions: [
        {
          label: 'VW&#x00B3; Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb',
          disable: true
        },
        {
          label: 'Twitter',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          value: 'appl',
          disable: true
        },
        {
          label: 'Oracle',
          value: 'ora'
        }
      ],
      selectListOptions: [
        {
          label: 'VW&#x00B3; Google',
          icon: 'email',
          value: 'goog'
        },
        {
          label: 'Facebook',
          inset: true,
          description: 'Enables communication',
          value: 'fb'
        },
        {
          label: 'Twitter Twitter Twitter Twitter Twitter Twitter Twitter',
          inset: true,
          rightIcon: 'alarm',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          inset: true,
          stamp: '10 min',
          value: 'appl'
        },
        {
          label: 'Oracle',
          description: 'Some Java for today?',
          icon: 'mail',
          rightIcon: 'alarm',
          value: 'ora',
          color: 'red-4'
        }
      ],
      selectListOptionColors: [
        {
          label: 'VW&#x00B3; Google',
          icon: 'email',
          value: 'goog'
        },
        {
          label: 'Facebook',
          inset: true,
          description: 'Enables communication',
          value: 'fb'
        },
        {
          label: 'Twitter',
          inset: true,
          rightIcon: 'alarm',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          inset: true,
          stamp: '10 min',
          value: 'appl'
        },
        {
          label: 'Oracle',
          description: 'Some Java for today?',
          icon: 'mail',
          rightIcon: 'alarm',
          value: 'ora',
          color: 'red-4'
        }
      ],
      selectLongListOptions: [
        {
          label: 'VW&#x00B3; Google',
          icon: 'email',
          value: 'goog'
        },
        {
          label: 'Facebook',
          inset: true,
          description: 'Enables communication',
          value: 'fb'
        },
        {
          label: 'Twitter',
          inset: true,
          rightIcon: 'alarm',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          inset: true,
          stamp: '10 min',
          value: 'appl'
        },
        {
          label: 'Oracle',
          sublabel: 'Oracle that is',
          inset: true,
          description: 'Some Java for today?',
          icon: 'mail',
          rightIcon: 'alarm',
          value: 'ora'
        },
        {
          label: 'Google - again',
          icon: 'email',
          value: 'goog-a'
        },
        {
          label: 'Facebook - again',
          inset: true,
          description: 'Enables communication',
          value: 'fb-a'
        },
        {
          label: 'Twitter - again',
          inset: true,
          rightIcon: 'alarm',
          value: 'twtr-a'
        },
        {
          label: 'Apple Inc. - again',
          inset: true,
          stamp: '10 min',
          value: 'appl-a'
        },
        {
          label: 'Oracle - again',
          description: 'Some Java for today?',
          icon: 'mail',
          rightIcon: 'alarm',
          value: 'ora-a'
        },
        {
          label: 'Google - trice',
          icon: 'email',
          value: 'goog-b'
        },
        {
          label: 'Facebook - trice',
          inset: true,
          description: 'Enables communication',
          value: 'fb-b'
        },
        {
          label: 'Twitter - trice',
          inset: true,
          rightIcon: 'alarm',
          value: 'twtr-b'
        },
        {
          label: 'Apple Inc. - trice',
          inset: true,
          stamp: '10 min',
          value: 'appl-b'
        },
        {
          label: 'Oracle - trice',
          description: 'Some Java for today?',
          icon: 'mail',
          rightIcon: 'alarm',
          value: 'ora-b'
        },
        {
          label: 'Google - more',
          icon: 'email',
          value: 'goog-c'
        },
        {
          label: 'Facebook - more',
          inset: true,
          description: 'Enables communication',
          value: 'fb-c'
        },
        {
          label: 'Twitter - more',
          inset: true,
          rightIcon: 'alarm',
          value: 'twtr-c'
        },
        {
          label: 'Apple Inc. - more',
          inset: true,
          stamp: '10 min',
          value: 'appl-c'
        },
        {
          label: 'Oracle - more',
          description: 'Some Java for today?',
          icon: 'mail',
          rightIcon: 'alarm',
          value: 'ora-c'
        },
        {
          label: 'Google - extra',
          icon: 'email',
          value: 'goog-d'
        },
        {
          label: 'Facebook - extra',
          inset: true,
          description: 'Enables communication',
          value: 'fb-d'
        },
        {
          label: 'Twitter - extra',
          inset: true,
          rightIcon: 'alarm',
          value: 'twtr-d'
        },
        {
          label: 'Apple Inc. - extra',
          inset: true,
          stamp: '10 min',
          value: 'appl-d'
        },
        {
          label: 'Oracle - extra',
          description: 'Some Java for today?',
          icon: 'mail',
          rightIcon: 'alarm',
          value: 'ora-d'
        }
      ],
      selectObjectOptions: [
        {
          label: 'Option 1',
          value: { id: 1 }
        },
        {
          label: 'Option 2',
          value: { id: 2 }
        },
        {
          label: 'Option 3',
          value: { id: 3 }
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
    onBlur (val) {
      console.log('@blur', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
