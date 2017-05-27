<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{option}}</em></span>
      </div>

      <p class="caption">Standalone</p>
      <q-radio v-model="option" val="opt1" />
      <br><br>
      <q-radio v-model="option" val="opt2" label="Option 2" />
      <br><br>
      <q-radio v-model="option" val="opt3" color="teal" label="Option 3" />
      <br><br>
      <q-radio v-model="option" val="opt4" color="orange" label="Option 4" />

      <p class="caption">Label on the left side</p>
      <q-radio v-model="option" val="opt2" left-label label="Option 2" />
      <br><br>
      <q-radio v-model="option" val="opt3" left-label color="teal" label="Option 3" />
      <br><br>
      <q-radio v-model="option" val="opt4" left-label color="orange" label="Option 4" />

      <p class="caption">Disabled State</p>
      <q-radio v-model="option" val="opt1" disable label="Disabled Option 1" />

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-option-group
          type="radio"
          v-model="group"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3', color: 'secondary' },
            { label: 'Option 4', value: 'op4', color: 'amber' }
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
          inline
          v-model="group"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3', color: 'secondary' },
            { label: 'Option 4', value: 'op4', color: 'amber' }
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
          v-model="group"
          inline
          :options="[
            { label: 'Option 2', value: 'op2' },
            { label: 'Option 3', value: 'op3', color: 'secondary' },
            { label: 'Option 4', value: 'op4', color: 'amber' }
          ]"
        />
      </q-field>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <label class="item">
          <div class="item-primary">
            <q-radio v-model="option" val="opt1"></q-radio>
          </div>
          <div class="item-content">
            Option 1
          </div>
        </label>
        <label class="item">
          <div class="item-primary">
            <q-radio v-model="option" val="opt2"></q-radio>
          </div>
          <div class="item-content text">
            <div>Option 2</div>
            <div>Allows notifications</div>
          </div>
        </label>
        <label class="item">
          <div class="item-primary">
            <q-radio v-model="option" val="opt3"></q-radio>
          </div>
          <div class="item-content text">
            <div>Option 3</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
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
      option: 'opt1',
      group: 'op3'
    }
  }
}
</script>

<style>
</style>
