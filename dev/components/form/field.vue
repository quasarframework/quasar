<template>
  <div>
    <div class="layout-padding" style="max-width: 600px; border: 1px solid black;">
      <q-field label="With Tooltip">
        <q-input v-model="model" :count="10">
          <q-tooltip :offset="[0, 10]">
            Some tooltip
          </q-tooltip>
        </q-input>
      </q-field>
      <q-field label="With Popover">
        <q-input v-model="model" :count="10">
          <q-popover fit :offset="[0, 10]">
            <div style="padding: 10px" class="bg-primary text-white">
              Some Popover
            </div>
          </q-popover>
        </q-input>
      </q-field>
      <q-field label="With Popover (hide underline)">
        <q-input v-model="model" :count="10" hide-underline>
          <q-popover fit :offset="[0, 10]">
            <div style="padding: 10px" class="bg-primary text-white">
              Some Popover
            </div>
          </q-popover>
        </q-input>
      </q-field>

      <q-field>
        <q-input v-model="model" />
      </q-field>

      <h4>Label test</h4>
      <q-field label="No width specified">
        <q-input v-model="model" />
      </q-field>
      <q-field label="Width 12" :label-width="12">
        <q-input v-model="model" />
      </q-field>
      <q-field label="Vertical" orientation="vertical">
        <q-input v-model="model" />
      </q-field>
      <q-field label="Horizontal" orientation="horizontal">
        <q-input v-model="model" />
      </q-field>
      <q-field label="No width specified">
        <q-input stack-label="Stack" v-model="model" />
      </q-field>
      <q-field label="Stack Vertical" orientation="vertical">
        <q-input stack-label="Stack" v-model="model" />
      </q-field>
      <q-field label="Stack Horizontal" orientation="horizontal">
        <q-input stack-label="Stack" v-model="model" />
      </q-field>
      <q-field label="No width specified">
        <q-input float-label="Float" v-model="model" />
      </q-field>
      <q-field label="Float Vertical" orientation="vertical">
        <q-input float-label="Float" v-model="model" />
      </q-field>
      <q-field label="Float Horizontal" orientation="horizontal">
        <q-input float-label="Float" v-model="model" />
      </q-field>

      <div style="height: 50px"></div>

      <q-field count>
        <q-input suffix="#" prefix="@" type="password" v-model="model" />
      </q-field>

      <q-field :count="10">
        <q-input suffix="#" prefix="@" type="textarea" v-model="model" />
      </q-field>

      <q-field
        icon="cloud"
      >
        <q-input suffix="#" prefix="@" v-model="model" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
      >
        <q-input suffix="#" prefix="@" v-model="model" :count="10" />
      </q-field>

      <p class="caption">Hide Underline</p>

      <q-field>
        <q-input v-model="model" hide-underline />
      </q-field>

      <q-field count>
        <q-input suffix="#" prefix="@" type="password" v-model="model" hide-underline />
      </q-field>

      <q-field :count="10">
        <q-input suffix="#" prefix="@" type="textarea" v-model="model" hide-underline />
      </q-field>

      <q-field
        icon="cloud"
      >
        <q-input suffix="#" prefix="@" v-model="model" hide-underline />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
      >
        <q-input suffix="#" prefix="@" v-model="model" :count="10" hide-underline />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Label"
      >
        <q-input suffix="#" prefix="@" v-model="model" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
      >
        <q-input suffix="#" prefix="@" v-model="model" float-label="Float Label" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Label"
      >
        <q-input suffix="#" prefix="@" v-model="model" stack-label="Stacked Label" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
      >
        <q-input suffix="#" prefix="@" v-model="model" stack-label="Stacked Label" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-option-group
          type="radio"
          v-model="option"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3' },
            { label: 'Option 4', value: 'op4' }
          ]"
        />
      </q-field>

      <q-field
        class="bg-grey-9 text-light q-pa-sm"
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-option-group
          dark
          type="radio"
          v-model="option"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3' },
            { label: 'Option 4', value: 'op4' }
          ]"
        />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        error="error"
        error-label="Error!"
        label="Horizontal"
        orientation="horizontal"
      >
        <q-input suffix="#" prefix="@" v-model="model" :count="10" />
      </q-field>

      <q-field
        icon="warning"
        helper="Helper"
        :warning="warning"
        warning-label="Warning!"
        label="Horizontal Warning"
        orientation="horizontal"
      >
        <q-input suffix="#" prefix="@" v-model="model" :count="10" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        error="error"
        error-label="Error!"
        label="Vertical"
        orientation="vertical"
      >
        <q-input suffix="#" prefix="@" v-model="model" :count="10" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        orientation="horizontal"
        error-label="Max 10 characters!"
      >
        <q-input suffix="#" prefix="@" v-model="model" :count="10" />
      </q-field>

      <q-field
        label="Knob"
        helper="Touch to change"
        icon="cake"
        :error="error"
      >
        <q-knob
          v-model="knob"
          :min="knobMin"
          :max="knobMax"
        >
          <q-icon class="on-left" name="volume_up" /> {{knob}}
        </q-knob>
      </q-field>

      <div class="bg-grey-9" style="padding: 10px">
        <q-field
          label="Knob"
          helper="Touch to change"
          dark
          icon="cake"
          :error="error"
        >
          <q-knob
            v-model="knob"
            :min="knobMin"
            :max="knobMax"
          >
            <q-icon class="on-left" name="volume_up" /> {{knob}}
          </q-knob>
        </q-field>
      </div>

      <q-field
        icon="cloud"
        helper="Helper Helper Helper Helper Helper Helper Helper Helper Helper"
        label="Horizontal Horizontal Horizontal Horizontal Horizontal Horizontal"
        orientation="horizontal"
        error-label="Max 10 characters!"
      >
        <q-input suffix="#" prefix="@" v-model="model" :count="10" float-label="Float label Float label Float label Float label Float label Float label" />
      </q-field>

      <q-field
        icon="account_balance"
        label="Some label"
      >
        Some text
      </q-field>
      <q-field
        icon="account_balance"
        label="Some label Some label Some label Some label Some label Some label"
      >
        Some text
      </q-field>
      <q-field
        inset="icon"
        label="Some label"
      >
        Some text
      </q-field>
      <q-field
        inset="icon"
        label="Some label Some label Some label Some label Some label Some label Some label"
      >
        Some text
      </q-field>

      <q-field
        icon="cloud"
        helper="Horizontal"
        orientation="horizontal"
      >
        <q-input v-model="model" float-label="Floating $ Label" suffix="#" prefix="@" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        orientation="horizontal"
      >
        <q-input v-model="model" float-label="Floating $ Label" suffix="#" prefix="@"/>
      </q-field>

      <q-field
        helper="Helper"
        label="Label"
        inset="icon"
      >
        <q-input v-model="model" float-label="Floating $ Label" suffix="#" prefix="@" />
      </q-field>

      <q-field
        helper="Helper"
        inset="full"
      >
        <q-input v-model="model" float-label="Floating $ Label" suffix="#" prefix="@" />
      </q-field>

      <q-field
        helper="Helper"
        :label-width="2"
        label="Label width 2"
        inset="label"
      >
        <q-input v-model="model" float-label="Floating $ Label" suffix="#" prefix="@" />
      </q-field>

      <q-field
        helper="Helper"
        label="Label with Hint"
        label-hint="Label Hint"
      >
        <q-input v-model="model" float-label="Floating $ Label" suffix="#" prefix="@" />
      </q-field>

      <q-field
        helper="Helper"
        label="Label with Hint"
      >
        <span slot="labelHint">Label Hint with slot</span>
        <q-input v-model="model" float-label="Floating $ Label" suffix="#" prefix="@" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Label"
      >
        <q-input v-model="model" stack-label="Stacked $ Label" suffix="#" prefix="@" />
      </q-field>
      <q-field
        icon="cloud"
        helper="Helper"
        label="Label"
      >
        <q-input v-model="model" float-label="Float $ Label" suffix="#" prefix="@" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Label"
      >
        <div class="row">
          <q-input class="col" v-model="model" stack-label="Stacked $ Label" suffix="#" prefix="@" :inline-count="10"/>
          <q-input class="col" v-model="model" stack-label="Stacked $ Label" suffix="#" prefix="@" :inline-count="10"/>
        </div>
      </q-field>

      <q-field icon="cloud">
        <q-select filter v-model="select" :options="selectListOptions" stack-label="Stack label with filter"></q-select>
      </q-field>
      <q-field icon="cloud">
        <q-select filter inverted v-model="select" :options="selectListOptions" stack-label="Stack label with filter"></q-select>
      </q-field>
      <q-field icon="cloud">
        <q-select filter v-model="select" :options="selectListOptions" float-label="Float label with filter"></q-select>
      </q-field>
      <q-field icon="cloud">
        <q-select filter inverted v-model="select" :options="selectListOptions" float-label="Float label with filter"></q-select>
      </q-field>
      <q-field icon="cloud">
        <q-select v-model="select" :options="selectListOptions" stack-label="Stack label without filter"></q-select>
      </q-field>
      <q-field icon="cloud">
        <q-select inverted v-model="select" :options="selectListOptions" stack-label="Stack label without filter"></q-select>
      </q-field>
      <q-field icon="cloud">
        <q-select v-model="select" :options="selectListOptions" float-label="Float label without filter"></q-select>
      </q-field>
      <q-field icon="cloud">
        <q-select inverted v-model="select" :options="selectListOptions" float-label="Float label without filter"></q-select>
      </q-field>

      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-input v-model="model" float-label="Float label" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-chips-input v-model="modelA" float-label="Float label" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-color v-model="modelC" float-label="Float label" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-color-picker v-model="modelC" float-label="Float label" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-search v-model="model" placeholder="Start typing">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" />
        </q-search>
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-input v-model="model" placeholder="Start typing">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" />
        </q-input>
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-slider v-model="knob" :min="knobMin" :max="knobMax" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-datetime v-model="modelD" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="12">
        <q-datetime-picker v-model="modelD" type="datetime" vertical />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-select v-model="select" :options="selectListOptions" float-label="Float label" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-rating v-model="knob" :max="knobMax" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-knob v-model="knob" :min="knobMin" :max="knobMax" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-option-group
          type="radio"
          v-model="model"
          :options="[
            { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
            { label: 'Option 3', value: 'op3', color: 'secondary' },
            { label: 'Option 4', value: 'op4', color: 'amber' }
          ]"
        />
      </q-field>


      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-input inverted v-model="model" float-label="Float label" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-chips-input inverted v-model="modelA" float-label="Float label" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-chips-input inverted v-model="modelA" float-label="Float label" color="orange" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-chips-input inverted v-model="modelA" float-label="Float label" color="orange" frame-color="green" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-chips-input inverted v-model="modelA" float-label="Float label" color="orange" frame-color="white" :dark="false" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-color inverted v-model="modelC" float-label="Float label" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-search inverted v-model="model" placeholder="Start typing">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" />
        </q-search>
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-input inverted v-model="model" placeholder="Start typing">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" />
        </q-input>
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-datetime inverted v-model="modelD" />
      </q-field>
      <q-field icon="cloud" :error="error" :warning="warning" label="Field label" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-select inverted v-model="select" :options="selectListOptions" float-label="Float label" />
      </q-field>


      <q-field v-if="cond1" icon="cloud" :error="error" :warning="warning" label="Test field" helper="Field helper text" error-label="Field error label" :label-width="3">
        <q-input v-if="cond2" v-model="model" placeholder="Test control">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" />
        </q-input>
        <div v-else>Control is not rendered now</div>
      </q-field>
      <q-field v-if="cond1" icon="cloud" :error="error" :warning="warning" label="Test field" helper="Field helper text" error-label="Field error label" :label-width="3">
        <div>
          <q-input v-if="cond2" v-model="model" placeholder="Test control">
            <q-autocomplete :static-data="{field: 'value', list: numbers}" />
          </q-input>
          <div v-else>Control is not rendered now</div>
        </div>
      </q-field>
      <q-field v-if="cond1" icon="cloud" :error="error" :warning="warning" label="Test field" helper="Field helper text" error-label="Field error label" :label-width="3">
        <div v-if="cond2">
          <q-input v-model="model" placeholder="Test control">
            <q-autocomplete :static-data="{field: 'value', list: numbers}" />
          </q-input>
        </div>
        <div v-else>Control is not rendered now</div>
      </q-field>
      <q-field v-if="cond1" icon="cloud" :error="error" :warning="warning" label="Test field" helper="Field helper text" error-label="Field error label" :label-width="3">
        <div v-if="cond2">
          <q-input v-if="cond2" v-model="model" placeholder="Test control">
            <q-autocomplete :static-data="{field: 'value', list: numbers}" />
          </q-input>
        </div>
        <div v-else>Control is not rendered now</div>
      </q-field>
      <q-field v-if="cond1" icon="cloud" :error="error" :warning="warning" label="Test field" helper="Field helper text" error-label="Field error label" :label-width="3">
        <div v-if="cond2">
          <q-option-group v-if="cond2"
            type="radio"
            v-model="model"
            :options="[
              { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
              { label: 'Option 3', value: 'op3', color: 'secondary' },
              { label: 'Option 4', value: 'op4', color: 'amber' }
            ]"
          />
        </div>
        <div v-else>Control is not rendered now</div>
      </q-field>
      <div class="row">
        <div class="col-xs-6">
          <q-toggle v-model="cond1" label="Render test field" />
        </div>
        <div class="col-xs-6">
          <q-toggle v-model="cond2" label="Render test ctrl" />
        </div>
      </div>
    </div>
    <div class="fixed-bottom-right">
      <label>
        <q-checkbox v-model="error" />
        Error
      </label>
      <label>
        <q-checkbox v-model="warning" />
        Warning
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      option: '',
      error: true,
      warning: true,
      model: 'Some input',
      modelX: 'sdflkjsbnfkjdabfa dfasldgfa gfg lasdfl gasdf asdfhl asdgfgasdlf hlahf lsadf asdhlf hasdhadlfasdhfadf hasdg lfasdg lfgasdfasdflasdhfgasdljfljasdh fsdkjfgasdf gjasdgfjasdljgasdjk gjlasdfa sdfgasdljf gljasdfgljasd',
      modelY: '',
      modelA: ['aaa', 'bbb'],
      modelC: '#f45',
      modelD: new Date(),
      numberModel: 5555,
      nullModel: null,
      knob: 10,
      knobMin: 0,
      knobMax: 30,
      select: undefined,
      selectListOptions: [
        {
          label: 'Google',
          icon: 'email',
          value: 'goog'
        },
        {
          label: 'Facebook',
          inset: true,
          description: 'Enables communication',
          value: 'fb'
        },
        {
          label: 'Twitter',
          inset: true,
          rightIcon: 'alarm',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          inset: true,
          stamp: '10 min',
          value: 'appl'
        },
        {
          label: 'Oracle',
          description: 'Some Java for today?',
          icon: 'mail',
          rightIcon: 'alarm',
          value: 'ora'
        }
      ],
      numbers: [1, 2, 3, 4, 5, 1111, 2222, 3333, 4444, 5555].map(v => ({ label: String(v), value: v })),
      cond1: true,
      cond2: false
    }
  }
}
</script>

<style lang="stylus">
.q-field
  // border 1px solid black
  // padding 0

.q-input
  // border 1px solid black
.q-input + .q-field
  // margin-top 50px

.inline-example
  margin 13px 0
</style>
