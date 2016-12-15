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
        <div class="card-title text-white bg-primary">
          Layouts
        </div>
        <div class="card-content">


          <hr />
        <div class="list">


          <q-float-label label="Email" icon="edit" validate>
            <input type="email">
          </q-float-label>

          <hr />

<p>Quasar's original (item two-line):</p>
<div class="item two-lines" style="background: #f8f8f8;"><i class="item-primary">edit</i> <div class="item-content"><input placeholder="Placeholder" class="full-width"></div></div>
<hr />

        <!-- Layouts -->
          <q-float-label label="Basic 'Floating' Label Layout" icon="email">
            <input>
          </q-float-label>

          <hr />

          <q-float-label label="Floating Layout and Grow" layout="inline" width="grow" icon="email">
            <input>
          </q-float-label>


          </div>

          <q-float-label label="Placeholder Layout" layout="placeholder" width="grow">
            <input>
          </q-float-label>

          <q-float-label label="Stacked Layout" layout="stacked" width="grow">
            <input>
          </q-float-label>

          <q-float-label label="Inline Layout" layout="inline" width="grow">
            <input class="full-width">
          </q-float-label>

          <hr />



        <p>Inline Label</p>
        <div class="item multiple-lines fxl-container">
          <i class="item-primary">edit</i>
          <div class="item-content row items-center wrap">
            <div class="item-label" style="background: pink; flex-grow: 1;margin-right: 10px;">Label:</div>
            <div class="q-field-layout" style="width: 200px;">
              <input>
            </div>
          </div>
        </div>

        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content row items-center wrap">
            <div class="item-label" style="background: pink; flex-grow: 1;margin-right: 10px;">Label:</div>
            <div class="q-field-layout">
              <input>
            </div>
          </div>
        </div>

        <p>Inline Label</p>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
            <div class="item-content row items-center wrap">
              <div class="auto item-label" style="margin-right: 10px;">Label:</div>
              <input>
            </div>
        </div>



        <p>Normal Item</p>
        <div class="item two-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <input placeholder="Placeholder" class="full-width">
          </div>
        </div>
        <div class="item multiple-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <input placeholder="Placeholder" class="full-width">
          </div>
        </div>


        <p>Floating Label</p>
        <div class="item three-lines">
          <i class="item-primary">edit</i>
          <div class="item-content">
             <div class="9te">
              <input required="required" class="full-width">
              <label>Floating Label</label>
            </div>
          </div>
        </div>


        <p>UMLTIMA Label</p>
        <div class="item multiple-lines q-field-container">
          <i class="item-primary">edit</i>
          <div class="item-content">
            <label
            <div class="q-field-layout"
              <input required="required" class="full-width">
              <label>Floating Label</label>
            </div>
          </div>
        </div>





<div class="item multiple-lines q-field-container">
  <i class="item-primary">edit</i>
  <div class="item-content">
  <div class="floating-label">
    <textarea required="required" class="full-width"></textarea>
    <label>Floating Label</label>
  </div>
</div>
</div>


<div class="item multiple-lines">
  <i class="item-primary">edit</i>
  <div class="item-content row items-center wrap">
    <div class="item-label" style="margin-right: 10px;">

      Label:</div>
     <input class="auto">
    </div></div>
          <!-- Layouts -->
          <q-float-label label="Basic 'Floating' Label Layout">
            <input>
          </q-float-label>

          <q-float-label label="Floating Layout and Grow" width="grow">
            <input>
          </q-float-label>



          <q-float-label label="Placeholder Layout" layout="placeholder" width="grow">
            <input>
          </q-float-label>

          <q-float-label label="Stacked Layout" layout="stacked" width="grow">
            <input>
          </q-float-label>

          <q-float-label label="Inline Layout" layout="inline" width="grow">
            <input class="full-width">
          </q-float-label>

          <q-float-label label="Inline Layout + Grow Width" layout="inline" width="grow">
            <input class="full-width">
          </q-float-label>

          <q-float-label label="Floating + Custom Layout" layout="floating custom" width="grow">
            <input class="full-width">
          </q-float-label>

          <!-- Layout Variations -->
          <q-float-label label="Basic Layout + Icon" icon="face">
            <input class="full-width">
          </q-float-label>

          <q-float-label label="No Label, just Icon" layout="nolabel" width="full-width">
            <input value="No Label, just Icon. :-|">
          </q-float-label>

          <q-float-label label="No Label, just Icon" layout="nolabel" width="full-width">
            <input value="No Label OR Icon.">
          </q-float-label>

          <q-float-label label="Placeholder Layout + Icon" layout="placeholder" icon="mail_outline">
            <input class="full-width">
          </q-float-label>

          <q-float-label label="Stacked Layout + Icon" layout="stacked" icon="phone">
            <input class="full-width">
          </q-float-label>

        </div>

      </div>

      <div class="card">
        <div class="card-title">
          Validation
        </div>
        <div class="card-content">

          <q-float-label label="Email - No Validation" icon="mail_outline">
            <input type="email">
          </q-float-label>

          <q-float-label label="Email - Default Validation" con="mail_outline" validate>
            <input type="email">
          </q-float-label>

          <q-float-label label="Email - Lazy Validation" icon="mail_outline" validate validate-lazy>
            <input type="email">
          </q-float-label>

          <q-float-label label="Email - Custom Validation Message" icon="mail_outline" validate validate-msg="That ain't no email address, pal!">
            <input type="email">
          </q-float-label>

        </div>
      </div>



      <div class="card">
        <div class="card-title">
          Input Types
        </div>
        <div class="card-content">

          <q-float-label label="Email" icon="mail_outline">
            <input type="email">
          </q-float-label>

          <q-float-label label="Email" icon="mail_outline" validate>
            <input type="email">
          </q-float-label>

          <q-float-label label="Email" icon="mail_outline" validate>
            <input type="email">
          </q-float-label>

          <q-float-label label="Email" icon="mail_outline" validate>
            <input type="email">
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
            <input type="text" value="The Revolver" class="full-width" pattern=".*(spanner|wrench).*">
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

$primary = #027be3


$positive  ?= #21BA45
$negative  ?= #DB2828
$info      ?= #31CCEC
$warning   ?= #F2C037

$white     ?= #fff
$light     ?= #f4f4f4
$dark      ?= #333
$faded     ?= #777

$has-error ?= $negative

$form-darker-color    ?= $grey-5
$form-lighter-color   ?= $grey-3
$form-active-color    ?= $primary
$form-border          ?= 3px solid $form-darker-color
$form-border-radius   ?= $generic-border-radius
$form-shadow          ?= 0 1px 3px 1px rgba(0, 0, 0, .4)


$textfield-border-size        ?= 1px
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
    // &:focus, &:hover, .active
    //  border-bottom $textfield-border-size $textfield-border-style $textfield-focus-border-color
    &[disabled], &.disabled
      border-bottom-color darken($form-darker-color, 20%)
    &[disabled], &.disabled, &[readonly], &.readonly
      border-bottom-style dotted
    &.has-error
      border-bottom $textfield-border-size $textfield-border-style $has-error !important

label
  font-size $label-font-size
/*
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

*/

// ^^--- textfield.mat.styl


$label-nudge-top ?= 0
$label-nudge-left ?= 0

.q-field .q-float-label > textarea:active
  transition none // Prevent animation while user drag-resize

  &:not(.two-lines):not(.three-lines):not(.multiple-lines) > .item-content > div:not(.stacked-label):not(.floating-label):not([class^='q-'])
    overflow hidden
    text-overflow ellipsis
    white-space nowrap



.q-field
  height auto
  min-height 72px
  & .item-content
    padding-top 20px
    padding-bottom 8px
    overflow-y visible
  & > i.item-primary
    top 14px
    transform-origin 50% 50%
    transition color .3s

  & .q-float-label > label,
  & > label
    transition transform .15s ease-in-out, color .3s, opacity .3s

  & .q-float-label > label
    position absolute
    pointer-events none
    top 8px
    left 0
    transform-origin left top
    color rgba(0, 0, 0, .54)

  & > label
    position relative
    margin-right 4px

.q-field
  height auto
  background #f8f8f8
  margin-bottom 1px
 /* display inline-flex
  position relative
  box-sizing border-box
  min-height 72px*/

 /* background lemonchiffon
  border 1px solid blue
  margin-bottom 5px*/

  & .q-float-label
    position relative
    width 100%

    & > input
      width 100%


    & > textarea
      width 100%

    & > div
      position relative
      &:before
        content ''
        display block
        position absolute
        visibility hidden
        width 2px
        height 2px
        left 49%
        background-color $form-active-color
        transition-duration .2s
        transition-timing-function cubic-bezier(.4, 0, .2, 1)

    & > input ~ div:before
      top -4px
    & > textarea ~ div:before
      top -8px


    & > span
      display block
      position relative
      pointer-events none
      visibility hidden
      opacity 0
      font-size 12px
      color $has-error !important
      transition opacity .3s



// Layout Modifiers -------------------------

// Inline
&.q-field-inline

// With Icon
/*&.q-field-icon
  & > .q-field-inner
    & > i
      left -48px*/

// With Dense
&.q-field-dense
  & > label
    top 1.5rem
  & > input
    padding-top 1.45rem
    margin-bottom 10px
  & > textarea
    margin-top 1.45rem
    margin-bottom 6px

// Has focus
&.q-field-focus
  & > i.item-primay
     color $form-active-color
  & .q-float-label
    & > label
    & > div:before
        visibility visible
        width 100%
        left 0


// Has invalid
&.q-field-invalid > .q-field-inner > input
& .q-float-label > input.has-error
  border-bottom-color $has-error !important

& > .q-field-inner > input.has-error ~ div:before
&.q-field-invalid .q-float-label > div:before
  background $has-error !important

& > .q-field-inner > input.has-error ~ span
&.q-field-invalid .q-float-label > span
  visibility visible
  opacity 1


// Label Position Mixins -------------------------

// Label above input
&.q-field-layout-stacked,
&.q-field-layout-floating.q-field-active
  & .q-float-label > label
      transform translateY(-22px) scale(.8)

// Label vanished
&.q-field-layout-placeholder.q-field-active
  & .q-float-label > label
      opacity 0
      transform-origin left 50%
      color $form-active-color

// Label not displayed
&.q-field-layout-nolabel
  & .q-float-label > label
      display none


// Custom Mixins -------------------------
&.q-field-layout-custom.q-field-active i
  transform scale(2) rotation(270)
&.q-field-layout-custom.q-field-active label
  transform translateX(100%) scale(2)
  color $secondary
</style>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

