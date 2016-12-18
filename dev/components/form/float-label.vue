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

    <div class="layout-header">

      <div class="toolbar primary">
      <!--   <button><i>text_fields</i></button> -->
        <div class="toolbar-content">
          <div class="toolbar-title padding-2">
            <i>text_fields</i>
             Text Fields
          </div>

        </div>

      </div>

    </div>

    <div class="layout-padding">




      <div class="card">

        <div class="card-title">
          Basic Layouts
        </div>

        <div class="card-content">

          <div class="row">
            <div class="auto">
              <q-float-label label="Floating Label">
                <input type="text">
              </q-float-label>

              <br />


              <q-float-label label="Stacked Label" layout="stacked">
                <input type="text">
              </q-float-label>

              <q-float-label label="In-place Label" layout="inplace">
                <input type="text">
              </q-float-label>

              <br />


              <q-float-label label="... Label" layout="placeholder">
                <input type="text" placeholder="Placeholder ...">
              </q-float-label>

              <br />
            </div>

            <div class="auto">
              <q-float-label label="Inline Label" layout="inline">
                <input type="text">
              </q-float-label>

              <br />

              <q-float-label>
                <input type="text" value="No Label">
              </q-float-label>

              <br />

              <q-float-label label="Label + Icon" icon="label">
                <input type="text">
              </q-float-label>

              <br />

              <q-float-label icon="label">
                <input type="text" value="Icon Only">
              </q-float-label>

            </div>

          </div>

        </div>

      </div>

      <div class="card">

        <div class="card-title">
          Width &amp; Alignment
        </div>

        <div class="card-content">

          <q-float-label label="Width 27%" icon="short_text" width="27%">
            <input type="text">
          </q-float-label>

          <q-float-label label="Width 27%" icon="short_text" width="27%">
            <input type="text">
          </q-float-label>

          <br />

          <q-float-label label="Width 256px" icon="short_text"  width="256px">
            <input type="text">
          </q-float-label>

          <br />

          <q-float-label label="Grow Width" icon="format_align_justify" width="grow">
            <input type="text">
          </q-float-label>

          <q-float-label label="+ Inline Label" icon="format_align_right" width="grow" layout="inline">
            <input type="text">
          </q-float-label>

          <q-float-label label="+ Grow Label" icon="format_indent_decrease" width="grow" labelWidth="grow" layout="inline">
            <input type="text">
          </q-float-label>

          <q-float-label label="+ Label Right" icon="format_indent_increase" width="grow" labelWidth="grow" labelAlign="right" layout="inline">
            <input type="text">
          </q-float-label>

          <q-float-label label="50% Inline Label + Grow Width" icon="border_clear" width="grow" labelWidth="50%" layout="inline">
            <input type="text">
          </q-float-label>

        </div>

      </div>

      <div class="card">

        <div class="card-title">
          Text Input Types
        </div>

        <div class="card-content">

          <p class="caption strong">Text Input Types</p>

          <div class="list highlight item-inset-delimiter">
            <q-float-label label="Email" icon="face">
              <input type="text">
            </q-float-label>

            <q-float-label label="Range Component" layout="stacked" icon="email">
              <q-range v-model="model_range" label markers :step="1" :min="0" :max="10"></q-range>
            </q-float-label>

            <q-float-label label="Numeric Textbox" layout="stacked" icon="email">
              <q-numeric
                v-model="model_numeric"
                :min="1"
                :max="100"
              ></q-numeric>
            </q-float-label>

            <q-float-label label="Chips Textbox" layout="stacked" icon="email">
              <q-chips v-model="model_chips"></q-chips>
            </q-float-label>


            <q-float-label label="Select" layout="stacked" icon="email">
              <q-select
                class="full-width"
                type="checkbox"
                v-model="model_multiSelect"
                :options="options_suspects"
              ></q-select>
            </q-float-label>

          </div>





          <p class="caption strong">Other Component Types</p>

          <div class="list">
            <q-float-label label="Suspect" icon="face">
              <input type="text">
            </q-float-label>

            <q-float-label label="Range Component" layout="stacked" icon="email">
              <q-range v-model="model_range" label markers :step="1" :min="0" :max="10"></q-range>
            </q-float-label>

            <q-float-label label="Numeric Textbox" layout="stacked" icon="email">
              <q-numeric
                v-model="model_numeric"
                :min="1"
                :max="100"
              ></q-numeric>
            </q-float-label>

            <q-float-label label="Chips Textbox" layout="stacked" icon="email">
              <q-chips v-model="model_chips"></q-chips>
            </q-float-label>


            <q-float-label label="Select" layout="stacked" icon="email">
              <q-select
                class="full-width"
                type="checkbox"
                v-model="model_multiSelect"
                :options="options_suspects"
              ></q-select>
            </q-float-label>

          </div>


          <div class="list">

          <p class="caption strong">Input States</p>

            <q-float-label label="Disabled">
              <input type="text" disabled class="full-width" icon="">
            </q-float-label>

            <q-float-label label="Read-Only">
              <input type="email" readonly value="professor.plum@study.com" class="full-width">
            </q-float-label>

            <q-float-label label="Required">
              <input type="text" required class="full-width">
            </q-float-label>

            <q-float-label label="Invalid" icon="build">
              <input type="text" value="The Revolver" class="full-width" pattern=".*(spanner|wrench).*">
            </q-float-label>



          </div>

          <p class="caption strong">Input Types</p>



      <div class="card">

        <div class="card-title">
          Layout Width
        </div>

        <div class="card-content">



        </div>

      </div>



      <div class="card">

        <div class="card-title">
          Validation
        </div>

        <div class="card-content">



        </div>

      </div>


      <div class="card">

        <div class="card-title">
          Text Types
        </div>

        <div class="card-content">



        </div>

      </div>


      <div class="card">

        <div class="card-title">
          Input Status
        </div>

        <div class="card-content">



        </div>

      </div>



      <div class="card">

        <div class="card-title">
          Layout Width
        </div>

        <div class="card-content">



        </div>

      </div>



   <hr />

          <q-float-label label="Text" icon="face" validate>
            <input type="text" required>
          </q-float-label>

  <hr />

          <q-float-label label="Text - Required" icon="face" validate>
            <input type="text" required>
          </q-float-label>

  <hr />

          <q-float-label label="Email" icon="email" validate>
            <input type="email">
          </q-float-label>
  <hr />
          <q-float-label label="Email" icon="edit" layout="inline" validate>
            <input type="email">
          </q-float-label>

            <hr />


        <div class="list">


          <q-float-label label="Email" icon="edit" validate>
            <input type="email">
          </q-float-label>

          <hr />

          <q-float-label label="Email" icon="edit" layout="inline" validate>
            <input type="email">
          </q-float-label>

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



    <!--     <p>Inline Label</p>
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

 -->




          <!-- Layouts -->
          <q-float-label label="Basic Floating Label" width="50%">
            <input>
          </q-float-label>

          <q-float-label label="Placeholder Layout" layout="placeholder" >
            <input>
          </q-float-label>

          <q-float-label label="Stacked Layout" layout="stacked" width='max'>
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



<script>
export default {
  data () {
    return {
      model_range: 7,
      model_numeric: 99,
      model_chips: ['Rope', 'Candlestick', 'Lead Pipe', 'Revolver'],
      model_multiSelect: [],
      options_suspects: [
        {
          label: 'Col. Mustard',
          value: 'mustard'
        },
        {
          label: 'Prof. Plum',
          value: 'plum'
        },
        {
          label: 'Rev. Green',
          value: 'green'
        },
        {
          label: 'Miss Scarlet',
          value: 'scarlet'
        },
        {
          label: 'Mrs. Peacock',
          value: 'peacock'
        }
      ]

    }
  }
}
</script>







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
$required-color               ?= $negative

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

.q-field > .q-field-inner > textarea:active
  transition none // Prevent animation while user drag-resize

/* Block firefox red border  DUZNT WORK!*/
input:required:invalid, input:focus:invalid {
  -moz-box-shadow: none;
}

/*  &:not(.two-lines):not(.three-lines):not(.multiple-lines) > .item-content > div:not(.stacked-label):not(.floating-label):not([class^='q-'])
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
*/



.q-field
  display inline-block
  height auto
  xbackground #fafafa
  min-height 72px
  margin-bottom 5px

  /* icon */
  & > i.item-primary
    position relative !important
    top 14px
    left 0px
    transform-origin 50% 50%
    transition color .3s

  /* labels (inline + float) */
  & > label
  & > .q-field-inner > label
    transition transform .15s ease-in-out, color .3s, opacity .3s
    top 28px
    color rgba(0, 0, 0, .54)
    white-space nowrap
    pointer-events none

  & > label
    position relative
    top 28px
    margin-right 4px

  & > .q-field-inner > label
    position absolute
    left 0
    transform-origin left top


  /* field-inner */
  & > .q-field-inner
    position relative
    padding-top 20px
    padding-bottom 8px
    overflow-y visible

    /* input */
    & > input
      width 100%

    & > textarea
      width 100%

    /* swash */
    & > div.q-swash
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

    & > input ~ div.q-swash:before
      top -4px
    & > textarea ~ div.q-swash:before
      top -8px


    /* validate-msg */
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
&.q-field-layout-inline
  display inline-flex

// Icon
&.q-field-icon
  display inline-flex

// Dense
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
  & > label
  & > .q-field-inner > label
  & > i.item-primary
    color $form-active-color
  & > .q-field-inner > label:after
  & > label:after
    color $required-color
  & > .q-field-inner > div.q-swash:before
    visibility visible
    width 100%
    left 0

// Invalid
&.q-field-invalid > .q-field-inner > input
& .q-field-inner > input.has-error
  border-bottom-color $has-error !important

& > .q-field-inner > input.has-error ~ div.q-swash:before
&.q-field-invalid > .q-field-inner > div.q-swash:before
  background $has-error !important

& > .q-field-inner > input.has-error ~ span
&.q-field-invalid > .q-field-inner > span
  visibility visible
  opacity 1

// Required
&.q-field-required
  & > .q-field-inner > label:after
  & > label:after
    content '\00a0*\00a0'
    vertical-align top



// Floating Label Position Mixins -------------------------

// Label not displayed
&.q-field-layout-nolabel
  & .q-field-inner > label
      display none

// Label vanished
&.q-field-layout-inplace.q-field-active
&.q-field-layout-placeholder
  & .q-field-inner > label
      opacity 0
      transform-origin left 50%
      color $form-active-color

// Label above input
&.q-field-layout-stacked
&.q-field-layout-floating.q-field-active
&.q-field-layout-placeholder.q-field-active
  & .q-field-inner > label
      opacity 1
      transform translateY(-18px) scale(.8)




// -------------------------
// Custom Mixin -------------------------
// -------------------------

.q-field.my-android-label
  transition all 1.5s cubic-bezier(.87,-.41,.19,1.44)
  & > i
    transition all 1.5s cubic-bezier(.87,-.41,.19,1.44)
    transform-origin 50% bottom
    position relative
    color #4CAF50
  & > .q-field-inner
    overflow-x hidden
    &:before
      transition all 1.5s ease-in-out
      position absolute
      content '01110000 01110010 01100101 01110100 01100101'
      font-size 13px
      color transparent
      top 8px
      left -360px
    & > div.q-swash:before
      background-color #4CAF50
      left 100%
      width 100%
      height 4px
      opacity 1
      transition-duration 1.5s

  &.q-field-active
    background #000
    & > i
      left 80%
      transform scale(1.5)
    & > .q-field-inner
      &:before
        left 0
        color #4CAF50
      & > input
        color #4CAF50
        border-bottom-color #4CAF50
        font-family "Lucida Console", Monaco, monospace
      & > div.q-swash:before
        left 0 !important
        opacity 1 !important

  &.q-field-focus
    & > i
      transform scale(1.7)
    & > .q-field-inner
      & > div.q-swash:before
        box-shadow  6px 4px 20px 2px #B6FF00




// List View -------------------------
div.list > div.q-field
  width 100%

div.list > div.q-field > i.item-primary
  width 48px

</style>
