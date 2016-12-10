<!--
ISSUES:
  #174 - Floating label won't float if input is disabled (even if it contains value)
  #237 - Floating label doesn't work on input[type=email] when value is not valid e.g...
        <div class="floating-label">
          <input required="required" type="email" class="full-width">
        <label>Email</label></div>

  NB: Valid, disabled, focusded
  NB: textarea, text[type=input, password, ], ...
        color
        date
        datetime
        datetime-local
       *email
        month
        number
        range
        search
        tel
        time
        url
        week
-->

<template>
  <div>

    <div class="layout-padding">

      <p class="caption">With Textboxes...</p>

      <q-float-label label="Text (required)">
        <input required class="full-width">
      </q-float-label>

      <q-float-label label="Email">
        <input type="email" class="full-width">
      </q-float-label>

      <q-float-label label="Password">
        <input type="password" class="full-width">
      </q-float-label>

      <q-float-label label="Email (readonly)">
        <input type="email" readonly="true" value="prof.plum@study.com" class="full-width">
      </q-float-label>

      <q-float-label label="Text (disabled)">
        <input disabled="true" class="full-width">
      </q-float-label>

      <p class="caption">With Textareas...</p>

      <q-float-label label="Textarea">
        <textarea class="full-width"></textarea>
      </q-float-label>

      <q-float-label label="Textarea (readonly)">
        <textarea readonly class="full-width"></textarea>
      </q-float-label>

      <q-float-label label="Textarea (disabled)">
        <textarea disabled class="full-width"></textarea>
      </q-float-label>

  </div>
</template>
<style lang='stylus'>
div.floating-label
  border 2px solid red
  margin 20px 0
</style>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>
