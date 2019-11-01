<template>
  <div class="q-layout-padding">
    <div class="bg-black text-white q-pa-sm">
      <q-checkbox v-model="forceMenu" toggle-indeterminate dark :label="forceMenuLabel" /> / ModelS: {{ modelS || 'null' }} / ModelM: {{ modelM || 'null' }}
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-md-4">
        <!-- Single -->
        <q-select
          filled
          v-model="modelS"
          label="Single"
          :options="options"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelS"
          label="Single - useInput"
          :options="options"
          use-input
          input-debounce="0"
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelS"
          label="Single - useInput - hideSelected"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelS"
          label="Single - useInput - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelS"
          label="Single - useInput - hideSelected - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="col-xs-12 col-md-4">
        <!-- Multiple -->
        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple"
          :options="options"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple - useInput"
          :options="options"
          use-input
          input-debounce="0"
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple - useInput - hideSelected"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple - useInput - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple - useInput - hideSelected - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="col-xs-12 col-md-4">
        <!-- Multiple Chips -->
        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips"
          :options="options"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips - useInput"
          :options="options"
          use-input
          input-debounce="0"
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips - useInput - hideSelected"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips - useInput - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips - useInput - hideSelected - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
  </div>
</template>

<script>
const
  options = [
    'Google 1', 'Facebook 1', 'Twitter 1', 'Apple 1', 'Oracle 1',
    'Google 2', 'Facebook 2', 'Twitter 2', 'Apple 2', 'Oracle 2',
    'Google 3', 'Facebook 3', 'Twitter 3', 'Apple 3', 'Oracle 3'
  ]

export default {
  data () {
    return {
      modelS: null,
      modelM: null,
      options,
      forceMenu: null
    }
  },

  computed: {
    behavior () {
      return this.forceMenu === null
        ? 'default'
        : (this.forceMenu === true ? 'menu' : 'dialog')
    },

    forceMenuLabel () {
      if (this.forceMenu === true) {
        return 'Force menu'
      }

      return this.forceMenu === false ? 'Force dialog' : 'Based on platform'
    }
  },

  methods: {
    filterFn (val, update) {
      console.log('filterFn', val)
      if (val === '') {
        update(() => {
          this.options = options
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = options.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
