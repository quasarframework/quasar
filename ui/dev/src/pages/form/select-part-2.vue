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
            <q-checkbox v-model="forceMenu" toggle-indeterminate :label="forceMenuLabel" />
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
          <div class="q-mb-lg q-gutter-sm">
            <q-btn label="Set Google" @click="setGoogle" color="negative" outline />
            <q-btn label="Set Null" @click="setNull" color="negative" outline />
          </div>

          <div>Single</div>
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
            v-model="simpleFilterInput"
            use-input
            input-debounce="0"
            hide-selected
            label="Simple filter - useInput, hide-selected"
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
          </q-select>

          <div>Multiple</div>
          <q-select
            v-bind="props"
            v-model="multipleFilter"
            multiple
            label="Multiple filter - lazy load options"
            :options="multipleFilterOptions"
            @filter="multipleFilterFn"
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
            v-model="multipleFilterInput"
            multiple
            use-input
            input-debounce="0"
            label="Multiple filter - useInput"
            :options="multipleFilterInputOptions"
            @filter="multipleFilterInputFn"
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
            v-model="multipleFilterInput"
            multiple
            use-input
            input-debounce="0"
            hide-selected
            label="Multiple filter - useInput, hide-selected"
            :options="multipleFilterInputOptions"
            @filter="multipleFilterInputFn"
            @focus="onFocus"
            @blur="onBlur"
            clearable
          >
            <q-item slot="no-option">
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </q-select>

          <div>Create new value</div>
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
            hide-selected
            fill-input
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
              <div class="q-anchor--skip" @click.prevent>
                Click for menu
                <q-menu fit no-focus>
                  <div class="q-pa-md text-center">
                    Menu
                  </div>
                </q-menu>
              </div>
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            v-bind="props"
            label="Mode: 'add'"
            v-model="modelAdd"
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            new-value-mode="add"
            style="width: 250px"
          />

          <div class="text-h6">
            Heavy test (100k options)
          </div>
          <q-select
            v-bind="props"
            v-model="heavyModel"
            label="Heavy"
            multiple
            use-chips
            :options="heavyFilterInputOptions"
            @filter="heavyFilterInputFn"
            @filter-abort="delayedAbort"
            @focus="onFocus"
            @blur="onBlur"
          />

          <div class="text-h6">
            Heavy test with dynamic loading (100k options)
          </div>
          <q-select
            v-bind="props"
            v-model="heavyModel"
            label="Heavy - Dynamic loading"
            multiple
            use-chips
            :options="heavyListDynamic"
            @focus="onFocus"
            @blur="onBlur"
            @virtual-scroll="onScroll"
          />

          <div class="text-h6">
            Heavy test - Variable size (100k options)
          </div>
          <q-select
            v-bind="props"
            v-model="heavyModel"
            label="Heavy"
            multiple
            use-input
            use-chips
            :options="heavyFilterInputOptions"
            @filter="heavyFilterInputFn"
            @filter-abort="delayedAbort"
            @focus="onFocus"
            @blur="onBlur"
          >
            <template v-slot:option="scope">
              <div :key="scope.index">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label>
                      Option - {{ scope.opt.label }} - {{ scope.index }}
                    </q-item-label>

                    <q-item-label class="q-py-sm" v-if="(scope.index % 5) === 0">
                      {{ scope.opt.label }}
                    </q-item-label>

                    <q-item-label class="q-py-md text-negative" v-if="(scope.index % 3) === 0">
                      {{ scope.opt.value }}
                    </q-item-label>

                    <q-item-label class="q-py-lg text-positive" v-if="(scope.index % 4) === 0">
                      {{ scope.index }} - {{ scope.opt.label }} - {{ scope.opt.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
              </div>
            </template>
          </q-select>

          <div class="text-h6">
            Heavy test with dynamic loading - Variable size (100k options)
          </div>
          <q-select
            v-bind="props"
            v-model="heavyModel"
            label="Heavy - Dynamic loading"
            multiple
            use-input
            use-chips
            :options="heavyListDynamic"
            @focus="onFocus"
            @blur="onBlur"
            @virtual-scroll="onScroll"
          >
            <template v-slot:option="scope">
              <div :key="scope.index">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label>
                      Option - {{ scope.opt.label }} - {{ scope.index }}
                    </q-item-label>

                    <q-item-label class="q-py-sm" v-if="(scope.index % 5) === 0">
                      {{ scope.opt.label }}
                    </q-item-label>

                    <q-item-label class="q-py-md text-negative" v-if="(scope.index % 3) === 0">
                      {{ scope.opt.value }}
                    </q-item-label>

                    <q-item-label class="q-py-lg text-positive" v-if="(scope.index % 4) === 0">
                      {{ scope.index }} - {{ scope.opt.label }} - {{ scope.opt.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
              </div>
            </template>
          </q-select>

          <q-select
            style="width: 300px; margin-left: auto;"
            v-bind="props"
            v-model="heavyModel"
            label="Heavy"
            multiple
            use-input
            use-chips
            :options="heavyFilterInputOptions"
            @filter="heavyFilterInputFn"
            @filter-abort="delayedAbort"
            @focus="onFocus"
            @blur="onBlur"
          >
            <template v-slot:option="scope">
              <div>
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                  :key="scope.index"
                >
                  <q-item-section>
                    <q-item-label>
                      Option - {{ scope.opt.label }} - {{ scope.index }}
                    </q-item-label>

                    <q-item-label class="q-py-sm" v-if="(scope.index % 5) === 0">
                      {{ scope.opt.label }}
                    </q-item-label>

                    <q-item-label class="q-py-md text-negative" v-if="(scope.index % 3) === 0">
                      {{ scope.opt.value }}
                    </q-item-label>

                    <q-item-label class="q-py-lg text-positive" v-if="(scope.index % 4) === 0">
                      {{ scope.index }} - {{ scope.opt.label }} - {{ scope.opt.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
              </div>
            </template>
          </q-select>

          <q-select
            style="width: 300px;"
            v-bind="props"
            v-model="heavyModel"
            label="Heavy"
            multiple
            options-cover
            :options="heavyFilterInputOptions"
            @filter="heavyFilterInputFn"
            @filter-abort="delayedAbort"
            @focus="onFocus"
            @blur="onBlur"
          >
            <template v-slot:option="scope">
              <div>
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                  :key="scope.index"
                >
                  <q-item-section>
                    <q-item-label>
                      Option - {{ scope.opt.label }} - {{ scope.index }}
                    </q-item-label>

                    <q-item-label class="q-py-sm" v-if="(scope.index % 5) === 0">
                      {{ scope.opt.label }}
                    </q-item-label>

                    <q-item-label class="q-py-md text-negative" v-if="(scope.index % 3) === 0">
                      {{ scope.opt.value }}
                    </q-item-label>

                    <q-item-label class="q-py-lg text-positive" v-if="(scope.index % 4) === 0">
                      {{ scope.index }} - {{ scope.opt.label }} - {{ scope.opt.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
              </div>
            </template>
          </q-select>

          <q-select
            ref="prefilter1"
            v-bind="props"
            v-model="heavyModel"
            label="Heavy multiple with search"
            multiple
            use-chips
            use-input
            :options="heavyFilterInputOptions"
            @filter="heavyFilterInputFn"
            @filter-abort="delayedAbort"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-btn label="Prefilter Heavy multiple with 123" @click="() => prefilter('prefilter1')" />

          <q-select
            ref="prefilter2"
            v-bind="props"
            v-model="heavyModelSingle"
            label="Heavy single with search"
            use-input
            :options="heavyFilterInputOptions"
            @filter="heavyFilterInputFn"
            @filter-abort="delayedAbort"
            @focus="onFocus"
            @blur="onBlur"
          />

          <q-btn label="Prefilter Heavy single with 123" @click="() => prefilter('prefilter2')" />

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
const
  stringOptions = [
    'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
  ],
  heavyList = []

for (let i = 0; i <= 100000; i++) {
  heavyList.push(Object.freeze({
    label: 'Opt ' + i,
    value: Math.random()
  }))
}

Object.freeze(heavyList)

const pageSize = 50
const nextPage = 2
const lastPage = Math.ceil(heavyList.length / pageSize)

export default {
  data () {
    return {
      type: 'filled',
      readonly: false,
      disable: false,
      dense: false,
      dark: null,
      optionsDark: false,
      optionsDense: false,
      optionsCover: false,

      simpleFilter: null,
      simpleFilterOptions: null,

      multipleFilter: null,
      multipleFilterOptions: null,

      createInput: null,
      createSingleInput: null,
      createInputOptions: null,

      simpleFilterInput: null,
      simpleFilterInputOptions: null,

      multipleFilterInput: null,
      multipleFilterInputOptions: null,

      minFilterInput: null,
      minFilterInputOptions: null,

      chipFilterInput: null,
      chipFilterInputOptions: null,

      delayedFilterInput: null,
      delayedFilterInputOptions: null,

      modelAdd: null,

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
      ],

      heavyModel: [],
      heavyModelSingle: null,
      heavyFilterInputOptions: null,

      nextPage,

      forceMenu: null
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
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.createInputOptions = stringOptions
          }
          else {
            const needle = val.toLowerCase()
            this.createInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
          }
        })
      }, 500)
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

    multipleFilterFn (val, update) {
      if (this.multipleFilterOptions !== null) {
        update()
        return
      }

      update(() => {
        this.multipleFilterOptions = stringOptions
      })
    },

    multipleFilterInputFn (val, update) {
      if (val === '') {
        update(() => {
          this.multipleFilterInputOptions = stringOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.multipleFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
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

      console.log('DEV delayedFilterInputFn')
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

    heavyFilterInputFn (val, update) {
      console.log(val)
      if (val === '') {
        update(() => {
          this.heavyFilterInputOptions = Object.freeze(heavyList)
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.heavyFilterInputOptions = Object.freeze(heavyList.filter(v => v.label.toLowerCase().indexOf(needle) > -1))
      })
    },

    delayedAbort () {
      console.log('delayed filter aborted')
    },

    prefilter (ref) {
      this.$refs[ref].updateInputValue('Opt 123')
      this.$refs[ref].showPopup()
    },

    onSubmit () {
      this.$q.notify('submitted')
    },

    onBlur (e) {
      console.log('@blur', e)
    },
    onFocus (e) {
      console.log('@focus', e)
    },

    onScroll (evt) {
      const lastIndex = this.heavyListDynamic.length - 1

      if (this.nextPage < lastPage && evt.to === lastIndex) {
        this.nextPage++
        this.$nextTick(() => {
          evt.ref.refresh()
        })
      }
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
        optionsCover: this.optionsCover,
        behavior: this.forceMenu === null
          ? 'default'
          : (this.forceMenu === true ? 'menu' : 'dialog')
      }
    },

    forceMenuLabel () {
      if (this.forceMenu === true) {
        return 'Force menu'
      }

      return this.forceMenu === false ? 'Force dialog' : 'Based on platform'
    },

    heavyListDynamic () {
      return Object.freeze(heavyList.slice(0, pageSize * (this.nextPage - 1)))
    }
  }
}
</script>

<style lang="stylus">
.select-card
  transition .3s background-color
  &:not(.disabled):hover
    background $grey-3
</style>
