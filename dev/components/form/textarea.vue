<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Standalone</p>
      <textarea v-model="model"></textarea>

      <p class="caption">Placeholder</p>
      <textarea placeholder="Placeholder"></textarea>

      <p class="caption">Stacked Label</p>
      <div class="stacked-label">
        <textarea class="full-width"></textarea>
        <label>Stacked Label</label>
      </div>

      <p class="caption">Floating Label</p>
      <div class="floating-label">
        <textarea required class="full-width"></textarea>
        <label>Floating Label</label>
      </div>

      <p class="caption">Disabled State</p>
      <textarea disabled>I'm disabled. You cannot edit me.</textarea>

      <p class="caption">Readonly State</p>
      <textarea readonly>Read only. Cannot edit.</textarea>

      <p class="caption">Error State</p>
      <textarea class="has-error">Invalid content here.</textarea>

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <textarea class="full-width"></textarea>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div style="margin-right: 10px;" class="item-label">Label:</div>
            <textarea class="full-width"></textarea>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="stacked-label">
              <textarea class="full-width"></textarea>
              <label>Stacked Label</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="floating-label">
              <textarea required class="full-width"></textarea>
              <label>Floating Label</label>
            </div>
          </div>
        </div>
      </div>

      <p class="caption">Textbox and Textarea with No Borders</p>
      <div class="list">
        <div class="item multiple-lines item-delimiter">
          <div class="item-content">
            <input class="full-width no-border" value="Textbox here with no border and full width.">
          </div>
        </div>
        <div class="item multiple-lines item-delimiter">
          <div class="item-content">
            <textarea class="full-width no-border">Textarea here with no border and full width.</textarea>
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
      model: ''
    }
  }
}
</script>
