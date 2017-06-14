<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{checked}}</em></span>
      </div>

      <p class="caption">Standalone</p>
      <q-checkbox v-model="checked" checked-icon="sentiment very satisfied" unchecked-icon="sentiment very dissatisfied" />
      <q-checkbox v-model="checked" checked-icon="visibility" unchecked-icon="visibility_off" style="margin-left: 50px" />

      <br><br>
      <q-checkbox @change="onChange" v-model="checked" />
      <br><br>
      <q-checkbox v-model="checked" label="Label" />
      <br><br>

      <q-checkbox v-model="checked" label="Checkbox Label" />
      <br><br>
      <q-checkbox v-model="checked" color="teal" label="Checkbox Label" />
      <br><br>
      <q-checkbox v-model="checked" color="orange" label="Checkbox Label" />
      <br><br>
      <q-checkbox v-model="checked" color="dark" label="Checkbox Label" />

      <p class="caption">Label on the left side</p>
      <q-checkbox v-model="checked" color="teal" left-label label="Checkbox Label" />
      <br><br>
      <q-checkbox v-model="checked" color="orange" left-label label="Checkbox Label" />
      <br><br>
      <q-checkbox v-model="checked" color="dark" left-label label="Checkbox Label" />

      <p class="caption">Array Model</p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{selection}}</em></span>
      </div>

      <q-checkbox @change="onChange" v-model="selection" val="one" label="One" />
      <br><br>
      <q-checkbox @change="onChange" v-model="selection" val="two" label="Two" />
      <br><br>
      <q-checkbox @change="onChange" v-model="selection" val="three" label="Three" />

      <p class="caption">Disabled State</p>
      <q-checkbox v-model="checked" disable label="Disabled Checkbox" />

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-option-group
          inline
          type="checkbox"
          color="secondary"
          v-model="group"
          @change="onChange"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3' },
            { label: 'Option 4', value: 'op4' }
          ]"
        />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-option-group
          type="checkbox"
          v-model="group"
          @focus="onFocus"
          @blur="onBlur"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3' },
            { label: 'Option 4', value: 'op4' }
          ]"
        />
      </q-field>

      <p class="caption">Inside of a List</p>
      <q-list link>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox @change="onChange" v-model="checked"></q-checkbox>
          </q-item-side>
          <q-item-main>
            <q-item-tile title>Notification</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox @change="onChange" v-model="checked"></q-checkbox>
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Notification</q-item-tile>
            <q-item-tile sublabel>Allow notification</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item tag="label">
          <q-item-side>
            <q-checkbox @change="onChange" v-model="checked"></q-checkbox>
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Notification</q-item-tile>
            <q-item-tile sublabel>Allow notifications Allow notifications Allow notifications Allow notifications Allow notifications</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checked: true,
      group: ['op2'],
      selection: ['one', 'two', 'three']
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', val)
    },
    onFocus () {
      console.log('focused')
    },
    onBlur () {
      console.log('blur')
    }
  }
}
</script>
