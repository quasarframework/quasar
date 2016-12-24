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

    <div class="layout-header fixed-top">
    <!-- TITLE -->
      <div class="toolbar primary">
        <div class="toolbar-content">
          <div class="toolbar-title">
             Text Fields
          </div>
        </div>
      </div>



    <!-- Tabs -->

    <q-tabs
      class="primary"
      :refs="$refs"
      v-model="currentTab"
    >
      <q-tab name="tab-0" icon="message">
        Usage
      </q-tab>
      <q-tab name="tab-1" icon="message">
        Layout & Sizing
      </q-tab>
      <q-tab name="tab-2" icon="fingerprint">
        Sizing
      </q-tab>
      <q-tab name="tab-3" icon="alarm">
        States
      </q-tab>
      <q-tab name="tab-4" icon="accessibility">
        Validation
      </q-tab>
      <q-tab name="tab-3" icon="alarm">
        Types
      </q-tab>
    </q-tabs>
    </div>

    <div style="height:30px;"></div>

    <div class="layout-padding short-textboxes">


      <!-- USAGE -->
      <div ref="tab-0">

        <div class="card">

          <div class="card-title">
            Usage
          </div>

        </div>
      </div>




    <!-- Layouts-->
    <div ref="tab-1">


      <div class="card">

        <div class="card-title bg-primary text-white">

          Layouts

        </div>

        <div class="card-ations">
          <pre>{{ options }}</pre>
        </div>

        <div class="card-actions justify-between">

          <!-- field options -->
          <label v-for="opt in ddl_field_options" class="text-center">
            <q-checkbox v-model="options.field[opt.value]"></q-checkbox><br />
            {{ opt.label }}
          </label>

          <!-- field width -->
          <q-select
            label="Size"
            type="radio"
            v-model="options.field.fieldWidth"
            :options="ddl_widths"
          ></q-select>

        </div>

        <div class="card-actions">
          <!-- layout -->
          <q-select
            label="Layout"
            type="radio"
            v-model="options.layout"
            :options="ddl_layouts"
          ></q-select>

          <!-- grid options -->
          <div v-if="options.layout==='grid'">
            <q-select
              label="Columns"
              type="radio"
              v-model="options.grid_cols"
              :options="ddl_colWidths"
            ></q-select>
            <q-select
              class="width-3of6"
              label="Options"
              type="radio"
              v-model="options.grid_option"
              :options="ddl_layout_grid_options"
            ></q-select>
          </div>

          <!-- list options -->
          <div v-if="options.layout==='list'">
            <q-select
              class="width-3of6"
              label="List Options"
              type="toggle"
              v-model="options.list_options"
              :options="ddl_layout_list_options"
            ></q-select>

          </div>

        </div><!-- /row -->

      </div> <!-- /card-actions -->


        <div class="card-content">

          <div
            v-if="options.layout === 'grid'"
            :class="['grid', 'row', 'wrap', options.grid_option]"
          >

            <div
              v-for="field in demo_fields.layouts"
              :class="options.grid_cols === 'custom' ? field.colWidth : options.grid_cols"
            >
              <q-field
                :label='field.label'
                :layout='field.layout'
                :width='field.fieldWidth'
                :target-width='field.targetWidth'
                :label-width='field.labelWidth'
                :item='options.field.item'
                :icon='options.field.icon?field.icon:null'
                :icon2='options.field.icon2?field.icon2:null'
                :hint='options.field.hint?field:null'
                :dense='options.field.dense'
                :counter='options.field.counter'
                :maxlength='15'
              >
                <input type="text" model='field.model' />
              </q-feild>

            </div>

          </div> <!-- / .grid //o ptions.field.hint?field.hint:null -->

          <div
            v-if="options.layout === 'list'"
            :class="'list ' + options.list_options.join(' ') "
          >

            <q-field v-for="field in demo_fields.layouts"
              :label='field.label'
              :layout='field.layout'
              :class="[options.field.classWidth === 'custom' ? field.classWidth : options.field.classWidth]"
              :width='options.field.fieldWidth?options.field.fieldWidth:field.fieldWidth'
              :target-width='options.field.fieldWidth?options.field.fieldWidth:field.fieldWidth'
              :label-width='options.field.fieldWidth?options.field.fieldWidth:field.fieldWidth'
              :item='options.field.item'
              :icon='options.field.icon?field.icon:null'
              :icon2='options.field.icon2?field.icon2:null'
              :hint='options.field.hint?field:null'
              :dense='options.field.dense'
              :counter='options.field.counter'
              :maxlength='15'
            >
              <input type="text" model='field.model' />
            </q-feild>

          </div> <!-- / .list -->


          <p class="caption">Inline Label + Float Combos</p>

          <div class="row small-gutter wrap">

            <!-- NB! DEFAULT: float-layout="inplace" -->
            <q-float-label label="Inline" layout="inline" float="+ In-place Float" class="width-1of2 sm-width-1of1">
              <input type="text">
            </q-float-label>

            <q-float-label label="Inline" layout="inline" float="+ Floating Float!" float-layout="floating" class="width-1of2 sm-width-1of1">
              <input type="text">
            </q-float-label>

            <q-float-label label="Inline" layout="inline" float="+ Placeholder Float!" float-layout="placeholder" class="width-1of2 sm-width-1of1">
              <input type="text" placeholder="Placeholder">
            </q-float-label>

            <q-float-label label="Inline" layout="inline" float="+ Stacked Float!" float-layout="stacked" class="width-1of2 sm-width-1of1">
              <input type="text">
            </q-float-label>

          </div>

        </div>


      </div>
    </div>


    <!-- Sizing  (   Width &amp; Alignment) -->
    <div ref="tab-2">

      <div class="card">

        <div class="card-title">
          Width &amp; Alignment
        </div>

        <div class="card-content row wrap">

          <q-float-label label=" 40%" icon="short_text" class="width-1of3">
            <input type="text">
          </q-float-label>

          <q-float-label label=" 40%"  class="width-1of3">
            <input type="text">
          </q-float-label>
          <q-float-label label=" 40%" icon="short_text" class="width-1of3">
            <input type="text">
          </q-float-label>
          <br />

          <q-float-label label="Width 154px" icon="short_text" class="width-1of3">
            <input type="text">
          </q-float-label>

          <q-float-label label="Width 154px" class="width-1of3">
            <input type="text">
          </q-float-label>

          <br />

          <q-float-label label="Grow Width" icon="format_align_justify" width="grow">
            <input type="text">
          </q-float-label>



          <q-float-label label="+ Inline Label" icon="format_align_right" width="grow" layout="inline">
            <input type="text">
          </q-float-label>

          <q-float-label label="+ Inline Label" icon="format_align_right" width="grow" layout="inline">
            <input type="text" value="Size 4" size="4">
          </q-float-label>

          <q-float-label label="+ Label 50%" icon="format_indent_increase" width="grow" labelWidth="50%" layout="inline">
            <input type="text" value="Size 4" size="4">
          </q-float-label>

          <q-float-label label="+ Grow Label" icon="format_indent_increase" width="grow" labelWidth="grow" layout="inline">
            <input type="text" value="Size 4" size="4">
          </q-float-label>

          <q-float-label label="+ Label Right" icon="format_indent_decrease" width="grow" labelWidth="grow" labelAlign="right" layout="inline">
            <input type="text">
          </q-float-label>

          <q-float-label label="50% Inline Label + Grow Width" icon="border_clear" width="grow" labelWidth="50%" layout="inline">
            <input type="text">
          </q-float-label>

        </div>

      </div>
    </div>


    <!-- Input States -->
    <div ref="tab-3">


      <div class="card">

        <div class="card-title">
          Input States
        </div>

        <div class="card-content">

          <div class="list">

            <q-float-label label="Read-Only" icon="email_outline" width="grow">
              <input type="email" readonly value="professor.plum@study.com" />
            </q-float-label>

            <q-float-label label="Disabled" icon="gesture" width="grow">
              <input type="text" value="With the Rope" disabled>
            </q-float-label>

            <q-float-label label="Required" icon="face" width="grow">
              <input type="text" required >
            </q-float-label>

            <q-float-label label="Invalid" icon="build" width="grow">
              <input type="text" value="The Revolver" class="full-width" pattern=".*(spanner|wrench).*">
            </q-float-label>

          </div>

        </div>

      </div>

    </div>


    <div ref="tab-4">

      <div class="card">
        <div class="card-title">
          Validation
        </div>
        <div class="card-content">

          <q-float-label label="No Validation" icon="mail_outline">
            <input type="email">
          </q-float-label>

          <q-float-label label="Immediate Validation" icon="mail_outline" validate="immediate">
            <input type="email" value="bogus.email%com">
          </q-float-label>

          <q-float-label label="Eager Validation (default)" icon="mail_outline" validate>
            <input type="email">
          </q-float-label>

          <q-float-label label="Lazy Validation" icon="mail_outline" validate="lazy">
            <input type="email">
          </q-float-label>

          <q-float-label label="Custom Validation Message" icon="mail_outline" validate validate-msg="That ain't no email address, pal!">
            <input type="email">
          </q-float-label>

        </div>
      </div>


    </div>


    <!-- Text Input Types -->
    <div ref="tab-5">

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
              <q-range v-model="models.range" label markers :step="1" :min="0" :max="10"></q-range>
            </q-float-label>

            <q-float-label label="Numeric Textbox" layout="stacked" icon="email">
              <q-numeric
                v-model="models.numeric"
                :min="1"
                :max="100"
              ></q-numeric>
            </q-float-label>

            <q-float-label label="Chips Textbox" layout="stacked" icon="email">
              <q-chips v-model="models.chips"></q-chips>
            </q-float-label>

            <q-float-label label="Select" layout="stacked" icon="email">
              <q-select
                class="full-width"
                type="checkbox"
                v-model="models.multiSelect"
                :options="ddl_suspects"
              ></q-select>
            </q-float-label>

          </div>

        </div>

      </div>

      <div class="card">

        <div class="card-title">
          Textareas
        </div>

        <div class="card-content">

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

      </div>
    </div>
  </div>
</template>



<script>
export default {
  data () {
    return {
      // TABS
      //
      currentTab: 'tab-1',
      tabs: [
        {label: 'Tab 1', value: 'tab-1'},
        {label: 'Tab 2', value: 'tab-2'},
        {label: 'Tab 3', value: 'tab-3'}
      ],
      // Fields
      //
      demo_fields: {
        layouts: [
          {
            label: 'Inline',
            layout: 'inline',
            icon: 'face',
            icon2: 'plus_one',
            hint: 'This is some info',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''

          },
          {
            label: '',  // No label
            layout: '',
            icon: 'face',
            icon2: 'plus_one',
            hint: 'This is some info',
            model: 'No Label',
            classWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Floating',
            layout: '',
            icon: 'face',
            icon2: 'plus_one',
            hint: 'This is some info',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Inplace',
            layout: 'inplace',
            icon: 'face',
            icon2: 'plus_one',
            hint: 'This is some info',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Stacked',
            layout: 'stacked',
            icon: 'face',
            icon2: 'plus_one',
            hint: 'This is some info',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Placeholder',
            layout: 'placeholder',
            icon: 'face',
            icon2: 'plus_one',
            hint: 'This is some info',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          }
        ]
      },
      // Options
      //
      options: {
        label_options: [''],  // grow, 25%, 50%,
        layout: 'grid',
        grid_option: 'gutter',
        grid_cols: '',
        list_options: ['delimited'],
        field: {
          item: false,
          grow: true,
          fieldWidth: '',
          targetWidth: '',
          labelWidth: '',
          icon: true,
          icon2: false,
          hint: true,
          dense: false,
          counter: true
        }
      },
      // Models
      //
      models: {
        range: 7,
        numeric: 99,
        chips: ['Rope', 'Candlestick', 'Lead Pipe', 'Revolver'],
        multiSelect: []
      },
      // DDL Options
      //
      ddl_field_options: [
        {
          label: 'Items',
          value: 'item'
        },
        {
          label: 'Grow',
          value: 'grow'
        },
        {
          label: 'Dense',
          value: 'dense'
        },
        {
          label: 'Icon',
          value: 'icon'
        },
        {
          label: 'Icon2',
          value: 'icon2'
        },
        {
          label: 'Hint',
          value: 'hint'
        },
        {
          label: 'Counter',
          value: 'counter'
        }
      ],
      ddl_layouts: [
        {
          label: 'In a List',
          value: 'list'
        },
        {
          label: 'In a Grid',
          value: 'grid'
        }
      ],
      ddl_layout_list_options: [
        {
          label: 'Stripe',
          value: 'striped'
        },
        {
          label: 'Delimit',
          value: 'item-delimiter'
        },
        {
          label: 'Highlight',
          value: 'highlight'
        }
      ],
      ddl_layout_grid_options: [
        {
          label: 'No Gutter',
          value: ''
        },
        {
          label: 'Small Gutter',
          value: 'small-gutter'
        },
        {
          label: 'Gutter',
          value: 'gutter'
        },
        {
          label: 'Large Gutter',
          value: 'large-gutter'
        },
        {
          label: 'Big Gutter',
          value: 'big-gutter'
        }
      ],
      ddl_widths: [
        {
          label: 'Default',
          value: ''
        },
        {
          label: 'Full Width',
          value: 'grow'
        },
        {
          label: '50%',
          value: '50%'
        },
        {
          label: '250px',
          value: '250px'
        }
      ],
      ddl_colWidths: [
        {
          label: 'No Sizing',
          value: ''
        },
        {
          label: '1 Column',
          value: 'width-1of1'
        },
        {
          label: '2 Columns',
          value: 'width-1of2'
        },
        {
          label: '3 Columns',
          value: 'width-3of2'
        },
        {
          label: 'Custom',
          value: 'custom'
        }
      ],
      ddl_label_options: [
        {
          label: 'Icon 1',
          value: 'icon'
        },
        {
          label: 'Icon 2',
          value: 'icon2'
        },
        {
          label: 'Hint',
          value: 'hint'
        },
        {
          label: 'Counter',
          value: 'counter'
        },
        {
          label: 'Dense',
          value: 'dense'
        }
      ],
      ddl_suspects: [
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



<style lang='styl'>

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

$primary   ?= #027be3
$secondary ?= #26A69A
$tertiary  ?= #555

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
$form-lighter-color   ?= $grey-4
$form-active-color    ?= $primary
$form-border          ?= 3px solid $form-darker-color
$form-border-radius   ?= $generic-border-radius
$form-shadow          ?= 0 1px 3px 1px rgba(0, 0, 0, .4)


$textfield-border-size        ?= 1px
$textfield-border-style       ?= solid
$textfield-border-color       ?= #cccccc
$textfield-focus-border-color ?= $form-active-color
$textfield-font-size          ?= .9rem
$label-font-size              ?= $textfield-font-size

$textfield-padding-horizontal ?= 0
$textfield-padding-vertical   ?= 8px

$caret-color                  ?= $grey-9
$required-color               ?= $negative


// list styl
$item-primary-secondary-color ?= rgb(117, 117, 117)
$item-content-label-color     ?= rgba(0, 0, 0, .87)
$item-label-color             ?= rgba(0, 0, 0, .54)

// -------------------------------------------------------------------vvvv
// textfield.mat.styl ------------------------------------------------vvvv
//

$textfield-border-size        ?= 2px
$textfield-border-style       ?= solid
$textfield-border-color       ?= $form-lighter-color
$textfield-focus-border-color ?= $form-active-color
$textfield-font-size          ?= .9rem
$label-font-size              ?= $textfield-font-size

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
    color rgba(255, 255, 255, .54)


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


// textfield.mat.styl ------------------------------------------------^^^^
// -------------------------------------------------------------------^^^^

$grid-small-gutter  ?= .5rem
$grid-medium-gutter ?= 1rem
$grid-big-gutter    ?= 2.5rem
$grid-large-gutter  ?= 3.5rem

// flex.variables.styl ------------------------------------------------^^^^
// -------------------------------------------------------------------^^^^


/*.qf
.item
  border 1px solid pink

.qf > .qf-content
.item-content
  border 1px solid blue

.qf > .qf-content > .qf-inner
  border 1px solid green
*/
/*.item
  background pink
  xbackground #fafafa
  margin-bottom 5px

.qf > .qf-content
.item-content
  background lemonchiffon

.qf > .qf-content > .qf-inner
  background silver
*/



// NICE ICONS TO USE
/*
  storage (list)

  email
  mail_outline
  message
  chat
  create (pencil)

  account_box
  account_circle

  extension     jigsaw
  event_seat
  weekend (couch)
  build (wrench
  fingerprint
  gavel
  usb (candleabra)
  gesture (rope)
  person
  person_outline (torso)
  vpn_key

  toys (pinwheel)

  face
  favorite        : heart;
  favorite_border
*/




//
// DEBUG styles ------------------------------------------------vvvv
//


.field
  background #fafafa
  margin-bottom 5px
/*

*/
  /*
  &:after
    position relative
    font-size 12px
    font-family Monospace
    content attr(class) attr(style)
     */



//
// Demo styles ------------------------------------------------vvvv
//


.short-textboxes input[type=text]
  width 135px

label
.stacked-label, .floating-label
  label
    color rgba(255, 255, 255, .54)
.card-actions .q-picker-textfield-label .ellipsis
  color rgba(255, 255, 255, .54)
.card-acrtions .q-picker-textfield-label.active .q-picker-textfield-label .ellipsis
  color rgba(255, 255, 255, .54)


.card .card-actions
  xbackground-color #4DB6AC !important

//
// Other Amendments ------------------------------------------------vvvv
//

.flex:not(.v-gutter), .row:not(.v-gutter), .column:not(.v-gutter)
.field
  .item-content
  i.item-primary
  i.item-secondary
    transition all .3s

.qf textarea:active,
.field textarea:active
  transition none // Prevent animation while user drag-resize

/*
.flex-min-content
  flex-basis auto
  xflex-shrink 100

.flex-max-content
  flex-basis max-content
  -webkit-flex-basis -webkit-max-content
  -moz-flex-basis -moz-max-content
  -ms-flex-preferred-size -ms-flex-positive
*/
//
// <q-field> container ------------------------------------------------vvvv
//
/*
<div class="field field-layout-floating field-active field-value field-invalid-too-long">
<div class="field-target">
<input type="text" value="I AM A FIELD!" id="4bef41e1-bf2a-d7d2-67b8-0048b16bad45">
<div class="field-swoosh"></div>
<!----> <!----> <!----> <!---->
</div> <!---->
</div>


<div class="field sm-width-1of1 field-layout-inline field-active field-value field-invalid-too-long" input-width="grow">

<i class="item-primary">mood</i>
 <label class="field-label" for="f246a8ca-8966-5c34-8b1b-eb94003e8236">My New Field!:</label>
  <div class="field-target">
    <input type="text" value="I AM AN INPUT" id="f246a8ca-8966-5c34-8b1b-eb94003e8236">
    <div class="field-swoosh"></div>
    <span class="field-validate-msg">errr</span>
    <span class="field-counter">13 / 10</span>
    <span class="field-hint">Activate inline label layout by supplying layout='inline'</span> <!---->
  </div>
  <i class="item-secondary">mood</i>
  </div>
*/




// Default Field
// ----------------------------


// FIELD/ITEM/POSEUDO-ITEM SHARED STRUCTURE

/*div.field

  &.noitem

  &.item

*/

.field

  // Target-Only
  //
  &.target-only
    background-color #DCEDC8
    display inline-block
    padding-top 10px // <-- top of float touches top of field (i.e. no padding)
    padding-bottom 0px


  // field.item || field.clean-item
  //
  &.item
  &.clean-item
    position relative
    padding-top 0 !important // <-- padding handled by .item-content
    padding-bottom 0 //
    > i.item-primary, > i.item-secondary
      color $item-primary-secondary-color
      transition color .3s
      height 24px
      width 24px
      font-size 24px
      line-height 24px
      border-radius 50%
      margin 12px
    > i.item-primary
      // left initial
    > i.item-secondary
      right 0
    > .item-content
      padding-top 10px // <-- top of float touches top of field (i.e. no padding)
      padding-bottom 0px
      display flex // .row
      flex-direction row // .row
      align-items flex-start // .items-start

  // field.item
  //
  &.item
    background-color #C5CAE9
    display block
    padding-top 0 !important  // <-- padding handled by .item-content
    padding-bottom 0 // <--
    min-height 72px
    width
    > i.item-primary
    > i.item-secondary
      margin-top 26px
    > .item-content
      padding-top 20px
      padding-bottom 0px
      display flex // .row
      flex-direction row // .row
      align-items flex-start // .items-start
      // flex-wrap wrap // .wrap
  &.item.field-dense
    min-height 60px
    > i.item-primary
    > i.item-secondary
      font-size 20px
      margin-top 22px
    > .item-content
      padding-top 16px
      padding-bottom 0px

  // field.clean-item
  //
  &.clean-item
    background-color #B2DFDB
    display inline-block
    padding-top 0px
    padding-left 0px
    height auto
    > i.item-primary
    > i.item-secondary
      position absolute
      margin-top 16px // i.item-primary==margin 12px
      margin-left 0px
    > .item-content
      padding-top 10px // <-- top of float touches top of field (i.e. no padding)
      padding-bottom 0px
      display flex // .row
      flex-direction row // .row
      align-items flex-start // .items-start
      &.has-secondary
        margin-right 36px
    i.item-primary ~ div.item-content
      margin-left 36px // .item-content==72px
  &.clean-item.field-dense
    min-height 60px
    > i.item-primary
    > i.item-secondary
      font-size 20px
      margin-top 22px
    > .item-content
      padding-top 16px
      padding-bottom 0px


div.field-grow-input
  > input, > textarea
    width 100% !important
    margin 0px


// FIELD STRUCTURE
div.field

  // Labels (inline + float)
  label.field-label
    transition transform .5s cubic-bezier(0.25, 0.8, 0.25, 1), color .3s, opacity .3s
    transform-origin left top
    color rgba(0, 0, 0, .54)
    pointer-events none
    text-overflow ellipsis // .ellipsis
    white-space nowrap // .ellipsis
    overflow hidden // .ellipsis
    &.item-label
      margin-right 10px
      margin-top 8px
    &.field-float
    &.field-float-label
      position absolute
      margin-top 8px
    &.field-float
      font-style italic
      padding-right 5px

  // Inputs
  input, textarea
    border-bottom 0 !important
    width 100%

  // Swoosh
  div.field-swoosh
    position relative
    top -3px
    border-top $textfield-border-size $textfield-border-style $textfield-border-color
    &:before
      content ''
      display block
      position absolute
      visibility hidden
      width 2px
      top -1px
      height $textfield-border-size + 1
      left 49%
      background-color $form-active-color
      transition-duration .2s
      transition-timing-function cubic-bezier(.4, 0, .2, 1)

  // Validate-msg(s)
  // Hint
  // Counter
  span.field-validate-msg, span.field-hint, span.field-counter
    display block
    position relative
    pointer-events none
    font-size 12px
    transition opacity .3s

  span.field-validate-msg
    position relative
    color $has-error !important
    opacity 0

  span.field-hint
    color $dark
    color rgba(0,0,0,.38)

  span.field-counter
    float right
    color rgba(0,0,0,.38)
    color $dark

// Layout Modifiers
// -------------------------

// Has focus
&.field-focus
  label.item-label, label.field-float-label, i.item-primary, i.item-secondary
    color $form-active-color !important
  label.item-label:after, label.field-float-label:after
    color $required-color
  div.field-swoosh:before
    visibility visible
    width 100%
    left 0

// Invalid
&.field-invalid
  label.item-label, label.field-float-label  // <--- DELETE THESE, OR MAKE OPTIONAL?
  i.item-primary, i.item-secondary
    color $has-error !important
  div.field-swoosh
    border-top $textfield-border-size $textfield-border-style $has-error !important
    &:before
      background $has-error
  span.field-validate-msg
    opacity 1
  span.field-hint
    opacity 0
    height auto

// Too-Long (special case, can trigger independently from 'field-invalid' to accommodate maxlength counter.)
&.field-invalid-too-long
  span.field-counter
    color $has-error !important
  div.field-swoosh
    border-top $textfield-border-size $textfield-border-style $has-error !important
    &:before
      background $has-error

// Required
&.field-required
  label.item-label:after, label.field-float-label:after
    content '\00a0*\00a0'
    vertical-align top

// Hover pseudo selector
&.field:not(.field-disabled):hover
  label.item-label, label.field-float-label, i.item-primary, i.item-secondary
    color $form-active-color
  label.item-label:after, label.field-float-label:after
    color $required-color
  div.field-swoosh
    border-top-color $form-active-color

// Disabled
&.field-disabled
  div.field-swoosh
    border-top-style dotted

// Readonly
&.field-read-only
  div.field-swoosh
    border-top-style dotted
    &:before

      height 1px


// Inside List
.list >
  .field
    display block !important // .item==block
    width 100%

     > i.item-primary
     > i.item-secondary
      top 14px // .2-lines
      margin-top 12px // .item-primary==12px
      margin-left 12px
      margin-right 12px

     > .item-content.field-content
      margin-left 16px // .item-content==16px
      margin-right 16px // .item-content==16px

    div.item-content.has-secondary
      margin-right 72px // .item-content==72px

    .item-primary ~ div.item-content.field-content
      margin-left 72px // .item-content==72px

  &.field-dense
    i.item-primary
    i.item-secondary
      top 8px // .2-lines





// Float/Float-Label Mixins
// -------------------------

// Label not displayed
&.field-layout-nolabel
  label.field-float, label.field-float-label
    display none

// Label vanished
&.field-layout-inplace.field-active, .field-layout-placeholder
  label.field-float, label.field-float-label
    opacity 0

// Label visible
&.field-layout-stacked, .field-layout-floating, .field-layout-placeholder.field-active.field-value
  label.field-float, label.field-float-label
    opacity 1

// Label above input
&.field-layout-stacked, .field-layout-floating.field-active, .field-layout-placeholder
  label.field-float, label.field-float-label
    transform translateY(-18px) scale(.8)
  &.field-dense
    label.field-float, label.field-float-label
      transform translateY(-14px) scale(.8)



// Override flex vertical .gutter
// ----------------------------
.flex:not(.v-gutter), .row:not(.v-gutter), .column:not(.v-gutter)
  &.small-gutter
    margin 0 0 $grid-small-gutter (- $grid-small-gutter)
    > div
      // padding 0px
      // margin 0 0 0 $grid-small-gutter

  &.medium-gutter, &.gutter
    margin 0 0 $grid-medium-gutter (- $grid-medium-gutter)
    > div
      // padding 0px
      // margin 0 0 0 $grid-medium-gutter

  &.big-gutter
    margin 0 0 $grid-big-gutter (- $grid-big-gutter)
    > div
      // padding 0px
      // margin 0 0 0 $grid-big-gutter

  &.large-gutter
    margin 0 0 $grid-large-gutter (- $grid-large-gutter)
    > div
      // padding 0px
      // margin 0 0 0 $grid-large-gutter





















// Default Elements
// ----------------------------
.qf
  padding-top 0px
  padding-bottom 0px
  min-height 72px

  // icons
  i.item-primary
  i.item-secondary
    transition color .3s
    margin-top 26px // .item-primary==12px
    margin-left 0px
    margin-right 0px
  i.item-primary
    left initial
/*    width 40px
    height 40px
    background $primary
    color white
    padding 8px
    box-sizing border-box*/
  i.item-secondary
    right 0

  // item-content OVERRIDES
  div.item-content.qf-content
    padding-top 20px
    padding-bottom 15px
    margin-left 0
    margin-right 0
    display flex // .row
    flex-direction row // .row
    align-items flex-start // .items-start
    // flex-wrap wrap // .wrap

    &.has-secondary
      margin-right 36px

  .item-primary ~ div.item-content.qf-content
    margin-left 36px // .item-content==72px

  // Labels (inline + float)
  label.qf-label
    transition transform .5s cubic-bezier(0.25, 0.8, 0.25, 1), color .3s, opacity .3s
    transform-origin left top
    color rgba(0, 0, 0, .54)
    pointer-events none
    text-overflow ellipsis // .ellipsis
    white-space nowrap // .ellipsis
    overflow hidden // .ellipsis

    &.item-label
      margin-right 10px
      margin-top 8px

    &.qf-float-label
    &.qf-float
      position absolute
      top 8px
      xleft 0

    &.qf-float
      font-style italic
      padding-right 5px

  // Field-inner
  div..

    position relative
    &.qf-grow-input
      > input, > textarea
        width 100% !important
        margin 0px

  // Inputs
  input, textarea
    border-bottom 0 !important
    width 100%

  // Swoosh
  div.qf-swoosh
    position relative
    top -3px
    border-top $textfield-border-size $textfield-border-style $textfield-border-color
    &:before
      content ''
      display block
      position absolute
      visibility hidden
      width 2px
      top -1px
      height $textfield-border-size + 1
      left 49%
      background-color $form-active-color
      transition-duration .2s
      transition-timing-function cubic-bezier(.4, 0, .2, 1)

  // Validate-msg(s)
  // Hint
  // Counter
  span.qf-validate-msg, span.qf-hint, span.qf-counter
    display block
    position relative
    pointer-events none
    font-size 12px
    transition opacity .3s

  span.qf-validate-msg
    position relative
    color $has-error !important
    opacity 0

  span.qf-hint
    color $dark
    color rgba(0,0,0,.38)

  span.qf-counter
    float right
    color rgba(0,0,0,.38)
    color $dark

// Layout Modifiers
// -------------------------

// Has focus
&.qf-focus
  label.item-label, label.qf-float-label, i.item-primary, i.item-secondary
    color $form-active-color !important
  label.item-label:after, label.qf-float-label:after
    color $required-color
  div.qf-swoosh:before
    visibility visible
    width 100%
    left 0

// Invalid
&.qf-invalid
  label.item-label, label.qf-float-label  // <--- DELETE THESE, OR MAKE OPTIONAL?
  i.item-primary, i.item-secondary
    color $has-error !important
  div.qf-swoosh
    border-top $textfield-border-size $textfield-border-style $has-error !important
    &:before
      background $has-error
  span.qf-validate-msg
    opacity 1
  span.qf-hint
    opacity 0
    height auto

// Too-Long (special case, can trigger independently from 'qf-invalid' to accommodate maxlength counter.)
&.qf-invalid-too-long
  span.qf-counter
    color $has-error !important
  div.qf-swoosh
    border-top $textfield-border-size $textfield-border-style $has-error !important
    &:before
      background $has-error

// Required
&.qf-required
  label.item-label:after, label.qf-float-label:after
    content '\00a0*\00a0'
    vertical-align top

// Hover pseudo selector
&.qf:not(.qf-disabled):hover
  label.item-label, label.qf-float-label, i.item-primary, i.item-secondary
    color $form-active-color
  label.item-label:after, label.qf-float-label:after
    color $required-color
  div.qf-swoosh
    border-top-color $form-active-color

// Disabled
&.qf-disabled
  div.qf-swoosh
    border-top-style dotted

// Readonly
&.qf-read-only
  div.qf-swoosh
    border-top-style dotted
    &:before

      height 1px

// Dense
&.qf-dense
  min-height 60px
  i.item-primary.qf-icon
  i.item-secondary.qf-icon
    font-size 20px
    margin-top 22px
    margin-bottom 0px
  div.item-content.qf-content
    padding-top 16px
    padding-bottom 9px
  &.has-secondary
    margin-right 30px
  .item-primary ~ div.item-content.qf-content
    margin-left 30px // .item-content==72px


// Inside List
.list >
  .qf
    display block // .item==block

    i.item-primary.qf-icon, i.item-secondary.qf-icon
      top 14px // .2-lines
      margin-top 12px // .item-primary==12px
      margin-left 12px
      margin-right 12px

    div.item-content.qf-content
      margin-left 16px // .item-content==16px
      margin-right 16px // .item-content==16px

    div.item-content.has-secondary
      margin-right 72px // .item-content==72px

    .item-primary ~ div.item-content.qf-content
      margin-left 72px // .item-content==72px

  &.qf-dense

    i.item-primary.qf-icon
    i.item-secondary.qf-icon
      top 8px // .2-lines





// Float/Float-Label Mixins
// -------------------------

// Label not displayed
&.qf-layout-nolabel
  label.qf-float, label.qf-float-label
    display none

// Label vanished
&.qf-layout-inplace.qf-active, .qf-layout-placeholder
  label.qf-float, label.qf-float-label
    opacity 0

// Label visible
&.qf-layout-stacked, .qf-layout-floating, .qf-layout-placeholder.qf-active.qf-value
  label.qf-float, label.qf-float-label
    opacity 1

// Label above input
&.qf-layout-stacked, .qf-layout-floating.qf-active, .qf-layout-placeholder
  label.qf-float, label.qf-float-label
    transform translateY(-18px) scale(.8)
  &.qf-dense
    label.qf-float, label.qf-float-label
      transform translateY(-14px) scale(.8)


// Override flex vertical .gutter
// ----------------------------
.flex:not(.v-gutter), .row:not(.v-gutter), .column:not(.v-gutter)
  &.small-gutter
    margin 0 0 $grid-small-gutter (- $grid-small-gutter)
    > div.qf
      padding 0 0 0 $grid-small-gutter

  &.medium-gutter, &.gutter
    margin 0 0 $grid-medium-gutter (- $grid-medium-gutter)
    > div.qf
      padding 0 0 0 $grid-medium-gutter

  &.big-gutter
    margin 0 0 $grid-big-gutter (- $grid-big-gutter)
    > div.qf
      padding 0 0 0 $grid-big-gutter

  &.large-gutter
    margin 0 0 $grid-large-gutter (- $grid-large-gutter)
    > div.qf
      padding 00 0 $grid-large-gutter



/**/
// -------------------------
// Custom Mixin -------------------------
// -------------------------
/*
&.qf.my-android-field
  transition all 1.5s cubic-bezier(.87,-.41,.19,1.44)
  i.item-primary.qf-icon
    transition all 1s cubic-bezier(.87,-.41,.19,1.44)
    transform-origin 50% bottom
    position relative
    color #4CAF50
  .qf-inner
    overflow-x hidden
    &:before
      transition all 1.5s ease-in-out
      position absolute
      content '01110000 01110010 01100101 01110100 01100101'
      font-size 13px
      white-space nowrap
      color transparent
      top 8px
      left -360px
    > div.qf-swoosh:before
      background-color #4CAF50
      left 100%
      width 100%
      height 4px
      opacity 1
      transition-duration 1.5s

&.qf-active
  background #000
  i.item-primary.qf-icon
    left calc(100% - 52px)
    transform scale(1.5)
  .qf-inner
    &:before
      left 0
      color #4CAF50
    input
      color #4CAF50
      border-bottom-color #4CAF50
      font-family "Lucida Console", Monaco, monospace
    > div.qf-swoosh:before
      left 0 !important
      opacity 1 !important

&.qf-focus
  i.item-primary.qf-icon
    transform scale(1.7)
  & > .qf-inner
    & > div.qf-swoosh:before
      box-shadow  6px 4px 20px 2px #B6FF00



*/



</style>

