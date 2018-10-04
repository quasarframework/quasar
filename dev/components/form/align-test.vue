<template>
  <div>
    <div class="q-layout-padding">
      <div class="row no-wrap q-gutter-sm size-test-example-base" :class="alignClass" style="width: 100%">
        <div class="col-auto">Text</div>
        <div class="col"><q-input v-model="text" clearable /></div>
        <div class="col"><q-select v-model="select" :options="selectOptions" clearable /></div>
        <div class="col"><q-search v-model="text" clearable /></div>
        <div class="col"><q-search stack-label="Label" v-model="text" clearable /></div>
        <div class="col"><q-search hide-underline v-model="text" clearable /></div>
        <div class="col"><q-datetime type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form" outline label="Button" /></div>
        <div><q-btn color="primary" size="form" flat label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base" :class="alignClass">
        <div>Text</div>
        <div><q-input v-model="text" clearable /></div>
        <div><q-select v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search v-model="text" clearable /></div>
        <div><q-search stack-label="Label" v-model="text" clearable /></div>
        <div><q-search hide-underline v-model="text" clearable /></div>
        <div><q-datetime type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form" outline label="Button" /></div>
        <div><q-btn color="primary" size="form" flat label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input stack-label="Label" v-model="text" clearable /></div>
        <div><q-select stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-label" flat label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input float-label="Label" v-model="text" clearable /></div>
        <div><q-select float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-label" flat label="Button" /></div>
      </div>

      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input hide-underline v-model="text" clearable /></div>
        <div><q-select hide-underline v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline v-model="text" clearable /></div>
        <div><q-search hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form" outline label="Button" /></div>
        <div><q-btn color="primary" size="form" flat label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-select hide-underline stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-label" flat label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input hide-underline float-label="Label" v-model="text" clearable /></div>
        <div><q-select hide-underline float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-label" flat label="Button" /></div>
      </div>

      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input inverted v-model="text" clearable /></div>
        <div><q-select inverted v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted v-model="text" clearable /></div>
        <div><q-search inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form" label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-select inverted stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label" label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input inverted float-label="Label" v-model="text" clearable /></div>
        <div><q-select inverted float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label" label="Button" /></div>
      </div>

      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input box v-model="text" clearable /></div>
        <div><q-select box v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search box v-model="text" clearable /></div>
        <div><q-search box stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime box type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" outline size="form" label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input box stack-label="Label" v-model="text" clearable /></div>
        <div><q-select box stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search box stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime box stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" outline size="form-label" label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input box float-label="Label" v-model="text" clearable /></div>
        <div><q-select box float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search box float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime box float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" outline size="form-label" label="Button" /></div>
      </div>

      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input outline v-model="text" clearable /></div>
        <div><q-select outline v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search outline v-model="text" clearable /></div>
        <div><q-search outline stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime outline type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" outline size="form-label" label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input outline stack-label="Label" v-model="text" clearable /></div>
        <div><q-select outline stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search outline stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime outline stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" outline size="form-label" label="Button" /></div>
      </div>
      <div class="row no-wrap q-gutter-sm size-test-example-base q-pt-md" :class="alignClass">
        <div>Text</div>
        <div><q-input outline float-label="Label" v-model="text" clearable /></div>
        <div><q-select outline float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search outline float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime outline float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" outline size="form-label" label="Button" /></div>
      </div>

      <div class="fixed-top-left bg-grey-3 q-pa-sm" style="top: 8px; left: 8px; z-index: 10;">
        <div class="row no-wrap q-gutter-sm">
          <div>
            <q-select v-model="align" placeholder="Align" :options="alignOptions" clearable class="q-my-none q-py-none" hide-underline />
          </div>
        </div>
      </div>
      <div style="height: 350px"/>
    </div>
  </div>
</template>

<style lang="stylus">
  .size-test-example-base > div:not(:first-child)
    flex 1 1 100%
  .size-test-example-base > div
    background-color inherit
</style>

<script>
export default {
  data () {
    return {
      align: null,
      text: 'AQGqftj',
      date: '2016-09-18T10:45:00.000Z',
      select: null,
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        },
        {
          label: 'Twitter',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          value: 'appl'
        },
        {
          label: 'Oracle',
          value: 'ora'
        }
      ],
      alignOptions: [
        { label: 'Center', value: 'items-center' },
        { label: 'Baseline', value: 'items-baseline' }
      ]
    }
  },
  computed: {
    alignClass () {
      return ['bg-white', this.align || 'items-end']
    }
  }
}
</script>
