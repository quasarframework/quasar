<template>
  <div>
    <div class="layout-padding" style="max-width: 600px;">
      <q-input v-model="modelY" autogrow />
      <q-input type="textarea" v-model="modelX" autogrow />


      <q-input
        v-model="model"
      />
      {{nullModel}}
      <q-input
        v-model="nullModel"
      />
      <q-input
        v-model="model"
        float-label="Floating Label"
      />
      <q-input
        v-model="model"
        stacked-label="Stacked Label"
      />

      <p class="caption">Clear</p>
      <q-input
        v-model="model"
        clear
      />
      <q-input
        v-model="model"
        float-label="Floating Label"
        clear
      />
      <q-input
        v-model="model"
        stacked-label="Stacked Label"
        clear
      />

      <p class="caption">XYZ</p>

      <q-input
        v-model="model"
        prefix="$"
        suffix=".00"
      />
      <q-input
        v-model="model"
        float-label="Floating Label"
        prefix="$"
        suffix=".00"
      />
      <q-input
        v-model="model"
        stacked-label="Stacked Label"
        prefix="$"
        suffix=".00"
      />

      <q-input
        v-model="model"
        prefix="$"
        suffix=".00"
        clearable
      />
      <q-input
        v-model="model"
        float-label="Clearable"
        prefix="$"
        suffix=".00"
        clearable
      />
      <q-input
        v-model="numberModel"
        type="number"
        float-label="Clearable"
        prefix="$"
        suffix=".00"
        clearable
      />
      <q-input
        type="textarea"
        v-model="model"
        float-label="Clearable"
        prefix="$"
        suffix=".00"
        clearable
      />

      <q-input
        v-model="numberModel"
        type="number"
        stacked-label="Stacked Label"
        prefix="$"
        :min="5"
        :max="15"
        suffix=".00"
      />

      <q-input
        v-model="numberModel"
        type="number"
        stacked-label="Stacked Label"
        prefix="$"
        :min="5"
        :max="15"
        suffix=".00"
        :extra-icons="false"
      />

      <!--
      <q-input
        v-model="model"
        float-label="Floating Label"
        prefix="$"
        suffix=".00"
      >
        <q-btn slot="after" class="primary clear small">Cancel</q-btn>
      </q-input>
      -->

      <q-input
        v-model="model"
        stacked-label="Stacked Label"
        prefix="$"
        suffix=".00"
        disabled
      />
      <q-input
        v-model="model"
        stacked-label="Stacked Label"
        prefix="$"
        suffix=".00"
        readonly
      />

      <q-input
        v-model="model"
        float-label="Floating Label"
        prefix="$"
        suffix=".00"
        error
      />











      <q-input
        v-model="model"
        type="textarea"
      />
      <q-input
        v-model="model"
        type="textarea"
        float-label="Floating Label"
      />
      <q-input
        v-model="model"
        type="textarea"
        stacked-label="Stacked Label"
      />

      <q-input
        v-model="model"
        type="textarea"
        prefix="$"
        suffix=".00"
      />
      <q-input
        v-model="model"
        type="textarea"
        float-label="Floating Label"
        prefix="$"
        suffix=".00"
      />
      <q-input
        v-model="model"
        type="textarea"
        stacked-label="Stacked Label"
        prefix="$"
        suffix=".00"
      />

      <q-input
        v-model="model"
        type="textarea"
        stacked-label="Stacked Label"
        prefix="$"
        suffix=".00"
        disabled
      />
      <q-input
        v-model="model"
        type="textarea"
        stacked-label="Stacked Label"
        prefix="$"
        suffix=".00"
        readonly
      />

      <q-input
        v-model="model"
        type="textarea"
        float-label="Floating Label"
        prefix="$"
        suffix=".00"
        error
      />










      <div class="inline-example">Some text <q-input class="inline" v-model="model" /></div>
      <div class="inline-example">Some text <q-input type="textarea" class="inline" v-model="model" /></div>
      <div class="inline-example">Some text <q-field class="inline">
        <q-input v-model="model" :count="10" />
      </q-field></div>


      <q-input v-model="model" type="password" />
      <q-input v-model="model" type="password" suffix="$" />
      <q-input v-model="model" type="password" prefix="$" suffix="$" error />
      <q-input v-model="model" :count="10" inline-count />
      <q-input type="textarea" v-model="model" :count="10" inline-count />

      <q-field label="With Tooltip">
        <q-input v-model="model" :count="10">
          <q-tooltip :offset="[0, 10]">
            Some tooltip
          </q-tooltip>
        </q-input>
      </q-field>
      <q-field label="With Popover">
        <q-input v-model="model" :count="10">
          <q-popover fit>
            <div style="padding: 10px" class="bg-primary text-white">
              Some Popover
            </div>
          </q-popover>
        </q-input>
      </q-field>

      <q-field>
        <q-input suffix="#" prefix="@" v-model="model" :count="10" />
      </q-field>

      <q-field>
        <q-input suffix="#" prefix="@" v-model="model" :count="10" inline-count />
      </q-field>

      <q-field>
        <q-input v-model="model" count />
      </q-field>

      <q-field>
        <q-input suffix="#" prefix="@" type="password" v-model="model" count />
      </q-field>

      <q-field>
        <q-input suffix="#" prefix="@" type="textarea" v-model="model" :count="10" />
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
        <q-input suffix="#" prefix="@" v-model="model" stacked-label="Stacked Label" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
      >
        <q-input suffix="#" prefix="@" v-model="model" stacked-label="Stacked Label" />
      </q-field>

      <q-field
        icon="cloud"
        helper="Helper"
        label="Horizontal"
        error-label="Max 10 characters!"
      >
        <q-input-group
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
        :content-width="30"
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
        <q-input v-model="model" stacked-label="Stacked $ Label" suffix="#" prefix="@" />
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
          <q-input v-model="model" stacked-label="Stacked $ Label" suffix="#" prefix="@" :inline-count="10"/>
          <q-input v-model="model" stacked-label="Stacked $ Label" suffix="#" prefix="@" :inline-count="10"/>
        </div>
      </q-field>
    </div>
    <label class="fixed-bottom-right">
      <q-checkbox v-model="error" />
      Error
    </label>
  </div>
</template>

<script>
export default {
  data () {
    return {
      option: '',
      error: true,
      model: 'Some input',
      modelX: 'sdflkjsbnfkjdabfa dfasldgfa gfg lasdfl gasdf asdfhl asdgfgasdlf hlahf lsadf asdhlf hasdhadlfasdhfadf hasdg lfasdg lfgasdfasdflasdhfgasdljfljasdh fsdkjfgasdf gjasdgfjasdljgasdjk gjlasdfa sdfgasdljf gljasdfgljasd',
      modelY: '',
      numberModel: 5555,
      nullModel: null
    }
  }
}
</script>

<style lang="styl">
.q-field
  // border 1px solid black
  // padding 15px

.q-input
  // border 1px solid black
.q-input + .q-field
  margin-top 50px

.inline-example
  margin 13px 0
</style>
