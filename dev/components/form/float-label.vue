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
        <q-tab name="tab-usage" icon="card_giftcard">
          Usage
        </q-tab>
        <q-tab name="tab-layout" icon="widgets">
          Layout
        </q-tab>
        <q-tab name="tab-sizing" icon="swap_horiz">
          Sizing
        </q-tab>
        <q-tab name="tab-state" icon="fingerprint">
          State
        </q-tab>
        <q-tab name="tab-validation" icon="playlist_add_check">
          Validation
        </q-tab>
        <q-tab name="tab-types" icon="alarm">
          Types
        </q-tab>
      </q-tabs>
    </div>

    <div class="layout-padding short-textboxes">

      <div style="height:120px;"></div>

      <!-- USAGE -->
      <div ref="tab-usage">

        <div class="card">

          <div class="card-title bg-primary text-white">
            Example Form
          </div>
          <div class='card-content'>

            <div class="grid row wrap ">

              <div class="width-1of4 sm-width-1of1">
                <q-field item label="First Name" validate icon="face">
                  <input type="text" class="demoInputWidth" v-model="example.firstName" required />
                </q-field>
              </div>
              <div class="width-1of4 sm-width-1of1">
                <q-field item validate label="Last Name">
                  <input type="text" class="demoInputWidth" v-model="example.lastName" required />
                </q-field>
              </div>

              <div class="width-2of4">
                <q-field item label="Email" validate icon="mail_outline">
                  <input
                    type="text"
                    hint="Email is generated from user names."
                    class="demoInputWidth"
                    v-model="myExampleEmail"
                    placeholder="detective.name@favourite.room"
                    readonly=""

                />
                </q-field>
              </div>

              <div class="width-2of4 sm-width-1of1" >
                <q-field item label="Detective Name" validate="lazy" hint='E.g. "Sam Spade"' icon="search">
                  <input type="text" class="demoInputWidth" v-model="example.detectiveName" required />
                </q-field>
              </div>

              <div class="width-1of4">
                <q-field item label="Password" validate icon="lock_outline">
                  <input type="password" style="width: 50px;" maxlength="4" counter v-model="example.password" required />
                </q-field>
              </div>

              <div class="width-2of4 sm-width-1of1">
                <q-field item label="Favourite Detective" layout="stacked" target-width="shrink" icon="person_outline">
                    <q-select
                      style="width:140px"
                      type="radio"
                      v-model="example.favouriteDetective"
                      :options="ddl_detectives"
                    ></q-select>
                </q-field>
              </div>


            </div>



            <div class="width-3of6 sm-width-1of1">
              <q-field item label="Disabled" icon="gesture" width="grow">
                <input type="text" value="The Rope" disabled>
              </q-field>
            </div>
            <div class="width-2of6 sm-width-1of1">
              <q-field item label="Required" icon="face" target-width="grow" validate>
                <input type="text" required >
              </q-field>
            </div>

          </div>
<!--
          <div class="card-title">
            Usage
          </div>
         <div class="card-content">
            Insert a nice-looking example using fields.

            <table class="q-table compact striped border horizontal-delimiter highlight">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>


              <tbody>
                <tr>
                  <td>item</td>
                  <td><pre>Boolean</pre></td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>layout</td>
                  <td><pre>String</pre></td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>dense</td>
                  <td>Boolean</td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>icon</td>
                  <td>String</td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>icon2</td>
                  <td>String</td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>hint</td>
                  <td>String</td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>targetWidth</td>
                  <td>String</td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>targetAlign</td>
                  <td>String</td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>labelWidth</td>
                  <td>String</td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>labelAlign</td>
                  <td>String</td>
                  <td>xx</td>
                </tr>
                <tr>
                  <td>maxlength</td>
                  <td>Number</td>
                  <td>Specify maximum value length for field validation. <br />NB: The value's length is validated, but data-entry is not restricted to valid lengths.  This method provides an alternative to using <pre>&lt;input maxlength="..." /&gt;</pre> wherein maxlength is enforced.</td>
                </tr>
                <tr>
                  <td>validate</td>
                  <td>String</td>
                  <td>Perform validation
                    <pre>false (default) - Don't validate.</pre>
                    <pre>`eager` | true - Validate on input event.</pre>
                    <pre>`lazy` -  Validate on blur event.</pre>
                  </td>
                </tr>
                <tr>
                  <td>validate-msg</td>
                  <td>String</td>
                  <td>Text to override the generic validation error message.</td>
                </tr>
                <tr>
                  <td>validate-immediate</td>
                  <td>Boolean</td>
                  <td>If true, validation will be invoked when the field is first rendered, before user input.</td>
                </tr>
              </tbody>
            </table>
          </div> -->
        </div>
      </div>

      <!-- Options-->
      <div ref="tab-layout">


        <div class="card">

          <div class="card-title bg-primary text-white">

            Layout Options

          </div>

              <div class="settings card-actions wrap ">

                <div class="row width-2of5 justify-between">
<!--                   <q-select
                    label="Render"
                    type="radio"
                    v-model="options.structure"
                    :options="ddl_structures"
                  ></q-select> -->
                  <!-- layout -->
                  <q-select
                    label="Example"
                    style="width:140px"
                    type="radio"
                    v-model="options.layout"
                    :options="ddl_layouts"
                  ></q-select>
                  <!-- display -->
<!--                   <q-select
                    label="Display"
                    type="radio"
                    v-model="options.display"
                    :options="ddl_displays"
                  ></q-select> -->
                </div>
                <div class="row justify-between width-3of5">
                  <!-- field options -->
                   <label v-for="opt in ddl_fieldOpts" style="width:40px;" class="text-center">
                    <q-checkbox label="asd" v-model="options.fieldOpts[opt.value]"></q-checkbox><br />
                    {{ opt.label }}
                  </label>

                </div>
                <p v-if="(options.layout.indexOf('items-')>-1)" class="no-padding"><strong>Item defaults:</strong> Full-width block; Target  grows.</p>
                <p v-if="(options.layout.indexOf('fields-')>-1)" class="no-padding"><strong>Field defaults:</strong> No-width inline; Target  shrinks.</p>
              </div><!-- /card-actions -->


            <template v-for="(demoFields, key, index) in demo_fields">

              <div class="card-title" v-if="key==='layouts'">Label Layouts</div>
              <div class="card-title" v-else-if="key==='combos'">Inline Label + Floating Hint Combos</div>

              <div
                :class="{
                  'card-content':(options.layout.indexOf('-grid')>-1),
                  'bg-field': options.fieldOpts.background
                }"
              >

                <div
                  v-if="(options.layout.indexOf('-grid')>-1)"
                  :class="['grid',  'row', 'wrap', options.grid_option]"
                >

                  <!-- IN A GRID -->
                  <div
                    v-for="field in demoFields"
                    :class="options.grid_cols === 'custom' ? field.colWidth : options.grid_cols"
                  >
                    <q-field
                      :data-target-info="'Width ' + (options.field.targetWidth?options.field.targetWidth:field.targetWidth) + ', Align ' + (options.field.targetAlign?options.field.targetAlign:field.targetAlign)"
                      :data-label-info="'Width ' + (options.field.labelWidth?options.field.labelWidth:field.labelWidth) + ', Align ' + (options.field.labelAlign?options.field.labelAlign:field.labelAlign)"
                      :label='field.label'
                      :layout='field.layout'
                      :float='field.float'
                      :float-layout='field.floatLayout'
                      :item="options.layout.indexOf('items-')>-1"
                      :icon='options.fieldOpts.icon?field.icon:null'
                      :icon2='options.fieldOpts.icon2?field.icon2:null'
                      :hint='options.fieldOpts.hint?field.hint:null'
                      :dense='options.fieldOpts.dense'
                      :counter='options.fieldOpts.counter'
                      :maxlength='15'
                    >
                      <input type="text" class="demoInputWidth" v-model='field.model' :placeholder='field.placeholder'/>
                    </q-field>

                  </div>

                </div> <!-- / .grid //o ptions.field.hint?field.hint:null -->

                <!-- IN A LIST -->
                <div
                  v-if="(options.layout.indexOf('-list')>-1)"
                  :class="'list ' + options.list_options.join(' ') + (options.fieldOpts.background?' striped':'') "
                >

                  <q-field v-for="field in demoFields"
                    :style="{'display': options.display}"
                    :label='field.label'
                    :layout='field.layout'
                    :float='field.float'
                    :float-layout='field.floatLayout'
                    :item="options.structure==='item'"
                    :icon='options.fieldOpts.icon?field.icon:null'
                    :icon2='options.fieldOpts.icon2?field.icon2:null'
                    :hint='options.fieldOpts.hint?field.hint:null'
                    :dense='options.fieldOpts.dense'
                    :counter='options.fieldOpts.counter'
                    :maxlength='15'
                  >
                    <input type="text" v-model='field.model' :placeholder='field.placeholder' ref='field-target' />
                  </q-field>

                </div> <!-- / .list -->

              </div>

            </template>

          </div>
      </div><!-- / tab-2 -->

      <!-- Sizing  (   Width &amp; Alignment) -->
      <div ref="tab-sizing">

        <div class="card">

          <div class="card-title bg-primary text-white">
            Sizing
          </div>
          <div class="settings card-actions wrap">

              <div class="sm-width-1of1 width-1of2" style='margin-top:10px;'>
                <table class="q-table full-width bordered horizontal-delimiter  compact">
                  <tbody>
                    <tr><!--
                      <th><i class="flip-horizontal">format_indent_increase</i><br />Label</th> -->
                      <th class='text-center'>Label<br /><q-checkbox v-model="options.debugLabel"></q-checkbox></th>
                      <td><q-select
                            type="radio"
                            label="Width"
                            v-model="options.field.labelWidth"
                            :options="ddl_widths"
                          ></q-select></td>
                      <td><q-select
                            type="radio"
                            label="Align"
                            v-model="options.field.labelAlign"
                            :options="ddl_alignments"
                          ></q-select></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="sm-width-1of1 width-1of2" style='margin-top:10px;'>
                <table class="q-table full-width bordered horizontal-delimiter  compact">
                  <tbody>
                    <tr><!--
                      <th><i>format_indent_increase</i><br />Target</th> -->
                      <th class='text-center'>Target<br /><q-checkbox v-model="options.debugTarget"></q-checkbox></th>
                      <td><q-select
                            type="radio"
                            label="Width"
                            v-model="options.field.targetWidth"
                            :options="ddl_widths"
                          ></q-select></td>
                      <td><q-select
                            type="radio"
                            label="Align"
                            v-model="options.field.targetAlign"
                            :options="ddl_alignments"
                          ></q-select></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div><!-- /card-actions -->

            <!-- SIZING -->
            <div class="card-title">Items</div>
            <div class="card-content bg-field">

              <div class="grid row wrap gutter"
                :class="{'bg-label': options.debugLabel,
                    'bg-target': options.debugTarget}">

                <div class="width-1of1">
                  <q-field label="Inline Label"
                    layout="inline"
                    item
                    hint="Item + Inline Label"
                    class='shadow-1'
                    icon="label_outline"
                    :target-width='options.field.targetWidth'
                    :label-width='options.field.labelWidth'
                    :target-align='options.field.targetAlign'
                    :label-align='options.field.labelAlign'
                  >
                    <input type="text" />
                  </q-field>

                </div>

                <div class="width-1of1">
                  <q-field label="Floating Label"
                    layout="stacked"
                    icon="cloud_queue"
                    item
                    hint="Item + Floating Label"
                    class='shadow-1'
                    :target-width='options.field.targetWidth'
                    :label-width='options.field.labelWidth'
                    :target-align='options.field.targetAlign'
                    :label-align='options.field.labelAlign'
                  >
                    <input type="text" />
                  </q-field>
                </div>
              </div>
            </div>

            <div class="card-title">Fields</div>
            <div class="card-content bg-field">

              <div class="grid row wrap gutter"
                :class="{'bg-label': options.debugLabel,
                    'bg-target': options.debugTarget}">

                <div class="width-1of1">
                  <q-field label="Inline Label"
                    layout="inline"
                    style="min-height:72px;padding-top: 10px;"
                    class='shadow-1 full-width'
                    icon="label_outline"
                    hint="Field + Inline Label"
                    :target-width='options.field.targetWidth'
                    :label-width='options.field.labelWidth'
                    :target-align='options.field.targetAlign'
                    :label-align='options.field.labelAlign'
                  >
                    <input type="text" />
                  </q-field>

                </div>

                <div class="width-1of1">
                  <q-field label="Floating Label"
                    layout="stacked"
                    style="min-height:72px;padding-top: 10px;"
                    class='shadow-1 full-width'
                    icon="cloud_queue"
                    hint="Field + Floating Label"
                    :target-width='options.field.targetWidth'
                    :label-width='options.field.labelWidth'
                    :target-align='options.field.targetAlign'
                    :label-align='options.field.labelAlign'
                  >
                    <input type="text" />
                  </q-field>
                </div>
              </div>
            </div>


        </div> <!-- /card -->

      </div>

      <!-- State -->
      <div ref="tab-state">

        <div class="card">

          <div class="card-title bg-primary text-white">
            Input States
          </div>
          <div class='card-content'>
            <div class="grid row wrap small-gutter">

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Read-Only" icon="email_outline" width="grow">
                  <input type="email" readonly value="professor.plum@the.study" />
                </q-field>
              </div>

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Disabled" icon="gesture" width="grow">
                  <input type="text" value="The Rope" disabled>
                </q-field>
              </div>
              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Required" icon="face" target-width="grow" validate>
                  <input type="text" required >
                </q-field>
              </div>
              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Invalid" icon="build" width="grow" validate>
                  <input type="text" value="The Revolver" class="full-width" pattern=".*(spanner|wrench).*" >
                </q-field>
              </div>

            </div>

          </div>

        </div>
      </div>

      <!-- Validation -->
      <div ref="tab-validation">

        <div class="card">

          <div class="card-title bg-primary text-white">
            Validation
          </div>
          <div class='card-content'>
            <div class="grid row wrap small-gutter">

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Eager" icon="mail_outline" hint="(Default validate)" validate>
                  <input type="email">
                </q-field>
              </div>
              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Lazy" icon="mail_outline" validate="lazy" hint="(validate='lazy')">
                  <input type="email">
                </q-field>
              </div>
              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Custom Validation Message" icon="mail_outline" validate validate-msg="That ain't no email address, pal!" hint="(validate-msg='...')">
                  <input type="email">
                </q-field>
              </div>

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Immediate Validation" icon="mail_outline" validate validate-immediate hint='(validate-immediate)'>
                  <input type="email" value="bogus.email%com">
                </q-field>
              </div>
            </div>

          </div>

          <div class="card-title">
            Maxlength & Counter
          </div>
          <div class='card-content'>
            <div class="grid row wrap small-gutter">

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Unvalidated" icon="extension" :maxlength="10" counter>
                  <input type="email">
                </q-field>
              </div>

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Validated" icon="bug_report" :maxlength="10" counter validate validate-msg="Too long!">
                  <input type="email">
                </q-field>
              </div>

            </div>

          </div>


        </div>
      </div>

      <!-- Input Types -->
      <div ref="tab-types">

        <div class="card">

          <div class="card-title bg-primary text-white">
            Text Input Types
          </div>

          <div class="list item-delimiter">

              <q-field item label="Plain Text" icon="text_fields">
                <input type="text" />
              </q-field>

              <q-field item label="Email" icon="email" validate validate-msg="Invalid email address">
                <input type="email" />
              </q-field>

              <q-field item label="Password" icon="lock" validate counter>
                <input type="password" :maxlength="8"  />
              </q-field>

              <q-field item label="Number" icon="looks_one" validate validate-msg="Not a number" >
                <input type="number" />
              </q-field>

              <q-field item label="Search" icon="search" validate>
                <input type="search" />
              </q-field>

              <q-field item label="Textarea" :maxlength="50" counter validate-immediate icon="comments" target-width="grow">
                <textarea rows="5" class="full-width">If you end your movement in a room, you get to make a suggestion. To do this, name a suspect, a murder weapon, and the room you just entered. For example, if you just entered the lounge, you might say, "I suggest the crime was committed by Colonel Mustard, in the lounge, with a dagger." The named suspect and murder weapon are both moved into your current room.</textarea>
              </q-field>

          </div>

          <div class="card-title">
            Other Components
          </div>


          <div class="list item-delimiter">
            <q-field item label="Numeric" layout="inline" icon="looks_two">
              <q-numeric
                v-model="models.numeric"
                :min="1"
                :max="100"
              ></q-numeric>
            </q-field>

            <q-field item label="Chips" target-width="grow" layout="stacked"  icon="code">
              <q-chips v-model="models.chips"></q-chips>
            </q-field>
          </div>

      </div>

    </div> <!-- / Tab 5 -->

  </div> <!-- / layout-padding -->

</div> <!-- / root -->
</template>



<script>
export default {
  computed: {
    myExampleEmail () {
      return (this.example.firstName || '???') + (this.example.firstName || '???') + '@.example.com'
    }
  },
  data () {
    return {
      // TABS
      //
      currentTab: 'tab-usage',
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
            label: 'Floating',
            layout: 'floating',
            icon: 'cloud_queue',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Inplace',
            layout: 'inplace',
            icon: 'cloud_queue',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Stacked',
            layout: 'stacked',
            icon: 'cloud_queue',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Placeholder',
            layout: 'placeholder',
            icon: 'cloud_queue',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: '',
            placeholder: 'Placeholder...'
          },
          {
            label: '',  // No label
            layout: '',
            icon: 'cloud_off',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: 'No Label',
            classWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Inline',
            layout: 'inline',
            icon: 'label_outline',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          }
        ],
        combos: [
          {
            label: 'Inline',
            layout: 'inline',
            float: '+ Inplace Float',
            floatLayout: 'inplace',
            icon: 'label_outline',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Inline',
            layout: 'inline',
            float: '+ Floating Float',
            floatLayout: 'floating',
            icon: 'label_outline',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Inline',
            layout: 'inline',
            float: '+ Placeholder Float',
            floatLayout: 'placeholder',
            placeholder: 'Placeholder',
            icon: 'label_outline',
            icon2: 'plus_one',
            hint: 'A helpful hint',
            model: '',
            fieldWidth: '',
            targetWidth: '',
            labelWidth: ''
          },
          {
            label: 'Inline',
            layout: 'inline',
            float: '+ Stacked Float',
            floatLayout: 'stacked',
            icon: 'label_outline',
            icon2: 'plus_one',
            hint: 'A helpful hint',
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
        structure: 'item',
        layout: 'items-grid',
        display: 'block',
        debugLabel: false,
        debugTarget: false,
        grid_option: 'gutter',
        grid_cols: 'width-1of2 sm-width-1of1',
        list_options: ['item-delimiter'],
        field: {
          targetWidth: '',
          labelWidth: '',
          targetAlign: '',
          labelAlign: ''
        },
        fieldOpts: {
          background: false,
          icon: false,
          icon2: false,
          hint: false,
          dense: false,
          counter: false
        }
      },
      // Example form
      //
      example: {
        playerName: '',
        firstName: '',
        lastName: '',
        detectiveName: '',
        favouriteDetective: '',
        email: '',
        password: '',
        fave_room: '',
        description: ''
      },
      // Models
      //
      models: {
        range: 7,
        numeric: 99,
        chips: ['Rope', 'Candlestick', 'Lead Pipe', 'Revolver'],
        multiSelect: []
      },
      ddl_structures: [
        {
          label: 'Items',
          value: 'item'
        },
        {
          label: 'Plain',
          value: 'plain-field'
        }
      ],
      ddl_detectives: [
        {
          label: 'Miss Marple',
          value: 'marple'
        },
        {
          label: 'Sherlock Holmes',
          value: 'holmes'
        },
        {
          label: 'John McClane',
          value: 'mcclane'
        },
        {
          label: 'Other',
          value: 'other'
        }
      ],
      ddl_layouts: [
        // {
        //   label: 'in a Row',
        //   value: 'row'
        // },
        {
          label: 'Items in a Grid',
          value: 'items-grid'
        },
        {
          label: 'Fields in a Grid',
          value: 'fields-grid'
        },
        {
          label: 'Items in a List',
          value: 'items-list'
        }
      ],
      ddl_displays: [
        {
          label: 'Default',
          value: ''
        },
        {
          label: 'Block',
          value: 'block'
        },
        {
          label: 'Inline',
          value: 'inline-block'
        }
      ],
      ddl_fieldOpts: [
        {
          label: 'BG',
          value: 'background'
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
          label: 'Shrink',
          value: 'shrink'
        },
        {
          label: 'Grow',
          value: 'grow'
        },
        {
          label: '50%',
          value: '50%'
        },
        {
          label: '150px',
          value: '150px'
        }
      ],
      ddl_alignments: [
        {
          label: 'Default',
          value: ''
        },
        {
          label: 'Left',
          value: 'left'
        },
        {
          label: 'Center',
          value: 'center'
        },
        {
          label: 'Right',
          value: 'right'
        }
      ],
      ddl_colWidths: [
        {
          label: 'No Columns',
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
$layout-small  ?= 600px
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
// Demo styles ------------------------------------------------vvvv
//


label
.stacked-label, .floating-label
  label
    color rgba(255, 255, 255, .54)
.card-actions .q-picker-textfield-label .ellipsis
  color rgba(255, 255, 255, .54)
.card-acrtions .q-picker-textfield-label.active .q-picker-textfield-label .ellipsis
  color rgba(255, 255, 255, .54)

.settings
  .q-picker-textfield
    min-width 60px
    width 65px

.card .card-actions
  xbackground-color #4DB6AC !important


.demoInputWidth
  width 80px
.field-layout-inline
  .demoInputWidth
    width 70px



// Label & Target Debug -----------------v
.bg-field .grid .field
  background-color white
  box-shadow 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) !important
  &:hover
    box-shadow 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23) !important
.card-content.bg-field
  background #f8f8f8

.bg-target .field-target
  xbackground-color #C5CAE9
.bg-label .field-label
  xbackground-color #B2DFDB

.bg-target .field-target
.bg-label .field-float-label
.bg-label .item-label
  position relative
  overflow visible !important

.bg-target .field-target:before
.bg-label .field-float-label:before
.bg-label .item-label:before
  position absolute
  width 100%
  left 0
  top -7px
  height 100%
  box-sizing border-box
  height 100%
  vertical-align top
  padding 2px 4px
  font-size 12px
  font-weight bold
  color white
  z-index 9
  border-top 2px solid white
  transition all .3s !important
.bg-label .field-float-label:before
.bg-label .item-label:before
  text-align left
  background-color #2196F3
  height 25px
  content 'LABEL'
.bg-label .label-align-right label:before
  text-align right
.bg-label .label-align-center label:before
  text-align center
.bg-target .field-target:before
  margin-top 8px
  height 25px
  background-color #66BB6A
  content 'TARGET'


@media only screen and (max-width 600px)
  .grid
    .field-layout-inline
      input[type=text]:not(.field-grow-input input), textarea:not(.field-grow-input textarea)
        width 55px

{}


//
// <q-field> container ------------------------------------------------vvvv
//

// FIELD STRUCTURE
div.field

  // Target-Only
  //
  &.target-only
    display inline-block
    position relative
    padding-top 10px // <-- top of float touches top of field (i.e. no padding)
    padding-bottom 0px
    &.field-dense
      padding-top 4px

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
    display block
    padding-top 0 !important  // <-- padding handled by .item-content
    padding-bottom 0 // <--
    min-height 72px
    &.field-can-msg
      xmin-height 81px
    > i.item-primary
    > i.item-secondary
      margin-top 26px
    > .item-content
      padding-top 20px
      padding-bottom 0px // 10px
      display flex // .row
      flex-direction row // .row
      align-items flex-start // .items-start
      // flex-wrap wrap // .wrap
  &.item.field-dense
    min-height 60px
    &.field-can-msg
      xmin-height 75px
    > i.item-primary
    > i.item-secondary
      font-size 20px
      margin-top 20px
    > .item-content
      padding-top 16px
      padding-bottom 8px

  // field.clean-item
  //
  &.clean-item
    display inline-block
    padding-top 0px
    padding-left 0px
    height auto
    min-height 52px
    &.field-can-msg
      min-height 65px
    > i.item-primary
    > i.item-secondary
      position absolute
      margin 16px 0 0// i.item-primary==margin 12px
      top 0
    > .item-content
      padding-top 10px // <-- top of float touches top of field (i.e. no padding)
      display flex // .row
      flex-direction row // .row
      align-items flex-start // .items-start
      &.has-secondary
        margin-right 36px
    i.item-primary ~ div.item-content
      margin-left 36px
  &.clean-item.field-dense
    min-height 48px
    &.field-can-msg
      min-height 62px
    > i.item-primary
    > i.item-secondary
      font-size 20px
      margin-top 12px
    > .item-content
      padding-top 6px
      &.has-secondary
        margin-right 24px
    i.item-primary ~ div.item-content
      margin-left 24px


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
      width 100%
      position absolute
      margin-top 8px
    &.field-float
      font-style italic
      padding-right 5px

  .item-content
    &.label-align-center label.field-label
      text-align center
      transform-origin center top
    &.label-align-right label.field-label
      text-align right
      transform-origin right top
    &.target-align-center div.field-target
      margin-left auto
      margin-right auto
    &.target-align-right div.field-target
      margin-left auto

  div.field-target
    position relative
    > input, > textarea
      border-bottom 0 !important
      margin 0 !important
    &.field-grow-input
      > input[type=text], > textarea
        width 100% !important
        margin 0px

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
  span.field-validate-msg,
  span.field-hint,
  span.field-counter
    display block
    pointer-events none
    font-size 12px
    transition opacity .3s

  span.field-validate-msg
    position relative
    color $has-error !important
    opacity 0

  span.field-hint ~ span.field-validate-msg
    margin-top -16px

  span.field-hint
    position relative
    color $dark

  span.field-counter
    float right
    color rgba(0,0,0,.38)
    color $dark

// Layout Modifiers / CSS Flags
// ----------------------------

div.field

  // Invalid
  //
  &.field-invalid
    label.item-label, label.field-float-label  // <--- TOO MUCH RED?  DELETE THESE, OR MAKE OPTIONAL?
    // i.item-primary, i.item-secondary  // <--- TOO MUCH RED?  DELETE THESE, OR MAKE OPTIONAL?
      color $has-error !important
    div.field-swoosh
      border-top $textfield-border-size $textfield-border-style $has-error !important
      &:before
        background-color $has-error
    span.field-validate-msg
      opacity 1
    span.field-hint
      opacity 0

  // Too-Long
  // ['pseuedo-invalid'; can trigger independently of 'field-invalid' for counter & underline turning red, and that is all.]
  //
  &.field-invalid-too-long
    span.field-counter
      color $has-error
    div.field-swoosh
      border-top $textfield-border-size $textfield-border-style $has-error !important
      &:before
        background-color $has-error

  // Focus / Hover
  //
  &.field-focus
  &.field:hover:not(.field-disabled)
    label.item-label, label.field-float-label
    i.item-primary, i.item-secondary
      color $form-active-color !important
    label.item-label:after, label.field-float-label:after
      color $required-color
    div.field-swoosh
      border-top $textfield-border-size $textfield-border-style $form-active-color !important
      &:before
        background-color $form-active-color
  &.field-focus
    div.field-target > div.field-swoosh:before
      visibility visible
      width 100%
      left 0

  // Required
  //
  &.field-required
    label.item-label:after, label.field-float-label:after
      content '\00a0*\00a0'
      vertical-align top

  // Disabled
  //
  &.field-disabled
    div.field-swoosh
      border-top-style dotted

  // Readonly
  //
  &.field-read-only
    div.field-swoosh
      border-top-style dotted
      &:before
        height 1px


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



</style>

