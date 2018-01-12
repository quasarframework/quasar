<template>
  <div>
    <div class="layout-padding">
      <div class="row no-wrap size-test-example">
        <div>
          <p class="caption">QInput</p>
          <q-input v-model="text" />
          <q-input stack-label="Stack Label" v-model="text" />
          <q-input float-label="Float Label" v-model="text" />
        </div>

        <div>
          <p class="caption">QSelect</p>
          <q-select v-model="select" :options="selectOptions" />
          <q-select stack-label="Stack Label" v-model="select" :options="selectOptions" />
          <q-select float-label="Float Label" v-model="select" :options="selectOptions" />
        </div>

        <div>
          <p class="caption">QDialogSelect</p>
          <q-dialog-select v-model="select" :options="selectOptions" />
          <q-dialog-select stack-label="Stack Label" v-model="select" :options="selectOptions" />
          <q-dialog-select float-label="Float Label" v-model="select" :options="selectOptions" />
        </div>

        <div>
          <p class="caption">QSearch</p>
          <q-search v-model="text" />
          <q-search stack-label="Stack Label" v-model="text" />
          <q-search float-label="Float Label" v-model="text" />
        </div>

        <div>
          <p class="caption">QDatetime</p>
          <q-datetime type="time" v-model="date" />
          <q-datetime type="time" stack-label="Stack Label" v-model="date" />
          <q-datetime type="time" float-label="Float Label" v-model="date" />
        </div>

        <div>
          <p class="caption">QDatetime</p>
          <q-datetime type="date" v-model="date" />
          <q-datetime type="date" stack-label="Stack Label" v-model="date" />
          <q-datetime type="date" float-label="Float Label" v-model="date" />
        </div>

        <div>
          <p class="caption">QDatetime</p>
          <q-datetime type="datetime" v-model="date" />
          <q-datetime type="datetime" stack-label="Stack Label" v-model="date" />
          <q-datetime type="datetime" float-label="Float Label" v-model="date" />
        </div>
      </div>

      <p class="caption">Inverted</p>
      <div class="row no-wrap size-test-example">
        <div>
          <p class="caption">QInput</p>
          <q-input inverted v-model="text" />
          <q-input inverted stack-label="Stack Label" v-model="text" />
          <q-input inverted float-label="Float Label" v-model="text" />
        </div>

        <div>
          <p class="caption">QSelect</p>
          <q-select inverted v-model="select" :options="selectOptions" />
          <q-select inverted stack-label="Stack Label" v-model="select" :options="selectOptions" />
          <q-select inverted float-label="Float Label" v-model="select" :options="selectOptions" />
        </div>

        <div>
          <p class="caption">QDialogSelect</p>
          <q-dialog-select inverted v-model="select" :options="selectOptions" />
          <q-dialog-select inverted stack-label="Stack Label" v-model="select" :options="selectOptions" />
          <q-dialog-select inverted float-label="Float Label" v-model="select" :options="selectOptions" />
        </div>

        <div>
          <p class="caption">QSearch</p>
          <q-search inverted v-model="text" />
          <q-search inverted stack-label="Stack Label" v-model="text" />
          <q-search inverted float-label="Float Label" v-model="text" />
        </div>

        <div>
          <p class="caption">QDatetime</p>
          <q-datetime inverted type="time" v-model="date" />
          <q-datetime inverted type="time" stack-label="Stack Label" v-model="date" />
          <q-datetime inverted type="time" float-label="Float Label" v-model="date" />
        </div>

        <div>
          <p class="caption">QDatetime</p>
          <q-datetime inverted type="date" v-model="date" />
          <q-datetime inverted type="date" stack-label="Stack Label" v-model="date" />
          <q-datetime inverted type="date" float-label="Float Label" v-model="date" />
        </div>

        <div>
          <p class="caption">QDatetime</p>
          <q-datetime inverted type="datetime" v-model="date" />
          <q-datetime inverted type="datetime" stack-label="Stack Label" v-model="date" />
          <q-datetime inverted type="datetime" float-label="Float Label" v-model="date" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Some text',
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

<style lang="stylus">
.size-test-example > div
  .q-if
    // border 1px solid black
  margin-right 8px
</style>
