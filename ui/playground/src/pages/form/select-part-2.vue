<template>
  <q-layout view="lHh LpR fFf" :class="{ 'bg-grey-8 text-white': dark }">
    <q-page-container>
      <q-page padding>
        <form class="q-gutter-y-md" @submit.prevent="onSubmit">
          <q-btn type="submit" label="Submit" />
          <div class="q-gutter-sm">
            <q-radio :dark="dark" v-model="type" val="filled" label="Filled" />
            <q-radio
              :dark="dark"
              v-model="type"
              val="outlined"
              label="Outlined"
            />
            <q-radio
              :dark="dark"
              v-model="type"
              val="standout"
              label="Standout"
            />
            <q-radio
              :dark="dark"
              v-model="type"
              val="standard"
              label="Standard"
            />
            <q-radio
              :dark="dark"
              v-model="type"
              val="borderless"
              label="Borderless"
            />
            <q-checkbox
              v-model="forceMenu"
              toggle-indeterminate
              :label="forceMenuLabel"
            />
          </div>
          <div>
            <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
            <q-toggle :dark="dark" v-model="disable" label="Disable" />
            <q-toggle :dark="dark" v-model="dense" label="Dense" />
            <q-toggle
              :dark="dark"
              v-model="optionsDense"
              label="(Options) Dense"
            />
            <q-toggle
              :dark="dark"
              v-model="optionsCover"
              label="Options cover"
            />
            <q-toggle
              :dark="dark"
              v-model="dark"
              label="Dark"
              :false-value="null"
            />
            <q-toggle
              :dark="dark"
              v-model="optionsDark"
              label="(Options) Dark"
            />
          </div>
          <div class="q-mb-lg q-gutter-sm">
            <q-btn
              label="Set Google"
              @click="setGoogle"
              color="negative"
              outline
            />
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>

            <template v-slot:before
              ><q-icon color="green" name="event"
            /></template>
            <template v-slot:prepend><q-icon name="event" /></template>
            <template v-slot:append><q-icon name="delete" /></template>
            <template v-slot:after
              ><q-icon color="green" name="delete"
            /></template>
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>

            <template v-slot:before
              ><q-icon color="green" name="event"
            /></template>
            <template v-slot:prepend><q-icon name="event" /></template>
            <template v-slot:append><q-icon name="delete" /></template>
            <template v-slot:after
              ><q-icon color="green" name="delete"
            /></template>
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>

            <template v-slot:before
              ><q-icon color="green" name="event"
            /></template>
            <template v-slot:prepend><q-icon name="event" /></template>
            <template v-slot:append><q-icon name="delete" /></template>
            <template v-slot:after
              ><q-icon color="green" name="delete"
            /></template>
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>

            <template v-slot:before
              ><q-icon color="green" name="event"
            /></template>
            <template v-slot:prepend><q-icon name="event" /></template>
            <template v-slot:append><q-icon name="delete" /></template>
            <template v-slot:after
              ><q-icon color="green" name="delete"
            /></template>
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
          x
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
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
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
                  <div class="q-pa-md text-center">Menu</div>
                </q-menu>
              </div>
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
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

          <div class="text-h6">Heavy test (100k options)</div>
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

          <div class="text-h6"
            >Heavy test with dynamic loading (100k options)</div
          >
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

          <div class="text-h6">Heavy test - Variable size (100k options)</div>
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
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      Option - {{ scope.opt.label }} - {{ scope.index }}
                    </q-item-label>

                    <q-item-label class="q-py-sm" v-if="scope.index % 5 === 0">
                      {{ scope.opt.label }}
                    </q-item-label>

                    <q-item-label
                      class="q-py-md text-negative"
                      v-if="scope.index % 3 === 0"
                    >
                      {{ scope.opt.value }}
                    </q-item-label>

                    <q-item-label
                      class="q-py-lg text-positive"
                      v-if="scope.index % 4 === 0"
                    >
                      {{ scope.index }} - {{ scope.opt.label }} -
                      {{ scope.opt.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
              </div>
            </template>
          </q-select>

          <div class="text-h6"
            >Heavy test with dynamic loading - Variable size (100k options)</div
          >
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
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      Option - {{ scope.opt.label }} - {{ scope.index }}
                    </q-item-label>

                    <q-item-label class="q-py-sm" v-if="scope.index % 5 === 0">
                      {{ scope.opt.label }}
                    </q-item-label>

                    <q-item-label
                      class="q-py-md text-negative"
                      v-if="scope.index % 3 === 0"
                    >
                      {{ scope.opt.value }}
                    </q-item-label>

                    <q-item-label
                      class="q-py-lg text-positive"
                      v-if="scope.index % 4 === 0"
                    >
                      {{ scope.index }} - {{ scope.opt.label }} -
                      {{ scope.opt.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
              </div>
            </template>
          </q-select>

          <q-select
            style="width: 300px; margin-left: auto"
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
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      Option - {{ scope.opt.label }} - {{ scope.index }}
                    </q-item-label>

                    <q-item-label class="q-py-sm" v-if="scope.index % 5 === 0">
                      {{ scope.opt.label }}
                    </q-item-label>

                    <q-item-label
                      class="q-py-md text-negative"
                      v-if="scope.index % 3 === 0"
                    >
                      {{ scope.opt.value }}
                    </q-item-label>

                    <q-item-label
                      class="q-py-lg text-positive"
                      v-if="scope.index % 4 === 0"
                    >
                      {{ scope.index }} - {{ scope.opt.label }} -
                      {{ scope.opt.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
              </div>
            </template>
          </q-select>

          <q-select
            style="width: 300px"
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
              <div :key="scope.index">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      Option - {{ scope.opt.label }} - {{ scope.index }}
                    </q-item-label>

                    <q-item-label class="q-py-sm" v-if="scope.index % 5 === 0">
                      {{ scope.opt.label }}
                    </q-item-label>

                    <q-item-label
                      class="q-py-md text-negative"
                      v-if="scope.index % 3 === 0"
                    >
                      {{ scope.opt.value }}
                    </q-item-label>

                    <q-item-label
                      class="q-py-lg text-positive"
                      v-if="scope.index % 4 === 0"
                    >
                      {{ scope.index }} - {{ scope.opt.label }} -
                      {{ scope.opt.value }}
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

          <q-btn
            label="Prefilter Heavy multiple with 123"
            @click="() => prefilter('prefilter1')"
          />

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

          <q-btn
            label="Prefilter Heavy single with 123"
            @click="() => prefilter('prefilter2')"
          />

          <div style="height: 400px">Scroll on purpose</div>
        </form>
        <q-page-sticky
          expand
          position="bottom"
          :class="dark ? 'bg-blue-8 text-white' : 'bg-yellow'"
        >
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

<script setup>
import { useQuasar } from 'quasar'
import { computed, nextTick, ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
  heavyList = []

for (let i = 0; i <= 100_000; i++) {
  heavyList.push(
    Object.freeze({
      label: 'Opt ' + i,
      value: Math.random()
    })
  )
}

Object.freeze(heavyList)

const pageSize = 50
const lastPage = Math.ceil(heavyList.length / pageSize)

const $q = useQuasar()

const type = ref('filled')
const readonly = ref(false)
const disable = ref(false)
const dense = ref(false)
const dark = ref(null)
const optionsDark = ref(false)
const optionsDense = ref(false)
const optionsCover = ref(false)

const simpleFilter = ref(null)
const simpleFilterOptions = ref(null)

const multipleFilter = ref(null)
const multipleFilterOptions = ref(null)

const createInput = ref(null)
const createSingleInput = ref(null)
const createInputOptions = ref(null)

const simpleFilterInput = ref(null)
const simpleFilterInputOptions = ref(null)

const multipleFilterInput = ref(null)
const multipleFilterInputOptions = ref(null)

const minFilterInput = ref(null)
const minFilterInputOptions = ref(null)

const chipFilterInput = ref(null)
const chipFilterInputOptions = ref(null)

const delayedFilterInput = ref(null)
const delayedFilterInputOptions = ref(null)

const modelAdd = ref(null)

const stringSingle = ref('Facebook')
const stringMultiple = ref(['Facebook', 'Twitter'])

const objectSingle = ref({
  label: 'Facebook',
  value: 'Facebook',
  description: 'Social media',
  icon: 'bluetooth'
})
const objectMultiple = ref([
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
])
const objectOptions = ref([
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
])

const heavyModel = ref([])
const heavyModelSingle = ref(null)
const heavyFilterInputOptions = ref(null)

const nextPage = ref(2)

const forceMenu = ref(null)

const prefilter1 = ref(null)
const prefilter2 = ref(null)
const selectRefs = { prefilter1, prefilter2 }

function setGoogle() {
  simpleFilter.value =
    simpleFilterInput.value =
    minFilterInput.value =
    chipFilterInput.value =
    delayedFilterInput.value =
      'Google'
}

function setNull() {
  simpleFilter.value =
    simpleFilterInput.value =
    minFilterInput.value =
    chipFilterInput.value =
    delayedFilterInput.value =
      null
}

function createInputNewValue(val, done) {
  console.log('createInputValue', val)
  if (val.length !== 0) {
    done(val)
  }
}

function createInputFn(val, update) {
  setTimeout(() => {
    update(() => {
      if (val === '') {
        createInputOptions.value = stringOptions
      } else {
        const needle = val.toLowerCase()
        createInputOptions.value = stringOptions.filter(v =>
          v.toLowerCase().includes(needle)
        )
      }
    })
  }, 500)
}

function simpleFilterFn(val, update) {
  if (simpleFilterOptions.value !== null) {
    update()
    return
  }

  update(() => {
    simpleFilterOptions.value = stringOptions
  })
}

function simpleFilterInputFn(val, update) {
  if (val === '') {
    update(() => {
      simpleFilterInputOptions.value = stringOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    simpleFilterInputOptions.value = stringOptions.filter(v =>
      v.toLowerCase().includes(needle)
    )
  })
}

function multipleFilterFn(val, update) {
  if (multipleFilterOptions.value !== null) {
    update()
    return
  }

  update(() => {
    multipleFilterOptions.value = stringOptions
  })
}

function multipleFilterInputFn(val, update) {
  if (val === '') {
    update(() => {
      multipleFilterInputOptions.value = stringOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    multipleFilterInputOptions.value = stringOptions.filter(v =>
      v.toLowerCase().includes(needle)
    )
  })
}

function minFilterInputFn(val, update, abort) {
  if (val.length < 2) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    minFilterInputOptions.value = stringOptions.filter(v =>
      v.toLowerCase().includes(needle)
    )
  })
}

function chipFilterInputFn(val, update) {
  update(() => {
    if (val === '') {
      chipFilterInputOptions.value = stringOptions
    } else {
      const needle = val.toLowerCase()
      chipFilterInputOptions.value = stringOptions.filter(v =>
        v.toLowerCase().includes(needle)
      )
    }
  })
}

function delayedFilterInputFn(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  console.log('DEV delayedFilterInputFn')
  setTimeout(() => {
    update(() => {
      if (val === '') {
        delayedFilterInputOptions.value = stringOptions
      } else {
        const needle = val.toLowerCase()
        delayedFilterInputOptions.value = stringOptions.filter(v =>
          v.toLowerCase().includes(needle)
        )
      }
    })
  }, 2500)
}

function heavyFilterInputFn(val, update) {
  console.log(val)
  if (val === '') {
    update(() => {
      heavyFilterInputOptions.value = Object.freeze(heavyList)
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    heavyFilterInputOptions.value = Object.freeze(
      heavyList.filter(v => v.label.toLowerCase().includes(needle))
    )
  })
}

function delayedAbort() {
  console.log('delayed filter aborted')
}

function prefilter(refName) {
  selectRefs[refName].value.updateInputValue('Opt 123')
  selectRefs[refName].value.showPopup()
}

function onSubmit() {
  $q.notify('submitted')
}

function onBlur(e) {
  console.log('@blur', e)
}
function onFocus(e) {
  console.log('@focus', e)
}

function onScroll(evt) {
  const lastIndex = heavyListDynamic.value.length - 1

  if (nextPage.value < lastPage && evt.to === lastIndex) {
    nextPage.value++
    nextTick(() => {
      evt.ref.refresh()
    })
  }
}

const props = computed(() => ({
  [type.value]: true,
  readonly: readonly.value,
  disable: disable.value,
  dense: dense.value,
  dark: dark.value,
  optionsDense: optionsDense.value,
  optionsDark: optionsDark.value,
  optionsCover: optionsCover.value,
  behavior:
    forceMenu.value === null
      ? 'default'
      : forceMenu.value === true
        ? 'menu'
        : 'dialog'
}))

const forceMenuLabel = computed(() => {
  if (forceMenu.value === true) {
    return 'Force menu'
  }

  return forceMenu.value === false ? 'Force dialog' : 'Based on platform'
})

const heavyListDynamic = computed(() =>
  Object.freeze(heavyList.slice(0, pageSize * (nextPage.value - 1)))
)
</script>

<style lang="sass">
.select-card
  transition: .3s background-color
  &:not(.disabled):hover
    background: $grey-3
</style>
