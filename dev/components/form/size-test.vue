<template>
  <div>
    <div class="layout-padding" :class="{ guidelines }">
      <div class="row no-wrap gutter-sm size-test-example">
        <div class="group">
          <p class="caption">QInput</p>
          <div><q-input v-model="text" /></div>
          <div><q-input stack-label="Stack Label" v-model="text" /></div>
          <div><q-input float-label="Float Label" v-model="text" /></div>
        </div>

        <div class="group">
          <p class="caption">QSelect</p>
          <div><q-select v-model="select" :options="selectOptions" /></div>
          <div><q-select stack-label="Stack Label" v-model="select" :options="selectOptions" /></div>
          <div><q-select float-label="Float Label" v-model="select" :options="selectOptions" /></div>
        </div>

        <div class="group">
          <p class="caption">QSearch</p>
          <div><q-search v-model="text" /></div>
          <div><q-search stack-label="Stack Label" v-model="text" /></div>
          <div><q-search float-label="Float Label" v-model="text" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime type="time" v-model="date" /></div>
          <div><q-datetime type="time" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime type="time" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime type="date" v-model="date" /></div>
          <div><q-datetime type="date" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime type="date" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime type="datetime" v-model="date" /></div>
          <div><q-datetime type="datetime" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime type="datetime" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">Button</p>
          <div><q-btn color="primary" size="form-sm" outline label="Button" /></div>
          <div><q-btn color="primary" size="form-lg" outline label="Button" /></div>
          <div><q-btn color="primary" size="form-lg" outline label="Button" /></div>
        </div>

        <div class="group">
          <p class="caption">Button</p>
          <div><q-btn color="primary" size="form-sm" flat label="Button" /></div>
          <div><q-btn color="primary" size="form-lg" flat label="Button" /></div>
          <div><q-btn color="primary" size="form-lg" flat label="Button" /></div>
        </div>
      </div>

      <p class="caption">Items Baseline</p>
      <div class="row no-wrap gutter-sm size-test-example-base items-baseline">
        <div>Text</div>
        <div><q-input v-model="text" clearable /></div>
        <div><q-select v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search v-model="text" clearable /></div>
        <div><q-search stack-label="Label" v-model="text" clearable /></div>
        <div><q-search hide-underline v-model="text" clearable /></div>
        <div><q-datetime type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" size="form-sm" outline label="Button" /></div>
        <div class="self-end"><q-btn color="primary" size="form-sm" flat label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-baseline q-pt-md">
        <div>Text</div>
        <div><q-input stack-label="Label" v-model="text" clearable /></div>
        <div><q-select stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" size="form-lg" outline label="Button" /></div>
        <div class="self-end"><q-btn color="primary" size="form-lg" flat label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-baseline q-pt-md">
        <div>Text</div>
        <div><q-input float-label="Label" v-model="text" clearable /></div>
        <div><q-select float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" size="form-lg" outline label="Button" /></div>
        <div class="self-end"><q-btn color="primary" size="form-lg" flat label="Button" /></div>
      </div>

      <div class="row no-wrap gutter-sm size-test-example-base items-baseline q-pt-md">
        <div>Text</div>
        <div><q-input hide-underline v-model="text" clearable /></div>
        <div><q-select hide-underline v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline v-model="text" clearable /></div>
        <div><q-search hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" size="form-xs" outline label="Button" /></div>
        <div class="self-end"><q-btn color="primary" size="form-xs" flat label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-baseline q-pt-md">
        <div>Text</div>
        <div><q-input hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-select hide-underline stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" outline label="Button" /></div>
        <div class="self-end"><q-btn color="primary" flat label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-baseline q-pt-md">
        <div>Text</div>
        <div><q-input hide-underline float-label="Label" v-model="text" clearable /></div>
        <div><q-select hide-underline float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search hide-underline float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime hide-underline float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" outline label="Button" /></div>
        <div class="self-end"><q-btn color="primary" flat label="Button" /></div>
      </div>

      <div class="row no-wrap gutter-sm size-test-example-base items-baseline q-pt-md">
        <div>Text</div>
        <div><q-input inverted v-model="text" clearable /></div>
        <div><q-select inverted v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted v-model="text" clearable /></div>
        <div><q-search inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" size="form-md" label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-baseline q-pt-md">
        <div>Text</div>
        <div><q-input inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-select inverted stack-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted stack-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted stack-label="Label" type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" size="form-xl" label="Button" /></div>
      </div>
      <div class="row no-wrap gutter-sm size-test-example-base items-baseline q-pt-md">
        <div>Text</div>
        <div><q-input inverted float-label="Label" v-model="text" clearable /></div>
        <div><q-select inverted float-label="Label" v-model="select" :options="selectOptions" clearable /></div>
        <div><q-search inverted float-label="Label" v-model="text" clearable /></div>
        <div><q-datetime inverted float-label="Label" type="datetime" v-model="date" clearable /></div>
        <div class="self-end"><q-btn color="primary" size="form-xl" label="Button" /></div>
      </div>

      <p class="caption">Hide Underline</p>
      <div class="row no-wrap gutter-sm size-test-example">
        <div class="group">
          <p class="caption">QInput</p>
          <div><q-input hide-underline v-model="text" /></div>
          <div><q-input hide-underline stack-label="Stack Label" v-model="text" /></div>
          <div><q-input hide-underline float-label="Float Label" v-model="text" /></div>
        </div>

        <div class="group">
          <p class="caption">QSelect</p>
          <div><q-select hide-underline v-model="select" :options="selectOptions" /></div>
          <div><q-select hide-underline stack-label="Stack Label" v-model="select" :options="selectOptions" /></div>
          <div><q-select hide-underline float-label="Float Label" v-model="select" :options="selectOptions" /></div>
        </div>

        <div class="group">
          <p class="caption">QSearch</p>
          <div><q-search hide-underline v-model="text" /></div>
          <div><q-search hide-underline stack-label="Stack Label" v-model="text" /></div>
          <div><q-search hide-underline float-label="Float Label" v-model="text" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime hide-underline type="time" v-model="date" /></div>
          <div><q-datetime hide-underline type="time" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime hide-underline type="time" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime hide-underline type="date" v-model="date" /></div>
          <div><q-datetime hide-underline type="date" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime hide-underline type="date" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime hide-underline type="datetime" v-model="date" /></div>
          <div><q-datetime hide-underline type="datetime" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime hide-underline type="datetime" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">Button</p>
          <div><q-btn color="primary" size="form-xs" outline label="Button" /></div>
          <div><q-btn color="primary" outline label="Button" /></div>
          <div><q-btn color="primary" outline label="Button" /></div>
        </div>

        <div class="group">
          <p class="caption">Button</p>
          <div><q-btn color="primary" size="form-xs" flat label="Button" /></div>
          <div><q-btn color="primary" flat label="Button" /></div>
          <div><q-btn color="primary" flat label="Button" /></div>
        </div>
      </div>

      <p class="caption">Inverted</p>
      <div class="row no-wrap gutter-sm size-test-example">
        <div class="group">
          <p class="caption">QInput</p>
          <div><q-input inverted v-model="text" /></div>
          <div><q-input inverted stack-label="Stack Label" v-model="text" /></div>
          <div><q-input inverted float-label="Float Label" v-model="text" /></div>
        </div>

        <div class="group">
          <p class="caption">QSelect</p>
          <div><q-select inverted v-model="select" :options="selectOptions" /></div>
          <div><q-select inverted stack-label="Stack Label" v-model="select" :options="selectOptions" /></div>
          <div><q-select inverted float-label="Float Label" v-model="select" :options="selectOptions" /></div>
        </div>

        <div class="group">
          <p class="caption">QSearch</p>
          <div><q-search inverted v-model="text" /></div>
          <div><q-search inverted stack-label="Stack Label" v-model="text" /></div>
          <div><q-search inverted float-label="Float Label" v-model="text" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime inverted type="time" v-model="date" /></div>
          <div><q-datetime inverted type="time" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime inverted type="time" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime inverted type="date" v-model="date" /></div>
          <div><q-datetime inverted type="date" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime inverted type="date" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">QDatetime</p>
          <div><q-datetime inverted type="datetime" v-model="date" /></div>
          <div><q-datetime inverted type="datetime" stack-label="Stack Label" v-model="date" /></div>
          <div><q-datetime inverted type="datetime" float-label="Float Label" v-model="date" /></div>
        </div>

        <div class="group">
          <p class="caption">Button</p>
          <div><q-btn color="primary" size="form-md" label="Button" /></div>
          <div><q-btn color="primary" size="form-xl" label="Button" /></div>
          <div><q-btn color="primary" size="form-xl" label="Button" /></div>
        </div>
      </div>

      <q-toggle v-model="guidelines" label="Guidelines" class="fixed-top-left bg-grey-3 q-pa-sm" style="top: 8px; left: 8px;" />
    </div>
  </div>
</template>

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
      ],
      guidelines: false
    }
  }
}
</script>

<style lang="stylus">
.size-test-example > .group > div
  margin 1.5em 0
.guidelines .size-test-example > div > div
  &:before, &:after
    content ''
    display block
    position absolute
    left 0
    right 0
    height 6px
    background-color transparent
  &:before
    margin-top -6px
    border-top 1px solid rgba(255, 0, 0, .2)
  &:after
    border-bottom 1px solid rgba(0, 255, 0, .2)
.guidelines .size-test-example > div:last-child > div
  &:before, &:after
    border-color rgba(0, 0, 255, .4)
</style>
