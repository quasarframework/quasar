<template>
  <div>

    <div class="layout-header fixed-top hidden">

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

            <!-- 'Root' Field -->
            <q-field no-target validate class="grid small-gutter row wrap">

                <!-- Form Title -->
                <div class="width-1of1 row">
                  <q-field
                    no-target
                    class="full-width"
                  >
                    <i class="field-icon icon-before icon-inverse bg-primary text-white">person_pin</i>
                    <h5>New</h5>
                  </q-field>
                </div>

                <!-- First & Last Names -->
                <div class="width-1of1">

                  <q-field ref="playerName"
                    no-underline
                    label=""
                    label-layout="inline"
                    target-width="grow"
                    validate
                    validate-msg="Both names are required."
                    hint="Use the player's real name here."
                  >
                    <i slot="before" class="field-icon field-icon-before color-if-field-valid hidden show-if-field-valid">sentiment_very_satisfied</i>
                    <i slot="before" class="field-icon field-icon-before text-primary hide-if-field-valid hide-if-field-invalid">sentiment_neutral</i>
                    <i slot="before" class="field-icon field-icon-before hidden show-if-field-invalid">sentiment_very_dissatisfied</i>

                    <q-field
                      class="full-width"
                      target-width="grow"
                      label="First Name"
                      validate :validate-msg="false"
                    >
                      <input type="text" v-model="example.firstName" class="w50" required />
                    </q-field>

                    <q-field
                      class="full-width" target-width="grow"
                      label="Last Name"
                      validate :validate-msg="false"
                    >
                      <input type="text" v-model="example.lastName" class="w50" required />
                    </q-field>


                  </q-field>

                </div>


                <!-- 2nd Row -->

                <!-- Email -->
                <div class="width-2of3 sm-width-1of2">
                  <q-field
                    label="Email"
                    icon="mail_outline"
                    validate
                    target-width="grow"
                    validate="lazy-at-first"
                    validate-msg="That email address is bogus!"
                    class="full-width"
                  >
                    <input
                      type="email"
                      class="w60"
                      v-model="example.email"
                  />
                  </q-field>
                </div>

                <!-- Code Name -->
                <div class="width-1of3">

                  <q-field
                    slot="after"
                    dense-horizontal
                    icon="fingerprint"
                    label="Code Name"
                    hint="(Read-only)"
                  >
                    <input type="text" readonly v-model="myUserName" class="w110"  />
                  </q-field>
                </div>


                <!-- Email -->
                <div class="width-3of3 sm-width-1of2">
                  <q-field
                    label="Favourite Rooms"
                    icon="person"
                    target-width="grow"
                    validate="lazy-at-first"
                  >
                    <q-chips v-model="example.rooms" placeholder="Type some names"></q-chips>
                  </q-field>
                </div>
                <div class="width-2of3 sm-width-1of2">
                  <q-field
                    label="Suspect List"
                    icon="person"
                    validate
                    target-width="grow"
                    validate="lazy-at-first"
                    validate-msg="That email address is bogus!"
                    class="full-width"
                  >
                    <q-search
                      v-model="example.search"
                    ></q-search>
                  </q-field>
                </div>

                <!-- User ID -->
  <!--               <div class="width-1of4">

                </div> -->

                <!-- Character -->
<!--                 <div class="width-1of1 row">
                  <q-field :targeted="false" class="full-width">
                    <i class="field-icon icon-inverse bg-primary text-white">search</i>
                    <h6 class="field-valid-text-valid" style="margin-top:12px">Character</h6>
                  </q-field>
                </div> -->


                <!-- GAME CHARACTER -->

                <!-- Form Title -->
                <!-- <div class="width-1of1 row">
                  <q-field
                    no-target
                    class="full-width"
                  >
                    <i class="field-icon icon-inverse bg-primary text-white">person_outline</i>
                    <h5 class="field-valid-text-valid" style="margin-top:12px">Player Character</h5>
                  </q-field>
                </div>
 -->
                <div class="width-1of1 sm-width-1of1">

                  <!-- Character DDL -->
                  <q-field
                    label="Role"
                    icon="person_outline"
                    icon-inverse
                    target-width="shrink"
                    hint="This is the player's charracter."
                  >

                    <q-select
                      type="radio"
                      style="width:140px"
                      class="text-bold"
                      v-model="example.detectiveName"
                      :options="ddl_suspects"
                    ></q-select>
                  </q-field>

                </div>






               <!-- Phone -->
<!--                 <div class="width-1of3 sm-width-1of2">
                  <q-field
                    label="Phone"
                    label-layout="stacked"
                    icon="phone"
                    class="full-width"
                    target-width="grow"
                    dense-horizontal
                    no-underline
                    validate
                  >
                    <q-field
                      target-width="shrink"
                      validate
                      :validate-msg='false'
                      prefix="("
                      postfix=")"
                    >
                      <input
                        type="text"
                        pattern="[0-9 ]+"
                        class="w20 text-center"
                        v-model="example.areaCode"
                        maxlength="3"
                    />
                    </q-field>
                    <q-field
                      validate
                      pattern="[0-9 ]+"
                      :validate-msg='false'
                    >
                      <input
                        type="text"
                        pattern="[0-9 ]+"
                        class="w60"
                        v-model="example.mobile"
                    />
                    </q-field>
                </div>
 -->

                <!-- Birthday -->
                <div class="width-1of3 sm-width-1of2">
                  <q-field
                    label="Birthday"
                    icon="cake"
                  >
                    <q-datetime
                      v-model="example.birthday"
                      type="date"
                    ></q-datetime>
                  </q-field>
                </div>




                <!-- Starting Amount -->
                <div class="width-3of3">
                  <q-field
                    label="Starting Amount"
                    prefix="$" postfix=".00"
                    target-width="shrink"
                    validate
                    layout="floating"
                  >
                    <input type="text" class="w60 text-right" numeric v-model="example.amount1"  required />
                  </q-field>
                </div>


                <div class="width-3of3">
                  <q-field label="Normal Field"
                    counter :maxlength="4"
                    validate
                    layout="floating"
                    icon2="plus_one"
                    prefix="$" postfix=".00"
                  >
                    <input type="text" v-model="example.firstName"  required />
                  </q-field>
                </div>


                <div class="width-3of3">
                  <q-field label="Normal Field"
                    counter :maxlength="4"
                    validate
                    layout="floating"
                    icon2="plus_one"
                    prefix="$" postfix=".00"
                  >
                    <q-rating
                      class="orange"
                      v-model="example.rating"
                      :max="5"
                    ></q-rating>
                  </q-field>
                </div>


                </div>

                <!-- Birthday -->
                <div class="width-1of3 sm-width-1of2">
                  <q-field
                    label="Birthday"
                    icon="cake"
                  >
                    <q-datetime
                      v-model="example.birthday"
                      type="date"
                    ></q-datetime>
                  </q-field>
                </div>

                <div class="width-1of4">
                  <q-field
                    label="Starting Amount"
                    dense-horizontal
                    prefix="$" postfix=".00"
                    target-width="shrink"
                    validate
                    layout="floating"

                  >
                    <input type="text" class="w60 text-right" numeric v-model="example.amount1"  required />
                  </q-field>
                </div>

                <div class="width-2of4">
                  <q-field label="Normal Field"
                    counter :maxlength="4"
                    validate
                    layout="floating"
                    icon2="plus_one"
                    prefix="$" postfix=".00"
                  >
                    <input type="text" v-model="example.firstName"  required />
                  </q-field>
                </div>

                <div class="width-2of4 sm-width-1of1" >
                  <q-field item label="Detective Name" :maxlength="5" validate hint='E.g. "Sam Spade"' icon="search">
                    <input type="text" class="demoInputWidth" v-model="example.detectiveName" required />
                  </q-field>
                </div>

                <div class="width-1of4">
                  <q-field item label="Password" validate icon="lock_outline" :maxlength="5">
                    <input type="password" style="width: 50px;" maxlength="4" counter v-model="example.password" required />
                  </q-field>
                </div>

                <div class="width-2of4 sm-width-1of1">

                </div>

              </q-field>

            </q-field>



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
                <!-- Birthday -->
                <div class="width-1of3 sm-width-1of2">
                  <q-field
                    dense-horizontal
                    label="Birthday"
                    label-layout="stacked"
                    icon="cake"
                  >
                    <q-datetime

                      v-model="example.birthday"
                      type="date"
                    ></q-datetime>
                  </q-field>
                </div>

                    <q-field
                      :data-target-info="'Width ' + (options.field.targetWidth?options.field.targetWidth:field.targetWidth) + ', Align ' + (options.field.targetAlign?options.field.targetAlign:field.targetAlign)"
                      :data-label-info="'Width ' + (options.field.labelWidth?options.field.labelWidth:field.labelWidth) + ', Align ' + (options.field.labelAlign?options.field.labelAlign:field.labelAlign)"
                      :label='field.label'
                      :label-layout='field.layout'
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
                      <input type="text" class="w90" v-model='field.model' :placeholder='field.placeholder'/>
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
                    :label-layout='field.layout'
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
                    label-layout="inline"
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
                    label-layout="stacked"
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

                    label-layout="stacked"
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

              <q-field  label="Plain Text" icon="text_fields">
                <input type="text" />
              </q-field>

              <q-field  label="Email" icon="email" validate validate-msg="Invalid email address">
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
            <q-field item label="Numeric" label-layout="inline" icon="looks_two">
              <q-numeric
                v-model="models.numeric"
                :min="1"
                :max="100"
              ></q-numeric>
            </q-field>

            <q-field item label="Chips" target-width="grow" label-layout="stacked"  icon="code">
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
    myUserName () {
      function cap (str) {
        str = str.replace(/\s/g, '')
        str = str.toLowerCase().charAt(0).toUpperCase() + str.slice(1)
        return str
      }
      let
        l1 = Math.min(this.example.lastName.length, 3),
        l11 = Math.min(this.example.lastName.length, 1),
        l2 = Math.min(this.example.firstName.length, 1),
        l3 = Math.min(this.example.firstName.length, 3),
        word1 = this.example.lastName.substring(0, l1) + 'Bana'.substring(l1),
        word11 = this.example.lastName.substring(0, l11) + 'na'.substring(l11),
        word2 = this.example.firstName.substring(0, l2) + 'fo'.substring(l2),
        word3 = this.example.firstName.substring(0, l3) + 'Fana'.substring(l3),
        out = cap(word1) + cap(word11).toLowerCase() + ' ' + cap(word3) + word2.toLowerCase()
      return out
    },
    playerNameValidIcon () {
      if (!this.$refs.playerName) {
        return 'clear'
      }
      else if (this.$refs.playerName.state.hasInvalid === false) {
        return 'clear'
      }
      else if (this.$refs.playerName.state.hasInvalid === true) {
        return 'done'
      }
      else {
        return ' '
      }
    }
  },
  methods: {
    doClick () {
      console.log('ckicklckl')
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
        userName: '',
        birthday: '',
        detectiveName: '',
        rooms: ['Conservatory', 'Billiard Room', 'Library', 'Cellar', 'Hall'],
        mobile: '',
        phone: '',
        areaCode: '61',
        favouriteDetective: '',
        email: '',
        amount1: '',
        amount2: '',
        amount3: '',
        amount4: '',
        amount5: '',
        amount6: '',
        password: '',
        fave_room: '',
        description1: '',
        description2: '',
        search: '',
        rating: 0
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
field-active-primary
field-active-secondary
field-active-tertiary
field-active-show
field-active-hide

label-color
has-error


// list styl
$item-primary-secondary-color ?= rgb(117, 117, 117)
$item-content-label-color     ?= rgba(0, 0, 0, .87)
$item-label-color             ?= rgba(0, 0, 0, .54)

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


// typography.mat.styl

h1, h2, h3, h4, h5, h6
  font-weight 400
  line-height 110%
  -webkit-font-smoothing antialised

h1
  font-size 4.2rem
  letter-spacing -.04em
  margin 2.1rem 0 1.68rem
  font-weight 300

h2
  font-size 3.56rem
  letter-spacing -.02em
  margin 1.78rem 0 1.424rem

h3
  font-size 2.92rem
  margin 1.46rem 0 1.168rem

h4
  font-size 2.28rem
  margin 1.14rem 0 .912rem

h5
  font-size 1.64rem
  margin .82rem 0 .656rem
  -moz-osx-font-smoothing grayscale

h6
  font-size 1rem
  letter-spacing .02em
  margin .5rem 0 .4rem
  font-weight 500

p
  font-size 1rem
  letter-spacing 0
  margin 0 0 1rem
  line-height 24px
  padding 0
  -webkit-font-smoothing antialiased
  &.caption
    font-weight 300
    &:not(:first-child)
      margin-top 2rem


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
// OLD Demo styles ------------------------------------------------vvvv
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
.field-label-inline
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
    .field-label-inline
      input[type=text]:not(.field-grow-input input), textarea:not(.field-grow-input textarea)
        width 55px

for num in (0..20)
  .w{num*10+10}
    width (num*10+10)px


//
// Demo styles ------------------------------------------------^^^^^



// TODO: Some of the more complex rules below could be done better with pre-calculated CSS matching esp. inline margins, padding w/o icons etc. (Micro-optimisation?)



// NEW MATERIAL styles ------------------------------------------------vvvv
//


// Nested / Inline Fields
.field > .field,
.field > .field-target > .field-input > .field
  min-height initial
  padding-top 0
  padding-bottom 0

.field + .field
  margin-left 8px !important

// Vue Component Adjustments
.q-chips
  margin 8px 0 0 0
  padding 8px 0 7px 0
  .q-chips-input
    margin-bottom 0


// Field
.field
  position relative
  display flex
  min-height 72px
  padding-top 10px
  padding-bottom 0
  flex-direction row
  align-items flex-start
  margin 0px

  // Global adjustment
  .pad-left
    padding-left 16px
  .inset
    padding-left 72px
  .pad-right
    padding-right 16px

  // Icons
  > .field-icon
    color $item-primary-secondary-color
    transition color .3s
    height 24px
    width 24px
    min-width 24px
    margin 16px 12px 0 12px
    font-size 24px
    line-height 24px
    border-radius 50%
    transition all .45s cubic-bezier(0.25, 0.8, 0.25, 1)
    &.icon-inverse
      margin-top 8px
      height 28px
      width 28px
      min-width 28px
      padding 8px 4px 4px 8px
      color $white
      background-color $item-primary-secondary-color
  > .field-icon-before
    margin-right 36px
    &.icon-inverse
      margin-right 20px
  > .field-icon-after
    margin-left 36px
    &.icon-inverse
      margin-left 20px

  // Labels
  > .field-label-inline,
  > .field-target > .field-input > .field-label-float
    // transition transform .5s cubic-bezier(0.25, 0.8, 0.25, 1), color .3s, font-size .5s, opacity .3s, padding .5s cubic-bezier(0.25, 1, 0.25, 0.8)
    transition all .3s cubic-bezier(0.25, 0.8, 0.25, 1)
    transform-origin left top
    color rgba(0, 0, 0, .54)
    left 0
    line-height 16px
    margin-top 16px
    pointer-events none
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
  > .field-label-inline
    margin-right 10px
  > .field-target > .field-input > .field-label-float
    width 100%
    position absolute
    > span
      transition inherit
      visibility hidden
      font-size $textfield-font-size
      &:first-child
        padding-right 5px
      &:last-child
        padding-left 5px

  &.label-as-text // render inline or float label as plain text (no required indicator or active color, italics)
    font-style italic
    padding-right 5px
  &.label-center
    text-align center
    transform-origin center top
  &.label-right
    text-align right
    transform-origin right top
  &.target-center
    margin-left auto
    margin-right auto
  &.target-right
    margin-left auto

  // Prefix/Postfix Before/After Spans
  > span,
  > .field-target > .field-input > span
    margin 16px 0 0 0 !important
    border-bottom 0 !important
    line-height 16px
    font-size $textfield-font-size
    white-space nowrap

  // Target
  > .field-target
    xborder 1px dotted red

    // Input
    > .field-input
      position relative
      min-height 40px
      transition-duration .2s
      transition-timing-function cubic-bezier(.4, 0, .2, 1)
      > :not(:last-child):not(label)
        margin-right 2px !important

      &.underline
        margin-bottom 3px
        border-bottom $textfield-border-size $textfield-border-style $textfield-border-color
        &:after
          content ''
          display block
          position absolute
          visibility hidden
          bottom -2px
          width 2px
          height $textfield-border-size + 1
          left 49%
          background-color $form-active-color
          transition-duration .2s
          transition-timing-function cubic-bezier(.4, 0, .2, 1)

      // Text Inputs & Sub-Components
      > input, > textarea, > div
        border-bottom 0 !important
        max-width 100% !important
      > div:not(.field)
        padding-top 8px
        padding-bottom 7px !important
        margin 8px 0 0 0
      > input, > textarea
        line-height 16px
        margin 8px 0 0 0 !important
        padding-bottom 7px !important
        box-shadow none
      &.field-input-grow
        > input, > textarea, > div
          flex-grow 1

    // Counter / Hint / Validate Msg
    > .field-counter,
    > .field-hint,
    > .field-validate-msg
      display block
      font-size 12px
      pointer-events none
      transition opacity .3s

    > .field-counter
      float right
      color rgba(0,0,0,.38)
      color $dark

    > .field-hint
      position absolute
      color $dark

    > .field-validate-msg  // (TODO: Multiple validate msgs)
      position absolute
      color $has-error !important
      opacity 0


// Layout Modifiers / CSS Flags
// ----------------------------
.field
  // Dense-vertical
  &.field-dense-vertical
    min-height  60px

  // Dense-horizonal
  &.field-dense-horizontal
    > .field-icon:first-child
      margin-right 12px
    > .field-icon:last-child
      margin-left 12px
/*
    &.inset
      padding-left 48px
    &.pad-left
      padding-left 8px
    &.pad-right
      padding-right 8px*/
  // Required
  //
  &.field-required
    > .field-label-inline,
    > .field-target > .field-input > .field-label-float
      > div
        display inline-block
        padding-left 2px

  // Hover & Focus
  //
  &.field-focus,
  &.field:hover:not(.field-disabled)
    > .field-icon
      color $form-active-color
      &.icon-inverse
        color $white !important
        background-color $form-active-color
    > .field-label-inline,
    > .field-target > .field-input > .field-label-float
      color $form-active-color
      > div
        color $required-color
    > .field-target > .field-input
      &.underline
        border-bottom $textfield-border-size $textfield-border-style $form-active-color
  &.field-focus
    > .field-target > .field-input
      &.underline
        border-bottom $textfield-border-size $textfield-border-style $form-active-color
        &:after
          background-color $form-active-color
          visibility visible
          width 100%
          left 0

  // Invalid
  //
  &.field-invalid
    > .field-icon-before  // <--- TOO MUCH RED?  DELETE THESE, OR MAKE OPTIONAL?
      color $has-error !important
      &.icon-inverse
        color $white !important
        background-color $has-error !important
    > .field-label-inline,
    > .field-target > .field-input > .field-label-float
      color $has-error !important
    > .field-target > .field-input
      &.underline
        border-bottom $textfield-border-size $textfield-border-style $has-error !important
        &:after
          background-color $has-error !important
    > .field-target
      > .field-validate-msg
        opacity 1
        position relative
      > .field-hint
        opacity 0
        position absolute

  // Too-Long
  // ['pseuedo-invalid'; can trigger independently of 'field-invalid' for counter & underline turning red, and that is all.]
  //
  &.field-invalid-too-long
    > .field-target > .field-input
      &.underline
        border-bottom $textfield-border-size $textfield-border-style $has-error !important
        &:after
          background-color $has-error
    > .field-target
      > .field-counter
        color $has-error

  // Disabled
  //
  &.field-disabled
    > .field-target > .field-input
      border-bottom-style dotted

  // Readonly
  //
  &.field-read-only
    > .field-target > .field-input
      border-bottom-style dotted
      &:after
        height 1px


// Float/Float-Label Mixins
// -------------------------

// No Label
&.field-label-nolabel
  > .field-label-inline,
  > .field-target > .field-input > .field-label-float
    display none

// Label vanishes
&.field-label-inplace.field-active, &.field-label-placeholder
  > .field-label-inline,
  > .field-target > .field-input > .field-label-float
    opacity 0

// Label appears
&.field-label-stacked, &.field-label-floating, &.field-label-placeholder.field-active.field-value
  > .field-label-inline,
  > .field-target > .field-input > .field-label-float
    opacity 1

// Label goes above input
&.field-label-stacked, &.field-label-floating.field-active, &.field-label-placeholder
  > .field-label-inline,
  > .field-target > .field-input > .field-label-float
    transform translateY(-18px) scale(.8)
    > span
      // transform scale(0.5)
      font-size 0
      padding 0
  &.field-dense
    > .field-label-inline,
    > .field-target > .field-input > .field-label-float
        transform translateY(-14px) scale(.8)


// Field State CSS Styles
// -------------------------

fieldStates ?= ('field-valid' 'field-invalid' 'field-active' 'field-focus' 'field-disabled' 'field-pristine' 'field-dirty')
fieldColors ?= $positive $has-error $primary $primary $light $light

for state, i in fieldStates
  color = fieldColors[i]
  .{state}
    > .color-if-{state}
    :not(.field) .color-if-{state}
      color color !important
  .{state}
    > .bg-if-{state}
    :not(.field) .bg-if-{state}
      background-color color !important
  .{state}
    > .show-if-{state}
    :not(.field) .show-if-{state}
      display block !important
  .{state}
    > .hide-if-{state}
    :not(.field) .hide-if-{state}
      display none !important


</style>

