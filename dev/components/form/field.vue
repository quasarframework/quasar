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

      <q-field>
        <q-input v-model="model" />
      </q-field>

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
      ]
    }
  }
}
</script>

<style lang="styl">
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
