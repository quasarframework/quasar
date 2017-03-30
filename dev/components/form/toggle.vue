<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{checked}}</em></span>
      </div>

      <p class="caption">Standalone</p>
      <div class="column group">
        <q-toggle v-model="checked" style="margin-bottom: 15px"></q-toggle>
        <label>
          <q-toggle v-model="checked"></q-toggle>
          Toggle Label
        </label>

        <label>
          <q-toggle v-model="checked" class="orange"></q-toggle>
          Toggle Label
        </label>

        <label>
          <q-toggle v-model="checked" class="teal"></q-toggle>
          Toggle Label
        </label>

        <label>
          <q-toggle v-model="checked" class="dark"></q-toggle>
          Toggle Label
        </label>
      </div>

      <p class="caption">Array Model</p>
      <div class="column group">
        <div class="label bg-secondary text-white">
          Model <span class="right-detail"><em>{{selection}}</em></span>
        </div>

        <label>
          <q-toggle v-model="selection" val="one"></q-toggle>
          One
        </label>
        <label>
          <q-toggle v-model="selection" val="two"></q-toggle>
          Two
        </label>
        <label>
          <q-toggle v-model="selection" val="three"></q-toggle>
          Three
        </label>
      </div>

      <p class="caption">With Icon</p>
      <div class="column group">
        <label>
          <q-toggle v-model="checked" icon="alarm"></q-toggle>
          Toggle Label
        </label>
        <label>
          <q-toggle v-model="checked" icon="mail" class="secondary"></q-toggle>
          Toggle Label
        </label>
      </div>

      <p class="caption">Disabled State</p>
      <label>
        <q-toggle v-model="checked" disable></q-toggle>
        Toggle Label
      </label>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-input-group
          inline
          type="toggle"
          v-model="group"
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
        <q-input-group
          type="toggle"
          v-model="group"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3' },
            { label: 'Option 4', value: 'op4' }
          ]"
        />
      </q-field>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <label class="item">
          <div class="item-content has-secondary">
            Events and reminders
          </div>
          <div class="item-secondary">
            <q-toggle v-model="checked"></q-toggle>
          </div>
        </label>
        <label class="item two-lines">
          <div class="item-content has-secondary">
            <div>Events and reminders</div>
            <div>Lorem ipsum</div>
          </div>
          <div class="item-secondary">
            <q-toggle v-model="checked" class="purple"></q-toggle>
          </div>
        </label>
        <label class="item three-lines">
          <div class="item-content has-secondary">
            <div>Events and reminders</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </div>
          <div class="item-secondary">
            <q-toggle v-model="checked" class="red"></q-toggle>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checked: true,
      group: ['op3'],
      selection: ['two']
    }
  }
}
</script>
