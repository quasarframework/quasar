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
      <div>
        <q-toggle v-model="readonly" label="Readonly" />
        <q-toggle v-model="disable" label="Disable" />
        <q-toggle v-model="dense" label="Dense" />
        <q-toggle v-model="expandBesides" label="Expand besides" />
      </div>

      <div class="text-h6">String options</div>

      <div>{{ stringSingle }}</div>
      <q-select
        v-bind="props"
        v-model="stringSingle"
        :options="stringOptions"
        label="Single"
      />

      <div>{{ stringMultiple }}</div>
      <q-select
        v-bind="props"
        v-model="stringMultiple"
        :options="stringOptions"
        label="Multiple"
        multiple
      />

      <div class="text-h6">Object options</div>

      <div>{{ objectSingle }}</div>
      <q-select
        v-bind="props"
        v-model="objectSingle"
        :options="objectOptions"
        label="Single"
      />

      <div>{{ objectMultiple }}</div>
      <q-select
        v-bind="props"
        v-model="objectMultiple"
        :options="objectOptions"
        label="Multiple"
        multiple
      />

      <div class="text-h6">
        Null model
        <q-btn outline color="primary" label="Reset" @click="resetNull" />
      </div>

      <div>{{ stringNullSingle }}</div>
      <q-select
        v-bind="props"
        v-model="stringNullSingle"
        :options="stringOptions"
        label="Single - string"
      />
      <div>{{ objectNullSingle }}</div>
      <q-select
        v-bind="props"
        v-model="objectNullSingle"
        :options="objectOptions"
        label="Single - object"
      />

      <div>{{ stringNullMultiple }}</div>
      <q-select
        v-bind="props"
        v-model="stringNullMultiple"
        :options="stringOptions"
        label="Multiple - string"
        multiple
      />

      <div>{{ objectNullMultiple }}</div>
      <q-select
        v-bind="props"
        v-model="objectNullMultiple"
        :options="objectOptions"
        label="Multiple - object"
        multiple
      />

      <div class="text-h6">
        Model value not in options
        <q-btn color="primary" outline label="Reset" @click="resetBogus" />
      </div>
      <div>{{ bogusModel }}</div>
      <q-select
        v-bind="props"
        v-model="bogusModel"
        :options="stringOptions"
      />
      <div>{{ bogusMultiModel }}</div>
      <q-select
        v-bind="props"
        v-model="bogusMultiModel"
        :options="stringOptions"
        multiple
      />

      <div class="text-h6">Scoped Slot: option</div>
      <q-select
        v-bind="props"
        v-model="objectSingle"
        label="Single"
        :options="objectOptions"
      >
        <q-item
          slot="option"
          slot-scope="scope"
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section avatar>
            <q-icon :name="scope.opt.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-icon slot="append" name="clear" @click.stop="objectSingle = null" />
      </q-select>

      <q-select
        v-bind="props"
        v-model="objectMultiple"
        label="Multiple"
        :options="objectOptions"
        multiple
      >
        <q-item
          slot="option"
          slot-scope="scope"
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section avatar>
            <q-icon :name="scope.opt.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-icon slot="append" name="clear" @click.stop="objectMultiple = null" />
      </q-select>

      <div class="text-h6">Scoped slot: selected</div>
      <q-select
        v-bind="props"
        v-model="objectMultiple"
        :options="objectOptions"
        label="Label"
        multiple
      >
        <q-chip
          slot="selected"
          slot-scope="scope"
          removable
          @remove="scope.removeValue(scope.opt)"
          color="white"
          text-color="primary"
        >
          <q-avatar color="primary" text-color="white" :icon="scope.opt.icon" />
          <span v-html="scope.opt.label" />
        </q-chip>
      </q-select>

      <div class="text-h6">Max values (in this case 2)</div>
      <q-select
        v-bind="props"
        v-model="objectMultiple"
        :options="objectOptions"
        multiple
        counter
        max-values="2"
        color="teal"
      />

      <div class="text-h6">Heavy test (10k options)</div>
      <q-select
        v-bind="props"
        v-model="heavyModel"
        :options="heavyOptions"
        label="Heavy"
        multiple
      />

      <q-select
        v-bind="props"
        v-model="heavyModel"
        :options="heavyOptions"
        label="Heavy"
        multiple
        color="teal"
      >
        <q-chip
          slot="selected"
          slot-scope="scope"
          color="white"
          removable
          @remove="scope.removeValue(scope.opt)"
          text-color="teal"
        >
          <span v-html="scope.opt.label" />
        </q-chip>
      </q-select>

      <div class="text-h6">No options</div>
      <q-select
        v-bind="props"
        v-model="stringSingle"
        label="String - single"
      />
      <q-select
        v-bind="props"
        v-model="stringMultiple"
        label="String - multiple"
        multiple
      />
      <q-select
        v-bind="props"
        v-model="objectSingle"
        label="Object - single"
      />
      <q-select
        v-bind="props"
        v-model="objectMultiple"
        label="Object - multiple"
        multiple
      />

      <div class="text-h6">No options, slot: no-options</div>
      <q-select
        v-bind="props"
        v-model="stringSingle"
        label="String - single"
      >
        <q-item
          slot="no-option"
        >
          <q-item-section>
            No options slot
          </q-item-section>
        </q-item>
      </q-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const heavyOptions = []
    for (let i = 0; i <= 10000; i++) {
      heavyOptions.push({
        label: 'Opt ' + i,
        value: Math.random()
      })
    }

    return {
      type: 'filled',
      readonly: false,
      disable: false,
      dense: false,
      expandBesides: false,

      stringSingle: 'Facebook',
      stringMultiple: ['Facebook', 'Twitter'],
      stringOptions: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],

      objectSingle: {
        label: 'Facebook',
        value: 'Facebook',
        description: 'Social media',
        icon: 'bluetooth'
      },
      objectMultiple: [
        {
          label: 'Google',
          value: 'Google',
          description: 'Search engine',
          icon: 'mail'
        },
        {
          label: 'Facebook',
          value: 'Facebook',
          description: 'Social media',
          icon: 'bluetooth'
        }
      ],
      objectOptions: [
        {
          label: 'Google',
          value: 'Google',
          description: 'Search engine',
          icon: 'mail'
        },
        {
          label: 'Facebook',
          value: 'Facebook',
          description: 'Social media',
          icon: 'bluetooth'
        },
        {
          label: 'Twitter',
          value: 'Twitter',
          description: 'Quick updates',
          icon: 'map'
        },
        {
          label: 'Apple',
          value: 'Apple',
          description: 'iStuff',
          icon: 'golf_course'
        },
        {
          label: 'Oracle',
          value: 'Oracle',
          disable: true,
          description: 'Databases',
          icon: 'casino'
        }
      ],

      stringNullSingle: null,
      stringNullMultiple: null,
      objectNullSingle: null,
      objectNullMultiple: null,

      heavyModel: [],
      heavyOptions,

      bogusModel: 'bogus',
      bogusMultiModel: ['bogus', 'gigi']
    }
  },

  methods: {
    resetNull () {
      this.stringNullSingle = null
      this.stringNullMultiple = null
      this.objectNullSingle = null
      this.objectNullMultiple = null
    },

    resetBogus () {
      this.bogusModel = 'bogus'
      this.bogusMultiModel = ['bogus', 'gigi']
    }
  },

  computed: {
    props () {
      return {
        [this.type]: true,
        readonly: this.readonly,
        disable: this.disable,
        dense: this.dense,
        expandBesides: this.expandBesides
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.select-card
  transition .3s background-color
  &:not(.disabled):hover
    background $grey-3
</style>
