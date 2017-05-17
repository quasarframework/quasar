<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model:
      </div>
      <span class="thin-paragraph">[{{ model.length ? model.join(', ') : '*empty*' }}]</span>

      <br>
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on Chips Textbox below to start adding Chips.
      </p>
      <q-chips v-model="model"></q-chips>
      <q-chips chip-classes="bg-primary text-white" v-model="model"></q-chips>

      <p class="caption">Disabled State</p>
      <q-chips v-model="model" disable></q-chips>

      <p class="caption">Readonly State</p>
      <q-chips v-model="model" readonly></q-chips>

      <p class="caption">Error State</p>
      <q-chips v-model="model" error></q-chips>

      <p class="caption">Inside Field</p>
      <q-field
        icon="account_box"
        label="Birthday"
        helper="Some helper here"
        :label-width="3"
      >
        <q-chips v-model="model" :count="10"></q-chips>
      </q-field>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="item multiple-lines">
          <q-icon class="item-primary" name="edit" />
          <div class="item-content">
            <q-chips v-model="model" placeholder="Type names"></q-chips>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: ['Joe']
    }
  }
}
</script>
