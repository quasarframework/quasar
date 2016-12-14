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
$grey = #9e9e9e
$grey-1 = #fafafa
$grey-2 = #f5f5f5
$grey-3 = #eeeeee
$grey-4 = #e0e0e0
$grey-5 = #bdbdbd
$grey-6 = #9e9e9e
$grey-7 = #757575
$grey-8 = #616161
$grey-9 = #424242
$grey-10 = #212121
$grey-11 = #f5f5f5
$grey-12 = #eeeeee
$grey-13 = #bdbdbd
$grey-14 = #616161

$form-darker-color    ?= $grey-5
$form-lighter-color   ?= $grey-3
$form-active-color    ?= $primary
$form-border          ?= 3px solid $form-darker-color
$form-border-radius   ?= $generic-border-radius
$form-shadow          ?= 0 1px 3px 1px rgba(0, 0, 0, .4)


$textfield-border-size        ?= 2px
$textfield-border-style       ?= solid
$textfield-border-color       ?= $form-lighter-color
$textfield-focus-border-color ?= $form-active-color
$textfield-font-size          ?= .9rem
$label-font-size              ?= $textfield-font-size
$textfield-font-size          ?= .9rem

$textfield-padding-horizontal ?= 0
$textfield-padding-vertical   ?= 8px

$caret-color                  ?= $grey-9

input, textarea, .textfield
  &:not(.no-style)
    background none
    font-size $textfield-font-size
    max-width 100%
    margin-bottom 2px
    padding $textfield-padding-vertical $textfield-padding-horizontal
    border 0
    outline 0
    transition all .3s
    border-bottom $textfield-border-size $textfield-border-style $textfield-border-color
    &:focus, &:hover, .active
      border-bottom $textfield-border-size $textfield-border-style $textfield-focus-border-color
    &[disabled], &.disabled
      border-bottom-color darken($form-darker-color, 20%)
    &[disabled], &.disabled, &[readonly], &.readonly
      border-bottom-style dotted
    &.has-error
      border-bottom $textfield-border-size $textfield-border-style $has-error !important

label
  font-size $label-font-size

.stacked-label, .floating-label
  position relative
  display inline-block
  width 100%
  label
    position absolute
    pointer-events none
    top 0
    left 0
    transform-origin left top
    color rgba(0, 0, 0, .54)

.stacked-label
  label
    display block
    transform scale(.8)
  input
    padding-top 1.4rem
  textarea
    margin-top 1.4rem
  input:focus + label, textarea:focus + label
    color $form-active-color

.floating-label
  label
    bottom $textfield-padding-vertical
    transition transform .15s ease-in-out, color .3s
  input + label, textarea + label
    transform translateY(1.7rem) scale(1)
  input
    padding-top 1.4rem
  textarea
    margin-top 1.4rem
&.label-active
  input ~ label, textarea ~ label
    transform translateY(0) scale(.8)
&.label-focus
  input ~ label, textarea ~ label
    color $form-active-color



// ^^--- textfield.mat.styl

$form-active-color = #027be3

$label-nudge-top ?= 0
$label-nudge-left ?= 0



.fl-container
  position relative
  display inline-block
  box-sizing border-box
  width 100%
  min-height 72px
  border 1px solid blue
  margin-bottom 5px


  & > label
    padding-top $label-nudge-top
    padding-left $label-nudge-left
    position absolute
    pointer-events none
    color rgba(0, 0, 0, .54)
    top 1.8rem
    left 0
    transform-origin left top
    transition transform .15s ease-in-out, color .3s, opacity .3s


  & > input
    padding-top 1.8rem
    margin-bottom 17px

  & > textarea
    margin-top 1.8rem
    margin-bottom 13px

  & > span.fl-error
    font-size 12px

  & > i
    position absolute
    font-size 24px
    padding 12px
    top 12px
    left 0
    transition color .3s


// Layout Modifiers -------------------------

// With Icon
&.fl-icon
  padding-left 48px
  & > label
    left 48px

// With Dense
&.fl-dense
  & > label
    top 1.5rem
  & > input
    padding-top 1.45rem
    margin-bottom 10px
  & > textarea
    margin-top 1.45rem
    margin-bottom 6px

// Has focus
&.fl-focus
  & > label
  & >i
    color $form-active-color


// Label Position Mixins -------------------------

// Label above input
&.fl-layout-stacked,
&.fl-layout-floating.fl-active
  > label
    transform translateY(-16px) scale(.8)

// Label vanished
&.fl-layout-inline.fl-active
  > label
    opacity 0
    transform-origin left 50%
    transform scaleY(-1)
    color $form-active-color

// Label not displayed
&.fl-layout-nolabel
  > label
    display none


</style>
      padding-top 0 // 1.8rem
<script>
export default {
  data () {
    return {
    }
  }
}
</script>

