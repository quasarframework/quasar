<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Standalone</p>
      <small>Default:</small> <input v-model="username">
      <br>
      <small>Password:</small> <input type="password" v-model="password">

      <p class="caption">Placeholder</p>
      <input placeholder="Placeholder">

      <p class="caption">Stacked Label</p>
      <div class="stacked-label">
        <input class="full-width">
        <label>Stacked Label</label>
      </div>

      <p class="caption">Floating Label</p>
      <div class="floating-label">
        <input required class="full-width">
        <label>Floating Label</label>
      </div>

      <p class="caption">Disabled State</p>
      <input disabled value="You cannot edit me.">

      <p class="caption">Readonly State</p>
      <input readonly value="Read only. Cannot edit.">

      <p class="caption">Error State</p>
      <input class="has-error" value="Invalid content here">

      <p class="caption">Inside of a List</p>
      <div class="list">
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <input class="full-width">
          </div>
        </div>

        <hr>
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <input placeholder="Placeholder" class="full-width">
          </div>
        </div>

        <hr>
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content row items-center wrap">
            <div style="margin-right: 10px;" class="item-label">Label:</div>
            <input class="auto">
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="stacked-label">
              <input class="full-width">
              <label>Stacked Label</label>
            </div>
          </div>
        </div>

        <hr>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <div class="floating-label">
              <input required class="full-width">
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
      username: '',
      password: ''
    }
  }
}
</script>
