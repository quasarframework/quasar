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

      <p class="caption strong">Floating Labels</p>



      <div class="card">
        <div class="card-title">
          Layouts
        </div>
        <div class="card-content">

          <!-- Layouts -->
          <q-float-label label="Basic Floating Label" >
            <input class="full-width">
          </q-float-label>

          <q-float-label label="Inline Layout" layout="inline">
            <input class="full-width">
          </q-float-label>

          <q-float-label label="Stacked Layout" layout="stacked">
            <input class="full-width">
          </q-float-label>

          <!-- Layouts + Icon -->
          <q-float-label label="Floating Label + Icon" icon="face">
            <input class="full-width">
          </q-float-label>

          <q-float-label label="Inline Layout + Icon" layout="inline" icon="mail_outline">
            <input class="full-width">
          </q-float-label>

          <q-float-label label="Stacked Layout + Icon" layout="stacked" icon="phone">
            <input class="full-width">
          </q-float-label>

        </div>

      </div>



      <div class="card">
        <div class="card-title">
          Input Types
        </div>
        <div class="card-content">

          <q-float-label label="Email" icon="mail_outline">
            <input type="email" class="full-width">
          </q-float-label>

          <q-float-label label="Password" icon="lock">
            <input type="password" class="full-width">
          </q-float-label>

          <q-float-label label="Disabled (Text)">
            <input type="text" disabled class="full-width" icon="">
          </q-float-label>

          <q-float-label label="Readonly (Email)">
            <input type="email" readonly value="professor.plum@study.com" class="full-width">
          </q-float-label>

          <q-float-label label="Required (Text)">
            <input type="text" required class="full-width">
          </q-float-label>

          <q-float-label label="Text (has-error)" icon="build">
            <input type="text" value="The Revolver" class="full-width has-error">
          </q-float-label>


        </div>

      </div>





      <p class="caption">Input Types</p>



      <p class="caption">Textareas</p>

      <q-float-label label="Textarea">
        <textarea class="full-width"></textarea>
      </q-float-label>

      <q-float-label label="Textarea + Icon" icon="comments">
        <textarea rows="5" class="full-width">If you end your movement in a room, you get to make a suggestion. To do this, name a suspect, a murder weapon, and the room you just entered. For example, if you just entered the lounge, you might say, "I suggest the crime was committed by Colonel Mustard, in the lounge, with a dagger." The named suspect and murder weapon are both moved into your current room.</textarea>
      </q-float-label>


      <q-float-label label="Textarea + Icon + Dense (has-error)" icon="fingerprint" :dense="true">
        <textarea rows="5" class="full-width has-error">The player to your left must disprove your suggestion by showing you one card from her hand that matches your suggestion. If that player can't do so, the player to her left must disprove your suggestion by showing you one card from his hand. This responsibility passes clockwise until someone shows you a card, or until all players have passed.</textarea>
      </q-float-label>

      <q-float-label label="Textarea (readonly)">
        <textarea rows="4" readonly class="full-width">If someone shows you a card, you should cross it off on your detective notebook as a possibility. Any cards you hold should also be crossed off as possibilities. Don't let other players see your notebook.</textarea>
      </q-float-label>

      <q-float-label label="Textarea (disabled)">
        <textarea rows="4" disabled class="full-width">If you think you have solved the case by eliminating all the false possibilities and have not just had your suggestion disproved this turn, you can end your turn by making an accusation. Announce that you are making an accusation, and state your final guess of the murderer, the murder weapon, and the murder location.</textarea>
      </q-float-label>

  </div>
</template>
<style lang='stylus'>

$form-active-color = #027be3

$label-nudge-top ?= 2px
$label-nudge-left ?= 0

textarea:focus
  transition none !important
  /* ^ existing transition undesirable with user drag-resize */

.fl-container

  position relative
  display inline-block
  box-sizing border-box
  width 100%
  min-height 72px
  background #777
  margin-bottom 5px

  & > i
    position absolute
    font-size 24px
    padding 12px
    top 12px
    left 0
    transition color .3s

  & > .fl-inner
    display inline-block
    box-sizing border-box
    width 100%
    padding-top 12px

    & > input
      padding-top 0 // 1.8rem

    & > textarea
      margin-top 0 // 1.8rem

    & > label
      padding-top $label-nudge-top
      padding-left $label-nudge-left
      position absolute
      pointer-events none
      color rgba(0, 0, 0, .54)
      transform-origin left top
      transition transform .15s ease-in-out, color .3s, opacity .3s

// Layout Modifiers -------------------------

// With Icon
&.fl-icon
  & > .fl-inner
    margin-left 48px

// With Dense
&.fl-dense
  & > .fl-inner
    & > label
      top 1.5rem
    & > input
      padding-top 1.45rem
      margin-bottom 10px
    & > textarea
      margin-top 1.45rem
      margin-bottom 6px

// Label Mixins -------------------------

// Label above input
&.fl-layout-stacked,
&.fl-layout-floating.fl-active
  & > .fl-inner > label
    transform translateY(-16px) scale(.8)

// Label vanished
&.fl-layout-inline.fl-active
  & > .fl-inner > label
    opacity 0
    transform-origin left 50%
    transform scaleY(-1)
    color $form-active-color

// Label invisible

// Label has focus
&.fl-focus
  & > .fl-inner > label
  & i
    color $form-active-color


</style>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>

