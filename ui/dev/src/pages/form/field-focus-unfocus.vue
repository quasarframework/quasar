<template>
  <div class="q-pa-md column q-gutter-y-lg">
    <div class="q-pa-md bg-grey-1">
      <div class="q-gutter-md row items-start">
        <q-btn label="button"></q-btn>

        <q-input
          v-model="password"
          filled
          type="password"
          hint="Password"
        ></q-input>

        <q-select
          filled
          ref="select"
          v-model="value"
          @add="resetInputText"
          @filter="onFilterOptions"
          :options="options"
          stack-label
          use-input
          input-debounce="0"
          multiple
          label="Multi Select"
          class="ml-select"
          popup-content-class="ml-select-popup"
        >
          <template v-slot:selected-item="scope">
            <div
              @click.stop
              style="display: inline-block; padding: 4px 24px 4px 8px; width: auto; position: relative;cursor: default;"
              class="bg-primary text-white rounded-borders q-mr-xs q-mb-xs rounded non-selectable"
            >
              <span>{{ scope.opt.label }}</span>
              <q-icon
                name="close"
                @click.stop="scope.removeAtIndex(scope.index)"
                style="font-size: 18px; opacity:0.5; position: absolute; right: 4px; top: calc(50% - 9px)"
                class="cursor-pointer"
              />
            </div>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              class="q-py-none"
            >
              <q-item-section>
                <q-item-label v-html="scope.opt.label"></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :value="value.some(opt => opt.value === scope.opt.value)"
                  color="primary"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          v-model="password"
          filled
          :type="isPwd ? 'password' : 'text'"
          hint="Password with toggle"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            ></q-icon>
          </template>
        </q-input>

        <q-input
          v-model="email"
          filled
          type="email"
          hint="Email"
        ></q-input>

        <q-input
          v-model="search"
          filled
          type="search"
          hint="Search"
        >
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>

        <q-input
          v-model="tel"
          filled
          type="tel"
          hint="Telephone number"
        ></q-input>

        <q-input
          v-model="url"
          filled
          type="url"
          hint="URL"
        ></q-input>

        <q-input
          v-model="time"
          filled
          type="time"
          hint="Native time"
        ></q-input>

        <q-input
          v-model="date"
          filled
          type="date"
          hint="Native date"
        ></q-input>

        <q-input
          v-model="password"
          filled
        ></q-input>

        <q-toggle
          :value="false"
          label="Toggle"
          color="primary"
        />
      </div>
    </div>

    <div class="q-pa-md bg-grey-1">
      <div class="q-gutter-md row items-start">
        <q-input
          v-model="password"
          filled
          :rules="[val => !!val || 'Field is required']"
          type="password"
          hint="Password"
        ></q-input>

        <q-select
          filled
          ref="select"
          v-model="value"
          @add="resetInputText"
          @filter="onFilterOptions"
          :options="options"
          stack-label
          use-input
          input-debounce="0"
          multiple
          label="Multi Select"
          class="ml-select"
          :rules="[val => val.length > 0 || 'Field is required']"
          popup-content-class="ml-select-popup"
        >
          <template v-slot:selected-item="scope">
            <div
              @click.stop
              style="display: inline-block; padding: 4px 24px 4px 8px; width: auto; position: relative;cursor: default;"
              class="bg-primary text-white rounded-borders q-mr-xs q-mb-xs rounded non-selectable"
            >
              <span>{{ scope.opt.label }}</span>
              <q-icon
                name="close"
                @click.stop="scope.removeAtIndex(scope.index)"
                style="font-size: 18px; opacity:0.5; position: absolute; right: 4px; top: calc(50% - 9px)"
                class="cursor-pointer"
              />
            </div>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              class="q-py-none"
            >
              <q-item-section>
                <q-item-label v-html="scope.opt.label"></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :value="value.some(opt => opt.value === scope.opt.value)"
                  color="primary"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          v-model="password"
          filled
          :rules="[val => !!val || 'Field is required']"
          :type="isPwd ? 'password' : 'text'"
          hint="Password with toggle"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            ></q-icon>
          </template>
        </q-input>

        <q-input
          v-model="email"
          :rules="[val => !!val || 'Field is required']"
          filled
          type="email"
          hint="Email"
        ></q-input>

        <q-input
          v-model="search"
          :rules="[val => !!val || 'Field is required']"
          filled
          type="search"
          hint="Search"
        >
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>

        <q-input
          v-model="tel"
          filled
          :rules="[val => !!val || 'Field is required']"
          type="tel"
          hint="Telephone number"
        ></q-input>

        <q-input
          v-model="url"
          filled
          type="url"
          :rules="[val => !!val || 'Field is required']"
          hint="URL"
        ></q-input>

        <q-input
          v-model="time"
          filled
          type="time"
          :rules="[val => !!val || 'Field is required']"
          hint="Native time"
        ></q-input>

        <q-input
          v-model="date"
          filled
          type="date"
          :rules="[val => !!val || 'Field is required']"
          hint="Native date"
        ></q-input>

        <q-input
          v-model="password"
          :rules="[val => !!val || 'Field is required']"
          filled
        ></q-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      password: '',
      isPwd: true,

      email: '',
      search: '',
      tel: '',
      url: '',
      time: '',
      date: '',
      value: [],
      options: [
        {
          label: 'Google',
          value: '1'
        },
        {
          label: 'Facebook',
          value: '2'
        },
        {
          label: 'Twitter',
          value: '3'
        },
        {
          label: 'Apple',
          value: '4'
        },
        {
          label: 'Oracle',
          value: '5'
        }
      ]
    }
  },
  methods: {
    onFilterOptions (val, update) {
      if (val === '') {
        update(() => {
          this.filteredOptions = this.options
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.filteredOptions = this.options.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    resetInputText () {
      this.$refs.select.updateInputValue('')
    }
  }
}
</script>

<style lang="sass">
.q-btn:focus,
.q-toggle:focus,
.q-field--filled.q-field--float.q-field--focused .q-field__control
  box-shadow: 0 0 0 4px #fff, 0 0 0 6px var(--q-color-primary)
</style>
