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

      <p class="caption">Disabled State</p>
      <q-chips v-model="model" disable></q-chips>

      <p class="caption">Readonly State</p>
      <q-chips v-model="model" readonly></q-chips>

      <p class="caption">Error State</p>
      <q-chips v-model="model" class="has-error"></q-chips>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
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
