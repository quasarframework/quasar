<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{checked}}</em></span>
      </div>

      <p class="caption">Standalone</p>
      <q-toggle v-model="checked" />
      <br><br>
      <q-toggle v-model="checked" label="Toggle Label" />
      <br><br>
      <q-toggle v-model="checked" color="orange" label="Toggle Label" />
      <br><br>
      <q-toggle v-model="checked" color="teal" label="Toggle Label" />
      <br><br>
      <q-toggle v-model="checked" color="dark" label="Toggle Label" />

      <p class="caption">Label on the left side</p>
      <q-toggle v-model="checked" color="orange" left-label label="Toggle Label" />
      <br><br>
      <q-toggle v-model="checked" color="teal" left-label label="Toggle Label" />
      <br><br>
      <q-toggle v-model="checked" color="dark" left-label label="Toggle Label" />

      <p class="caption">Array Model</p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{selection}}</em></span>
      </div>

      <q-toggle v-model="selection" val="one" label="One" />
      <br><br>
      <q-toggle v-model="selection" val="two" label="Two" />
      <br><br>
      <q-toggle v-model="selection" val="three" label="Three" />

      <p class="caption">With Icon</p>
      <q-toggle v-model="checked" icon="alarm" label="Toggle Label" />
      <br><br>
      <q-toggle v-model="checked" icon="mail" color="secondary" label="Toggle Label" />
      <br><br>
      <q-toggle v-model="checked" unchecked-icon="visibility_off" checked-icon="visibility" color="red" label="Toggle Label" />

      <p class="caption">Disabled State</p>
      <q-toggle v-model="checked" disable label="Toggle Label" />

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-option-group
          inline
          type="toggle"
          v-model="group"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3', color: 'secondary' },
            { label: 'Option 4', value: 'op4', color: 'tertiary' }
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
