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

      <div style="height: 90px;"></div>

      <!-- USAGE -->
      <div ref="tab-usage">

        <div class="card">

          <div class="card-title bg-primary text-white">
            Example Form
          </div>
          <div class='card-content'>

            <!-- 'Root' Field -->
            <q-field
              no-target
              validate
              class="grid small-gutter row wrap"
            >


                <!-- Row 0 -->

                <!-- Form Title -->
                <div class="width-1of1 row">
                  <q-field
                    no-target
                    class="full-width"
                    :dense-vertical='options.fieldOpts.denseVertical'
                  >
                    <i class="field-icon icon-before icon-inverse bg-primary text-white">person_pin</i>
                    <h5>New Player</h5>
                  </q-field>
                </div>



                <!-- Row 1 -->

                <!-- First & Last Names -->
                <div class="width-1of1">

                  <q-field ref="playerName"
                    no-underline
                    validate validate-msg="Both names are required."
                    hint="Use the player's real name here."
                    target-width="grow"
                    :dense-vertical='options.fieldOpts.denseVertical'
                  >
                    <i slot="before" class="field-icon field-icon-before color-if-field-valid hidden show-if-field-valid">sentiment_very_satisfied</i>
                    <i slot="before" class="field-icon field-icon-before text-primary hide-if-field-valid hide-if-field-invalid">sentiment_neutral</i>
                    <i slot="before" class="field-icon field-icon-before hidden show-if-field-invalid">sentiment_very_dissatisfied</i>

                    <q-field
                      label="First Name"
                      validate :validate-msg="false"
                      class="full-width"
                      target-width="grow"
                      :dense-vertical='options.fieldOpts.denseVertical'
                    >
                      <input type="text" v-model="example.firstName" class="w50" required />
                    </q-field>

                    <q-field
                      label="Last Name"
                      validate :validate-msg="false"
                      class="full-width"
                      target-width="grow"
                      :dense-vertical='options.fieldOpts.denseVertical'
                    >
                      <input type="text" v-model="example.lastName" class="w50" required />
                    </q-field>


                  </q-field>

                </div>


                <!-- Row -->

                <!-- Email -->
                <div class="width-2of3">
                  <q-field
                    label="Email"
                    icon="mail_outline"
                    validate
                    target-width="grow"
                    validate="lazy-at-first"
                    validate-msg="That email address is bogus!"
                    class="full-width"
                    :dense-vertical='options.fieldOpts.denseVertical'
                  >
                    <input
                      type="email"
                      class="w60"
                      v-model="example.email"
                  />
                  </q-field>
                </div>



                <!-- Birthday -->
                <div class="width-1of3">
                  <q-field
                    label="Birthday"
                    icon="cake"
                    :dense-vertical='options.fieldOpts.denseVertical'
                  >
                    <q-datetime
                      v-model="example.birthday"
                      type="date"
                    ></q-datetime>
                  </q-field>
                </div>


                <!-- Row -->


                <!-- Password -->
                <div class="width-2of3 sm-width-1of1">
                  <q-field
                    icon="lock_outline"
                    validate
                    validate-msg="Passwords must match."
                    class="full-width"
                    target-width="grow"
                    no-underline
                    :dense-vertical='options.fieldOpts.denseVertical'
                    @input='v => {example.passwordConfirm = ""}'
                  >

                    <q-field
                      label="Password"
                      class="full-width"
                      target-width="grow"
                      :dense-vertical='options.fieldOpts.denseVertical'
                      counter
                    >
                      <input type="password" v-model="example.password" maxlength="8" class="w120" />
                    </q-field>

                    <q-field
                      class="full-width"
                      validate
                      :validate-msg="false"
                      target-width="grow"
                      label="Confirm Password"
                      :dense-vertical='options.fieldOpts.denseVertical'
                      counter
                    >
                      <input type="password" v-model="example.passwordConfirm" maxlength="8" :pattern="example.password" class="w120" />
                    </q-field>

                  </q-field>
                </div>


                <!-- Code Name -->
                <div class="width-1of3 sm-width-1of2">

                  <q-field
                    label="Code Name"
                    slot="after"
                    icon="fingerprint"
                    hint="(Read-only)"
                    :dense-vertical='options.fieldOpts.denseVertical'
                  >
                    <input type="text" readonly v-model="myUserName" class="w110"  />
                  </q-field>

                </div>




                <!-- Row  -->

                <!-- Character DDL -->
                <div class="width-1of1">
                  <q-field
                    label="Character"
                    icon="person_outline"
                    icon-inverse
                    target-width="shrink"
                    hint="This is the player's character."
                    :dense-vertical='options.fieldOpts.denseVertical'
                  >

                    <q-select
                      type="radio"
                      class="text-bold w200"
                      v-model="example.detectiveName"
                      :options="ddl_suspects"
                    ></q-select>
                  </q-field>
                </div>


                <!-- Row  -->

                <!-- Character Description -->
                <div class="width-1of1">
                    <q-field
                      label="Description"
                      icon="face"
                      hint="Description of the player's character goes here."
                      :maxlength="200"
                      validate counter
                      target-width="grow"
                    >
                      <textarea rows="2" v-model="example.description1"></textarea>
                    </q-field>
                </div>


                <!-- Row  -->

                <!-- Weapons -->
                <div class="width-1of1">
                  <q-field
                    label="Preferred Weapons"
                    icon="gesture"
                    target-width="grow"
                  >
                    <q-select
                      type="toggle"
                      v-model="example.weapons"
                      :options="ddl_weapons"
                    ></q-select>
                  </q-field>
                </div>


                <!-- Row -->


                <!-- Starting Amount -->
                <div class="width-3of3">
                  <q-field
                    label="Starting Amount"
                    label-layout="inline"
                    icon="monetization_on"
                    validate
                    layout="floating"
                    icon2="plus_one"
                    prefix="$" postfix=".00"
                  >
                    <input type="number" class="w80 text-right" v-model="example.amount1"  required />
                  </q-field>
                </div>


                <!-- Row -->

                <!-- Hangouts -->
                <div class="width-1of1">
                  <q-field
                    label="Favourite Hangouts"
                    label-layout="stacked"
                    float="Type some rooms"
                    icon="favorite_border"
                    target-width="grow"
                    hint="Rooms this character likes to hang out in."
                  >
                    <q-chips v-model="example.rooms" placeholder="Type more rooms..."></q-chips>
                  </q-field>
                </div>


              </q-field>

            </q-field>



          </div>

        </div>
      </div>

      <!-- Options-->
      <div ref="tab-layout">


        <div class="card">

          <div class="card-title bg-primary text-white">

            Layout Options

          </div>

          <div class="settings card-actions">
            <div class="row wrap">
              <!-- field options -->
              <label v-for="opt in ddl_fieldOpts" class="text-center w60">
                <q-checkbox v-model="options.fieldOpts[opt.value]"></q-checkbox><br />
                {{ opt.label }}
              </label>
            </div>
          </div>

          <div class="card-content">


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
                      :label-layout='field.layout'
                      :float='field.float'
                      :float-layout='field.floatLayout'
                      :item="options.layout.indexOf('items-')>-1"
                      :icon='options.fieldOpts.icon?field.icon:null'
                      :icon2='options.fieldOpts.icon2?field.icon2:null'
                      :hint='options.fieldOpts.hint?field.hint:null'
                      :dense-horizontal='options.fieldOpts.denseHorizontal'
                      :dense-vertical='options.fieldOpts.denseVertical'
                      :iconInverse='options.fieldOpts.iconInverse'
                      :icon2Inverse='options.fieldOpts.icon2Inverse'
                      :inset='options.fieldOpts.inset'
                      :counter='options.fieldOpts.counter'
                      :maxlength='15'
                      :prefix="options.fieldOpts.prefix?'$':''"
                      :postfix="options.fieldOpts.postfix?'.00':''"
                      :before="options.fieldOpts.before?'[Before]':''"
                      :after="options.fieldOpts.after?'[After]':''"
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
                            label="label-width"
                            v-model="options.field.labelWidth"
                            :options="ddl_widths"
                          ></q-select></td>
                      <td><q-select
                            type="radio"
                            label="label-align"
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
                            label="target-width"
                            v-model="options.field.targetWidth"
                            :options="ddl_widths"
                          ></q-select></td>
                      <td><q-select
                            type="radio"
                            label="target-align"
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
                    label-layout="inline"
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
                <q-field item label="No validation" icon="mail_outline" validate>
                  <input type="email">
                </q-field>
              </div>

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Eager" icon="mail_outline" validate>
                  <input type="email">
                </q-field>
              </div>
              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Lazy" icon="mail_outline" validate="lazy">
                  <input type="email">
                </q-field>
              </div>

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Lazy at First" icon="mail_outline" validate="lazy-at-first">
                  <input type="email">
                </q-field>
              </div>
              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Custom Validation Message" icon="mail_outline" validate validate-msg="That ain't no email address, pal!">
                  <input type="email">
                </q-field>
              </div>

              <div class="width-1of2 sm-width-1of1">
                <q-field item label="Immediate Validation" icon="mail_outline" validate validate-immediate>
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

              <q-field item label="Number" icon="looks_one" validate validate-msg="Not a number" target-width="shrink">
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


            <q-field item label="Select" icon="search" validate>
              <q-select
                type="radio"
                v-model="models.select"
                :options="ddl_weapons"
              ></q-select>
            </q-field>

            <q-field item label="Multi-Select" icon="search" validate>
              <q-select
                type="toggle"
                v-model="models.multiSelect"
                :options="ddl_detectives"
              ></q-select>
            </q-field>

            <q-field item label="DateTime" icon="search" validate>
              <q-datetime
                v-model="models.date"
                type="date"
              ></q-datetime>
            </q-field>

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
    characterDescription () {
      if (!this.example.detectiveName) return 'Select a character.'
      return 'Anyone who trifles with ' + this.example.detectiveName + ' gets their just desserts.'
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
    clearPW () {
      console.log('hi')
      this.example.passwordConfirm = ''
    },
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
          iconInverse: false,
          icon2Inverse: false,
          inset: false,
          hint: false,
          denseVertical: false,
          denseHorizontal: false,
          counter: false,
          prefix: false,
          postfix: false,
          before: false,
          after: false
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
        notes: '',
        rooms: ['Library', 'Cellar', 'Billiard Room'],
        weapons: [],
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
        passwordConfirm: '',
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
        select: '',
        chips: ['Rope', 'Candlestick', 'Lead Pipe', 'Revolver'],
        multiSelect: [],
        date: ''
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
          label: 'Icon',
          value: 'icon'
        },
        {
          label: 'Inverse',
          value: 'iconInverse'
        },
        {
          label: 'Icon 2',
          value: 'icon2'
        },
        {
          label: 'Inverse',
          value: 'icon2Inverse'
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
          label: 'Prefix',
          value: 'prefix'
        },
        {
          label: 'Postfix',
          value: 'postfix'
        },
        {
          label: 'Before',
          value: 'before'
        },
        {
          label: 'After',
          value: 'after'
        },
        {
          label: 'Dense-H',
          value: 'denseHorizontal'
        },
        {
          label: 'Dense-V',
          value: 'denseVertical'
        },
        {
          label: 'Inset',
          value: 'inset'
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
          label: 'Colonel Mustard',
          value: 'mustard'
        },
        {
          label: 'Professor Plum',
          value: 'plum'
        },
        {
          label: 'Reverend Green',
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
      ],
      ddl_weapons: [
        {
          label: 'Revolver',
          value: 'Revolver'
        },
        {
          label: 'Rope',
          value: 'Rope'
        },
        {
          label: 'Candlestick',
          value: 'Candlestick'
        },
        {
          label: 'Dagger',
          value: 'Dagger'
        },
        {
          label: 'Lead Pipe',
          value: 'LeadPipe'
        },
        {
          label: 'Spanner',
          value: 'Spanner'
        }
      ]
    }
  }
}
</script>
<style lang='styl'>


//
// Demo styles ------------------------------------------------vvvv
//

.field
  transition all .3s

// Label & Target Debug -----------------v
.bg-field .grid .field
  background-color white
  box-shadow 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) !important
  &:hover
    box-shadow 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23) !important
.card-content.bg-field
  background #f8f8f8

.bg-target .field-target
.bg-label label.field-label-float
.bg-label label.field-label-inline
  position relative
  overflow visible !important
  z-index 10

.bg-target .field-target:before
.bg-label label.field-label-float:before
.bg-label label.field-label-inline:before
  position absolute
  width 100%
  left 0
  top -7px
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
.bg-label label.field-label-float:before
.bg-label label.field-label-inline:before
  text-align left
  background-color #2196F3
  content 'LABEL'
  height 22px
.bg-label label.field-label-inline:before
  margin-top 4px
.bg-label label.label-right:before
  text-align right
.bg-label label.label-center:before
  text-align center
.bg-target .field-target:before
  margin-top 20px
  height 22px
  vertical-align bottom
  background-color #66BB6A
  content 'TARGET'

for num in (0..20)
  .w{num*10+10}
    width (num*10+10)px

</style>

