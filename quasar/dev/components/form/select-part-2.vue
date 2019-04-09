<template>
  <q-layout view="lHh LpR fFf" :class="{ 'bg-grey-8 text-white': dark }">
    <q-page-container>
      <q-page padding>
        <form class="q-gutter-y-md" @submit.prevent="onSubmit">
          <q-btn type="submit" label="Submit" />
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
            <q-toggle :dark="dark" v-model="dark" label="Dark" />
            <q-toggle :dark="dark" v-model="optionsDark" label="(Options) Dark" />
          </div>
          <div class="q-mb-lg q-gutter-sm">
            <q-btn label="Set Google" @click="setGoogle" color="negative" outline />
            <q-btn label="Set Null" @click="setNull" color="negative" outline />
          </div>

          <q-select
            v-bind="props"
            v-model="simpleFilter"
            label="Simple filter - lazy load options"
            :options="simpleFilterOptions"
            @filter="simpleFilterFn"
            @focus="onFocus"
            @blur="onBlur"
          >
            <q-item slot="no-option">
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>

            <q-icon slot="before" color="green" name="event" />
            <q-icon slot="prepend" name="event" />
            <q-icon slot="append" name="delete" />
            <q-icon slot="after" color="green" name="delete" />
          </q-select>

          <q-select
            v-bind="props"
            v-model="simpleFilterInput"
            use-input
            input-debounce="0"
            label="Simple filter - useInput"
            :options="simpleFilterInputOptions"
            @filter="simpleFilterInputFn"
            @focus="onFocus"
            @blur="onBlur"
            clearable
          >
            <q-item slot="no-option">
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>

            <q-icon slot="before" color="green" name="event" />
            <q-icon slot="prepend" name="event" />
            <q-icon slot="append" name="delete" />
            <q-icon slot="after" color="green" name="delete" />
          </q-select>

          <q-select
            v-bind="props"
            v-model="createInput"
            use-input
            use-chips
            multiple
            input-debounce="0"
            label="Multiple - Create new values (& filter) - @new-value"
            @new-value="createInputNewValue"
            :options="createInputOptions"
            @filter="createInputFn"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-select
            v-bind="props"
            v-model="createInput"
            use-input
            use-chips
            multiple
            input-debounce="0"
            label="Multiple - Create new values (& filter) - mode add"
            new-value-mode="add"
            :options="createInputOptions"
            @filter="createInputFn"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-select
            v-bind="props"
            v-model="createInput"
            use-input
            use-chips
            multiple
            input-debounce="0"
            label="Multiple - Create new values (& filter) - mode add-unique"
            new-value-mode="add-unique"
            :options="createInputOptions"
            @filter="createInputFn"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-select
            v-bind="props"
            v-model="createInput"
            use-input
            use-chips
            multiple
            input-debounce="0"
            label="Multiple - Create new values (& filter) - mode toggle"
            new-value-mode="toggle"
            :options="createInputOptions"
            @filter="createInputFn"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-select
            v-bind="props"
            v-model="createSingleInput"
            use-input
            use-chips
            input-debounce="0"
            label="Single - Create new values (& filter) - @new-value"
            @new-value="createInputNewValue"
            :options="createInputOptions"
            @filter="createInputFn"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-select
            v-bind="props"
            v-model="createSingleInput"
            use-input
            use-chips
            input-debounce="0"
            label="Single - Create new values (& filter) - mode add"
            new-value-mode="add"
            :options="createInputOptions"
            @filter="createInputFn"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-select
            v-bind="props"
            v-model="createInput"
            use-input
            use-chips
            multiple
            input-debounce="0"
            label="Multiple - Create new values (no filter)"
            @new-value="createInputNewValue"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-select
            v-bind="props"
            v-model="createSingleInput"
            use-input
            use-chips
            input-debounce="0"
            label="Single - Create new values (no filter)"
            @new-value="createInputNewValue"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-select
            v-bind="props"
            v-model="simpleFilterInput"
            use-input
            input-debounce="0"
            hide-selected
            label="Simple filter - hide selected + useInput"
            :options="simpleFilterInputOptions"
            @filter="simpleFilterInputFn"
            @focus="onFocus"
            @blur="onBlur"
          >
            <q-item slot="no-option">
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </q-select>

          <q-select
            v-bind="props"
            v-model="minFilterInput"
            use-input
            input-debounce="0"
            label="Simple filter - min 2 chars"
            :options="minFilterInputOptions"
            @filter="minFilterInputFn"
            @focus="onFocus"
            @blur="onBlur"
          >
            <q-item slot="no-option">
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </q-select>

          <q-select
            v-bind="props"
            v-model="chipFilterInput"
            use-input
            use-chips
            input-debounce="0"
            label="Simple filter - selected slot"
            :options="chipFilterInputOptions"
            @filter="chipFilterInputFn"
            @focus="onFocus"
            @blur="onBlur"
          >
            <q-item slot="no-option">
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </q-select>

          <q-select
            v-bind="props"
            v-model="delayedFilterInput"
            use-input
            use-chips
            color="teal"
            label="Delayed filter"
            :options="delayedFilterInputOptions"
            @filter="delayedFilterInputFn"
            @filter-abort="delayedAbort"
            @focus="onFocus"
            @blur="onBlur"
          >
            <q-item slot="no-option">
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </q-select>

          <q-select
            v-bind="props"
            v-model="delayedFilterInput"
            use-input
            use-chips
            color="teal"
            label="Delayed filter with loading slot"
            :options="delayedFilterInputOptions"
            @filter="delayedFilterInputFn"
            @filter-abort="delayedAbort"
            @focus="onFocus"
            @blur="onBlur"
          >
            <template #loading>
              Click for menu
              <q-menu fit>
                <div class="q-pa-md text-center">
                  Menu
                </div>
              </q-menu>
            </template>
            <q-item slot="no-option">
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </q-select>

          <div style="height: 400px">
            Scroll on purpose
          </div>
        </form>
        <q-page-sticky expand position="bottom" :class="dark ? 'bg-blue-8 text-white' : 'bg-yellow'">
          <q-select
            class="full-width"
            v-bind="props"
            v-model="simpleFilterInput"
            use-input
            input-debounce="0"
            label="Type 'aa' to have no option, then delete one 'a'"
            :options="simpleFilterInputOptions"
            @filter="simpleFilterInputFn"
          />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]

export default {
  data () {
    return {
      type: 'filled',
      readonly: false,
      disable: false,
      dense: false,
      dark: false,
      optionsDark: false,
      optionsDense: false,
      optionsCover: false,

      simpleFilter: null,
      simpleFilterOptions: null,

      createInput: null,
      createSingleInput: null,
      createInputOptions: null,

      simpleFilterInput: null,
      simpleFilterInputOptions: null,

      minFilterInput: null,
      minFilterInputOptions: null,

      chipFilterInput: null,
      chipFilterInputOptions: null,

      delayedFilterInput: null,
      delayedFilterInputOptions: null,

      stringSingle: 'Facebook',
      stringMultiple: ['Facebook', 'Twitter'],
      stringOptions,

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
      ]
    }
  },

  methods: {
    setGoogle () {
      this.simpleFilter = this.simpleFilterInput = this.minFilterInput = this.chipFilterInput = this.delayedFilterInput = 'Google'
    },

    setNull () {
      this.simpleFilter = this.simpleFilterInput = this.minFilterInput = this.chipFilterInput = this.delayedFilterInput = null
    },

    createInputNewValue (val, done) {
      console.log('createInputValue', val)
      if (val.length > 0) {
        done(val)
      }
    },

    createInputFn (val, update) {
      update(() => {
        if (val === '') {
          this.createInputOptions = stringOptions
        }
        else {
          const needle = val.toLowerCase()
          this.createInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        }
      })
    },

    simpleFilterFn (val, update) {
      if (this.simpleFilterOptions !== null) {
        update()
        return
      }

      update(() => {
        this.simpleFilterOptions = stringOptions
      })
    },

    simpleFilterInputFn (val, update) {
      if (val === '') {
        update(() => {
          this.simpleFilterInputOptions = stringOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.simpleFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },

    minFilterInputFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.minFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },

    chipFilterInputFn (val, update) {
      update(() => {
        if (val === '') {
          this.chipFilterInputOptions = stringOptions
        }
        else {
          const needle = val.toLowerCase()
          this.chipFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        }
      })
    },

    delayedFilterInputFn (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow

      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.delayedFilterInputOptions = stringOptions
          }
          else {
            const needle = val.toLowerCase()
            this.delayedFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
          }
        })
      }, 2500)
    },

    delayedAbort () {
      console.log('delayed filter aborted')
    },

    onSubmit () {
      this.$q.notify('submitted')
    },

    onBlur (e) {
      console.log('@blur', e)
    },
    onFocus (e) {
      console.log('@focus', e)
    }
  },

  computed: {
    props () {
      return {
        [this.type]: true,
        readonly: this.readonly,
        disable: this.disable,
        dense: this.dense,
        dark: this.dark,
        optionsDense: this.optionsDense,
        optionsDark: this.optionsDark,
        optionsCover: this.optionsCover
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.select-card
  transition .3s background-color
  &:not(.disabled):hover
    background $grey-3
</style>
