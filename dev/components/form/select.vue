<template>
  <div>
    <div class="q-layout-padding q-gutter-y-md">
      <div class="q-gutter-sm">
        <q-radio v-model="type" val="filled" label="Filled" />
        <q-radio v-model="type" val="outlined" label="Outlined" />
        <q-radio v-model="type" val="standout" label="Standout" />
        <q-radio v-model="type" val="standard" label="Standard" />
        <q-radio v-model="type" val="borderless" label="Borderless" />
      </div>

      <div class="text-h6">Single</div>
      <q-select
        v-bind="props"
        v-model="select1"
        :options="selectOptions"
        label="Single"
      />

      <q-select
        v-bind="props"
        label="Option slot"
        v-model="select2"
        :options="selectOptions"
      >
        <q-item
          slot="option"
          slot-scope="scope"
          clickable
          :active="scope.active"
          @click="select2 = scope.opt.value"
        >
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
            <q-item-label caption>Click on me</q-item-label>
          </q-item-section>
        </q-item>

        <q-icon slot="append" name="clear" @click.stop="select2 = null" />
      </q-select>

      <div class="text-h6">Multiple</div>
      <q-select
        v-bind="props"
        v-model="multi1"
        :options="selectOptions"
        label="Multiple"
        multiple
      />

      <q-select
        v-bind="props"
        label="Multiple & option slot"
        v-model="multi2"
        :options="selectOptions"
        multiple
      >
        <q-item
          slot="option"
          slot-scope="scope"
          clickable
          :active="scope.active"
          @click="scope.click"
        >
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
            <q-item-label caption>Click on me</q-item-label>
          </q-item-section>
        </q-item>

        <q-icon slot="append" name="clear" @click.stop="multi2 = []" />
      </q-select>

      <div class="text-h6">Slot: option</div>
      <q-select
        v-bind="props"
        v-model="multi1"
        :options="selectOptions"
        label="Label"
        counter
        multiple
      >
        <q-icon slot="before" name="add_location" />
        <q-btn slot="append" icon="clear" @click.stop="multi1 = []" flat round dense />
        <q-btn slot="append" icon="send" @click.stop flat round dense />

        <q-item
          slot="option"
          slot-scope="scope"
          clickable
          :active="scope.active"
          @click="scope.click"
        >
          <q-item-section avatar>
            <q-icon :name="scope.opt.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-select>

      <q-select
        v-bind="props"
        v-model="multi1"
        :options="selectOptions"
        label="Label"
        multiple
      >
        <q-item
          dense
          slot="option"
          slot-scope="scope"
          clickable
          :active="scope.active"
          @click="scope.click"
        >
          <q-item-section side>
            <q-checkbox :value="scope.active" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon :name="scope.opt.icon" />
          </q-item-section>
        </q-item>
      </q-select>

      <div class="text-h6">Slot: selected</div>
      <q-select
        v-bind="props"
        v-model="multi1"
        :options="selectOptions"
        multiple
      >
        <div slot="selected">
          <em v-if="multi1.length === 0">None</em>
          <span v-else>
            {{ multi1[0] }}
            <em v-if="multi1.length > 1">+ {{ multi1.length - 1 }} more</em>
          </span>
        </div>
      </q-select>

      <q-select
        v-bind="props"
        v-model="multi1"
        :options="selectOptions"
        multiple
      >
        <q-chip slot="selected" closable color="orange" v-for="sel in multi1" :key="sel">
          <q-avatar color="teal" text-color="white" icon="directions" />
          {{ sel }}
        </q-chip>
      </q-select>

      <div class="text-h6">Readonly</div>
      <q-select
        v-bind="props"
        readonly
        v-model="select1"
        :options="selectOptions"
        label="Single"
      />

      <q-select
        v-bind="props"
        readonly
        v-model="multi1"
        :options="selectOptions"
        label="Multiple"
        multiple
      />

      <div class="text-h6">Disable</div>
      <q-select
        v-bind="props"
        disable
        v-model="select1"
        :options="selectOptions"
        label="Single"
      />

      <q-select
        v-bind="props"
        disable
        v-model="multi1"
        :options="selectOptions"
        label="Multiple"
        multiple
      />

      <div class="text-h6">Heavy test</div>
      <q-select
        v-bind="props"
        v-model="heavyModel"
        :options="heavyOptions"
        label="Heavy"
        multiple
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const heavyOptions = []
    for (let i = 0; i <= 1000; i++) {
      heavyOptions.push({
        label: 'Opt ' + Math.random(),
        value: Math.random()
      })
    }

    return {
      type: 'filled',

      heavyModel: [],
      heavyOptions,

      select1: 'fb',
      select2: 'fb',
      multi1: ['goog', 'twtr'],
      multi2: [],

      selectOptions: [
        {
          label: 'VW&#x00B3; Google',
          value: 'goog',
          description: 'Search engine',
          icon: 'mail'
        },
        {
          label: 'Facebook',
          value: 'fb',
          description: 'Social media',
          icon: 'bluetooth'
        },
        {
          label: 'Twitter',
          value: 'twtr',
          description: 'Quick updates',
          icon: 'map'
        },
        {
          label: 'Apple Inc.',
          value: 'appl',
          description: 'iStuff',
          icon: 'golf_course'
        },
        {
          label: 'Oracle',
          value: 'ora',
          description: 'Databases',
          icon: 'casino'
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
  },

  computed: {
    props () {
      return {
        [this.type]: true
      }
    }
  }
}
</script>
