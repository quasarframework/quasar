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
      <q-chips-input color="secondary" float-label="Float Label" v-model="model" placeholder="Some placeholder" />
      <q-chips-input inverted color="dark" bg-color="amber" float-label="Float Label" v-model="model" placeholder="Some placeholder" />

      <p class="caption">Disabled State</p>
      <q-chips-input v-model="model" disable/>

      <p class="caption">Error State</p>
      <q-chips-input v-model="model" error/>

      <p class="caption">Inside Field</p>
      <q-field
        icon="account_box"
        label="Birthday"
        :count="10"
        helper="Some helper here"
        :label-width="3"
      >
        <q-chips-input float-label="Float Label" v-model="model" :count="10"/>
      </q-field>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="item multiple-lines">
          <q-icon class="item-primary" name="edit" />
          <div class="item-content">
            <q-chips-input v-model="model" placeholder="Type names"/>
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
