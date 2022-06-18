<template>
  <div>
    <div class="q-layout-padding q-gutter-y-md" :class="{ 'bg-grey-8 text-white': dark }">
      <div class="q-gutter-sm">
        <q-radio :dark="dark" v-model="type" val="filled" label="Filled" />
        <q-radio :dark="dark" v-model="type" val="outlined" label="Outlined" />
        <q-radio :dark="dark" v-model="type" val="standout" label="Standout" />
        <q-radio :dark="dark" v-model="type" val="standard" label="Standard" />
        <q-radio :dark="dark" v-model="type" val="borderless" label="Borderless" />
      </div>
      <div>
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="dense" label="Dense" />
        <q-toggle :dark="dark" v-model="optionsDense" label="(Options) Dense" />
        <q-toggle :dark="dark" v-model="optionsCover" label="Options cover" />
        <q-toggle :dark="dark" v-model="dark" label="Dark" :false-value="null" />
        <q-toggle :dark="dark" v-model="optionsDark" label="(Options) Dark" />
      </div>

      <div class="text-h6">
        String options
      </div>

      <div>{{ stringSingle }}</div>
      <q-select
        v-bind="props"
        v-model="stringSingle"
        :options="stringOptions"
        label="Single"
      >
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="search" /></template>
      </q-select>

      <q-select
        v-bind="props"
        v-model="stringSingle"
        :options="stringOptions"
        popup-content-class="bg-amber"
        label="Single - Colored popup"
      >
        <template v-slot:prepend><q-icon name="event" /></template>
        <template v-slot:append><q-icon name="search" /></template>
      </q-select>

      <div>{{ stringMultiple }}</div>
      <q-select
        v-bind="props"
        v-model="stringMultiple"
        :options="stringOptions"
        label="Multiple"
        multiple
      />

      <div class="text-h6">
        Object options
      </div>

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
        <q-btn outline color="negative" label="Reset" @click="resetNull" />
      </div>

      <div>{{ stringNullSingle }}</div>
      <q-select
        v-bind="props"
        v-model="stringNullSingle"
        :options="stringOptions"
        map-options
        label="Single - string"
      />
      <div>{{ objectNullSingle }}</div>
      <q-select
        v-bind="props"
        v-model="objectNullSingle"
        :options="objectOptions"
        label="Single - object"
      />

      <div>{{ stringEmitNullSingle === null ? 'null' : stringEmitNullSingle }}</div>
      <q-select
        v-bind="props"
        v-model="stringEmitNullSingle"
        :options="objectNullOptions"
        emit-value
        map-options
        label="Single - emit - map - object"
      />
      <div>{{ stringEmitNullMultiple }}</div>
      <q-select
        v-bind="props"
        v-model="stringEmitNullMultiple"
        :options="objectNullOptions"
        emit-value
        map-options
        label="Multiple - emit - map - object"
        multiple
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
        <q-btn color="negative" outline label="Reset" @click="resetBogus" />
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
        options-selected-class="text-orange"
      />

      <div class="text-h6">
        Emit value
      </div>

      <div>{{ stringEmitSingle }}</div>
      <q-select
        emit-value
        v-bind="props"
        v-model="stringEmitSingle"
        :options="stringOptions"
        label="Single - string"
      />

      <div>{{ stringEmitMultiple }}</div>
      <q-select
        emit-value
        v-bind="props"
        v-model="stringEmitMultiple"
        :options="stringOptions"
        label="Multiple - string"
        multiple
      />

      <div>{{ objectEmitSingle }}</div>
      <q-select
        emit-value
        v-bind="props"
        v-model="objectEmitSingle"
        :options="objectOptions"
        label="Single - object"
      />

      <div>{{ objectEmitMultiple }}</div>
      <q-select
        emit-value
        v-bind="props"
        v-model="objectEmitMultiple"
        :options="objectOptions"
        label="Multiple - object"
        multiple
      />

      <div class="text-h6">
        Scoped Slot: option (with menu on icon)
      </div>
      <q-select
        v-bind="props"
        v-model="objectSingle"
        label="Single"
        :options="objectOptions"
        options-selected-class="text-deep-orange"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar @click.stop>
              <q-icon tabindex="0" :name="scope.opt.icon" />
              <q-menu v-if="scope.opt.disable !== true">
                <div class="bg-yellow text-black q-pa-md">
                  Test menu
                </div>
              </q-menu>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="scope.html" v-html="scope.opt.label" />
              <q-item-label v-else >
                {{ scope.opt.label }}
              </q-item-label>
              <q-item-label caption>
                {{ scope.opt.description }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-bind="props"
        v-model="objectMultiple"
        label="Multiple"
        :options="objectOptions"
        multiple
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon tabindex="0" :name="scope.opt.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="scope.html" v-html="scope.opt.label" />
              <q-item-label v-else >
                {{ scope.opt.label }}
              </q-item-label>
              <q-item-label caption>
                {{ scope.opt.description }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <div class="text-h6">
        Scoped slot: selected
      </div>
      <q-select
        v-bind="props"
        v-model="objectMultiple"
        :options="objectOptions"
        label="Label"
        multiple
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            :dense="dense"
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="white"
            text-color="primary"
          >
            <q-avatar color="primary" text-color="white" :icon="scope.opt.icon" />
            <span v-if="scope.html" v-html="scope.opt.label" />
            <span v-else>
              {{ scope.opt.label }}
            </span>
          </q-chip>
        </template>
      </q-select>

      <div class="text-h6">
        Max values (in this case 2)
      </div>
      <q-select
        v-bind="props"
        v-model="objectMultiple"
        :options="objectOptions"
        multiple
        counter
        max-values="2"
        color="teal"
      />

      <div class="text-h6">
        Heavy test (100k options)
      </div>
      <q-select
        v-bind="props"
        v-model="heavyModel"
        :options="heavyList"
        label="Heavy"
        multiple
        use-chips
      />

      <q-select
        v-bind="props"
        v-model="heavyModel"
        :options="heavyList"
        label="Heavy"
        multiple
        color="teal"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="white"
            text-color="teal"
          >
            <span v-if="scope.html" v-html="scope.opt.label" />
            <span v-else>
              {{ scope.opt.label }}
            </span>
          </q-chip>
        </template>
      </q-select>

      <div class="text-h6">
        No options
      </div>
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

      <div class="text-h6">
        No options, slot: no-options
      </div>
      <q-select
        v-bind="props"
        v-model="stringSingle"
        use-input
        label="String - single"
      >
        <template v-slot:no-option="scope">
          <q-item>
            <q-item-section>
              No options slot. Input value: {{ scope.inputValue }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <div class="text-h6">
        Alignment test: standard, use-input, use-input + hide-selected, normal input
      </div>
      <div class="row q-gutter-sm">
        <q-select
          class="col-2"
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          label="Single - standard"
        />

        <q-select
          class="col-2"
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          label="Single - use input"
          use-input
        />

        <q-select
          class="col-2"
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          label="Single - hide-selected"
          use-input
          hide-selected
        />

        <q-input
          class="col-2"
          v-bind="props"
          :model-value="stringSingle"
          @update:model-value="val => stringSingle = val === null ? '' : val"
          label="Input"
        />
      </div>

      <div class="row q-gutter-sm">
        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          label="Single - standard"
          prefix="A"
        />

        <q-input
          v-bind="props"
          :model-value="stringSingle"
          @update:model-value="val => stringSingle = val === null ? '' : val"
          label="Input"
          prefix="A"
        />

        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          label="Single - use input"
          use-input
        />

        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          label="Single - hide-selected"
          use-input
          hide-selected
        />

        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          label="Single - use-chips use-input"
          use-chips
          use-input
        />

        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          label="Single - use-chips"
          use-chips
        />
      </div>

      <div class="row q-gutter-sm">
        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          prefix="A"
        />

        <q-input
          v-bind="props"
          :model-value="stringSingle"
          @update:model-value="val => stringSingle = val === null ? '' : val"
          prefix="A"
        />

        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          use-input
        />

        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          use-input
          hide-selected
        />

        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          use-chips
          use-input
        />

        <q-select
          v-bind="props"
          v-model="stringSingle"
          :options="stringOptions"
          use-chips
        />
      </div>

      <div class="text-h6">
        Display value and floating label test
      </div>
      <div>
        <q-select
          label="Options"
          filled
          v-model="dispValSelection"
          :options="dispValOptions"
          :display-value="dispVal"
          multiple
        />
      </div>
    </div>
  </div>
</template>

<script>
const heavyList = []
for (let i = 0; i <= 100000; i++) {
  heavyList.push({
    label: 'Opt ' + i,
    value: Math.random()
  })
}

Object.freeze(heavyList)

export default {
  created () {
    // setInterval(() => {
    //   console.log(document.activeElement)
    // }, 3000)
  },
  data () {
    return {
      dispValSelection: [],
      dispValOptions: [
        'Option 1',
        'Option 2',
        'Option 3'
      ],

      type: 'filled',
      readonly: false,
      disable: false,
      dense: false,
      dark: null,
      optionsDark: false,
      optionsDense: false,
      optionsCover: false,

      stringSingle: 'Facebook',
      stringMultiple: [ 'Facebook', 'Twitter' ],
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
        },
        {
          label: '<span class="text-primary">Safe</span> option with <b>HTML</b>',
          value: 'safe_option_with_html',
          description: 'It does not come from user',
          icon: 'golf_course',
          html: true
        },
        {
          label: '<span class="text-negative">Unsafe</span> option with <b>HTML</b>',
          value: 'unsafe_option_with_html',
          description: 'It comes from user - you should sanitize',
          icon: 'golf_course'
        }
      ],

      objectNullOptions: [
        {
          label: 'Borg - null',
          value: null,
          description: 'I am null',
          icon: 'warning'
        },
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

      stringNullSingle: null,
      stringNullMultiple: null,
      objectNullSingle: null,
      objectNullMultiple: null,

      stringEmitNullSingle: null,
      stringEmitNullMultiple: [ null ],

      stringEmitSingle: 'Facebook',
      stringEmitMultiple: [ 'Facebook' ],
      objectEmitSingle: 'Facebook',
      objectEmitMultiple: [ 'Facebook' ],

      heavyModel: [],
      heavyList,

      bogusModel: 'bogus',
      bogusMultiModel: [ 'bogus', 'gigi' ]
    }
  },

  methods: {
    resetNull () {
      this.stringNullSingle = null
      this.stringNullMultiple = null
      this.stringEmitNullSingle = null
      this.stringEmitNullMultiple = [ null ]
      this.objectNullSingle = null
      this.objectNullMultiple = null
    },

    resetBogus () {
      this.bogusModel = 'bogus'
      this.bogusMultiModel = [ 'bogus', 'gigi' ]
    }
  },

  computed: {
    props () {
      return {
        [ this.type ]: true,
        readonly: this.readonly,
        disable: this.disable,
        dense: this.dense,
        dark: this.dark,
        optionsDense: this.optionsDense,
        optionsDark: this.optionsDark,
        optionsCover: this.optionsCover,
        clearable: true
      }
    },

    dispVal () {
      if (this.dispValSelection.length === 1) {
        return '1 option selected'
      }
      else {
        return this.dispValSelection.length + ' options selected'
      }
    }
  }
}
</script>

<style lang="sass">
.select-card
  transition: .3s background-color
  &:not(.disabled):hover
    background: $grey-3
</style>
