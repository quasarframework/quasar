<template>
  <div class="q-layout-padding">
    <div class="q-gutter-y-sm" style="max-width: 300px">
      <q-toggle
        v-model="behavior"
        toggle-indeterminate
        false-value="menu"
        true-value="dialog"
        :indeterminate-value="void 0"
        :label="behavior || 'auto'"
      />

      <q-input
        v-model="name"
        label="Name"
        autocomplete="name"
      />

      <q-select
        v-model="city"
        label="City"
        :options="cityOptions"
        autocomplete="address-level2"
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
        v-model="country"
        label="Country"
        :options="filteredCountryOptions"
        use-input
        @filter="filterCountryOptions"
        autocomplete="country"
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

      <pre>{{name}} / {{city}} / {{country}}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      name: '',
      city: null,
      country: null,
      cityOptions: [
        { value: 'Bucuresti', label: 'Bucuresti' },
        { value: 'Bucharest', label: 'Bucharest' },
        { value: 'London', label: 'London' }
      ],
      countryOptions: [
        { value: 'GB', label: 'United Kingdom' },
        { value: 'RO', label: 'Romania' },
        { value: 'RO', label: 'RO' }
      ],
      filteredCountryOptions: [],
      behavior: 'menu'
    }
  },

  methods: {
    filterCountryOptions (val, update) {
      update(() => {
        if (val === '') {
          this.filteredCountryOptions = this.countryOptions
        }
        else {
          const needle = val.toLowerCase()
          this.filteredCountryOptions = this.countryOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        }
      })
    }
  }
}
</script>
