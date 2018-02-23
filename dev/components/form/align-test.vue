<template>
  <div>
    <div class="layout-padding">
      <div class="row no-wrap gutter-sm size-test-example-base items-end" style="width: 100%">
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
      <div class="row no-wrap gutter-sm size-test-example-base items-end">
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
      <div class="row no-wrap gutter-sm size-test-example-base items-end q-pt-md">
        <div>Text</div>
        <div><q-input stack-label="Label" v-model="text" clearable /></div>
        <div><q-select stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-label" flat label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-end q-pt-md">
        <div>Text</div>
        <div><q-input float-label="Label" v-model="text" clearable /></div>
        <div><q-select float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-label" flat label="Button" /></div>
      </div>

      <div class="row no-wrap gutter-sm size-test-example-base items-end q-pt-md">
        <div>Text</div>
        <div><q-input hide-underline v-model="text" clearable /></div>
        <div><q-select hide-underline v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline v-model="text" clearable /></div>
        <div><q-search hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-hide-underline" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-hide-underline" flat label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-end q-pt-md">
        <div>Text</div>
        <div><q-input hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-select hide-underline stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label-hide-underline" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-label-hide-underline" flat label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-end q-pt-md">
        <div>Text</div>
        <div><q-input hide-underline float-label="Label" v-model="text" clearable /></div>
        <div><q-select hide-underline float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label-hide-underline" outline label="Button" /></div>
        <div><q-btn color="primary" size="form-label-hide-underline" flat label="Button" /></div>
      </div>

      <div class="row no-wrap gutter-sm size-test-example-base items-end q-pt-md">
        <div>Text</div>
        <div><q-input inverted v-model="text" clearable /></div>
        <div><q-select inverted v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted v-model="text" clearable /></div>
        <div><q-search inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-inverted" label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-end q-pt-md">
        <div>Text</div>
        <div><q-input inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-select inverted stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label-inverted" label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-end q-pt-md">
        <div>Text</div>
        <div><q-input inverted float-label="Label" v-model="text" clearable /></div>
        <div><q-select inverted float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div><q-btn color="primary" size="form-label-inverted" label="Button" /></div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
  .size-test-example-base > div:not(:first-child)
    flex 1 1 100%
</style>

<script>
export default {
  data () {
    return {
      text: 'AQGqftj',
      date: '2016-09-18T10:45:00.000Z',
      select: '',
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
      ]
    }
  }
}
</script>
