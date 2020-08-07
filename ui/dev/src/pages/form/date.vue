<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
    <div class="q-gutter-y-md">
      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" :false-value="null" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="fullWidth" label="Full Width" />
        <q-toggle :dark="dark" v-model="biggerHeight" label="More Height" />
        <q-toggle :dark="dark" v-model="minimal" label="Minimal" />
        <q-toggle :dark="dark" v-model="todayBtn" label="Today Button" />
        <q-toggle :dark="dark" v-model="yearsInMonthView" label="yearsInMonthView" />
        <q-toggle :dark="dark" v-model="persian" label="Persian calendar model" />
        <q-toggle :dark="dark" v-model="multiple" label="Multiple" />
        <q-toggle :dark="dark" v-model="range" label="Range" />
        <q-toggle v-if="range && !multiple" :dark="dark" v-model="editRange" false-value="start" true-value="end" :label="`Edit ${editRange !== null ? editRange : 'range'}`" toggle-indeterminate />
      </div>

      <div>{{ date }}</div>

      <div class="q-gutter-md">
        <q-date
          v-model="date"
          v-bind="props"
          :style="style"
          @input="inputLog"
          flat bordered
          navigation-min-year-month="2018/05"
          navigation-max-year-month="2019/03"
        >
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat />
            <q-btn label="OK" color="primary" flat />
          </div>
        </q-date>

        <q-date
          v-model="date"
          v-bind="props"
          :style="style"
          emit-immediately
          @input="inputLog"
          flat bordered
        />

        <q-date
          v-model="date"
          v-bind="props"
          :style="style"
          landscape
          @input="inputLog"
          flat bordered
        />

        <q-date
          v-model="date"
          v-bind="props"
          :style="style"
          landscape
          @input="inputLog"
          flat bordered
        >
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat />
            <q-btn label="OK" color="primary" flat />
          </div>
        </q-date>

        <q-date
          title="Title"
          subtitle="Subtitle"
          v-model="date"
          v-bind="props"
          :style="style"
          emit-immediately
          @input="inputLog"
        />
      </div>

      <div class="text-h6">
        Null/Undefined model
        <q-btn outline color="primary" size="sm" label="Reset" @click="nullDate = null" />
      </div>
      <div class="q-gutter-md">
        <q-date
          v-model="nullDate"
          v-bind="props"
          :style="style"
        />

        <q-date
          :default-year-month="defaultYearMonth"
          v-model="nullDate2"
          v-bind="props"
          :style="style"
          landscape
        />
      </div>

      <div class="text-h6">
        Colored
      </div>
      <div class="q-gutter-md">
        <q-date
          v-model="date"
          v-bind="props"
          color="orange"
          :style="style"
        />

        <q-date
          v-model="date"
          v-bind="props"
          color="yellow"
          text-color="black"
          :style="style"
        />
      </div>

      <div class="text-h6">
        Events
      </div>
      <div class="q-gutter-md">
        <q-date
          v-model="date"
          v-bind="props"
          :events="events"
          event-color="orange"
          :style="style"
        />

        <q-date
          v-model="date"
          v-bind="props"
          :events="eventFn"
          :event-color="eventColor"
          :style="style"
        />
      </div>

      <div class="text-h6">
        Limited options
      </div>
      <div class="q-gutter-md">
        <q-date
          v-model="date"
          v-bind="props"
          :options="options"
          :style="style"
        />

        <q-date
          v-model="date"
          v-bind="props"
          :options="optionsFn"
          :style="style"
        />

        <q-date
          v-model="date"
          v-bind="props"
          :options="optionsFn2"
          :style="style"
        />
      </div>

      <div class="text-h6">
        Default view
      </div>
      <div class="q-gutter-md">
        <q-date
          v-model="date"
          v-bind="props"
          :style="style"
          default-view="Years"
        />

        <q-date
          v-model="date"
          v-bind="props"
          :style="style"
          default-view="Months"
        />
      </div>

      <div class="text-h6">
        Negative years: {{ dateNeg }}
      </div>
      <div class="q-gutter-md">
        <q-date
          v-model="dateNeg"
          v-bind="props"
          :style="style"
        />

        <q-input :dark="dark" filled v-model="dateNeg">
          <q-icon slot="append" name="event" class="cursor-pointer" @click.prevent>
            <q-popup-proxy>
              <q-date
                v-model="dateNeg"
                v-bind="props"
                :style="style"
              />
            </q-popup-proxy>
          </q-icon>
        </q-input>
      </div>

      <div class="text-h6 q-mt-xl q-mb-none">
        ParseFormat: {{ dateParse }}
      </div>
      <div class="q-gutter-md">
        <q-input :dark="dark" filled v-model="mask" label="Mask" />
        <q-select :dark="dark" filled v-model="locale" label="Locale" :options="localeOptions" emit-value map-options clearable />

        <q-date
          v-model="dateParse"
          :mask="mask"
          :locale="localeComputed"
          v-bind="props"
          :style="style"
        />

        <q-input :dark="dark" filled v-model="dateParse" />
      </div>

      <div class="text-h6">
        Input: {{ input }}
      </div>
      <div class="q-gutter-md">
        <q-input :dark="dark" filled v-model="input" mask="date" :rules="['date']">
          <q-icon slot="append" name="event" class="cursor-pointer" @click.prevent>
            <q-popup-proxy>
              <q-date
                v-model="input"
                v-bind="props"
                :style="style"
              />
            </q-popup-proxy>
          </q-icon>
        </q-input>
      </div>

      <div class="text-h6">
        Input with close on selection: {{ input }}
      </div>
      <div class="q-gutter-md">
        <q-input :dark="dark" filled v-model="inputFull">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click.prevent>
              <q-popup-proxy ref="qDateProxy1">
                <q-date
                  v-model="inputFull"
                  v-bind="props"
                  mask="YYYY-MM-DD HH:mm"
                  today-btn
                  :style="style"
                  @input="() => $refs.qDateProxy1.hide()"
                />
              </q-popup-proxy>
            </q-icon>
            <q-icon name="access_time" class="cursor-pointer" @click.prevent>
              <q-popup-proxy ref="qDateProxy2">
                <q-time
                  v-model="inputFull"
                  mask="YYYY-MM-DD HH:mm"
                  @input="() => $refs.qDateProxy2.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input :dark="dark" filled v-model="inputFull">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click.prevent>
              <q-popup-proxy ref="qDateProxy1">
                <q-date
                  v-model="inputFull"
                  v-bind="props"
                  mask="YYYY-MM-DD HH:mm"
                  today-btn
                  :style="style"
                  @input="() => $refs.qDateProxy1.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:after>
            <q-icon name="access_time" class="cursor-pointer" @click.prevent>
              <q-popup-proxy ref="qDateProxy2">
                <q-time
                  v-model="inputFull"
                  mask="YYYY-MM-DD HH:mm"
                  @input="() => $refs.qDateProxy2.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input :dark="dark" filled v-model="inputFull" label="Default view - Years">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click.prevent>
              <q-popup-proxy ref="qDateProxy1">
                <q-date
                  v-model="inputFull"
                  v-bind="props"
                  mask="YYYY-MM-DD HH:mm"
                  today-btn
                  default-view="Years"
                  :style="style"
                  @input="() => $refs.qDateProxy1.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:after>
            <q-icon name="access_time" class="cursor-pointer" @click.prevent>
              <q-popup-proxy ref="qDateProxy2">
                <q-time
                  v-model="inputFull"
                  mask="YYYY-MM-DD HH:mm"
                  @input="() => $refs.qDateProxy2.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="text-h6">
        Desk Range: {{ dateRange }}
      </div>
      <div class="q-gutter-md">
        <q-input :dark="dark" dense label="From" v-model="dateFrom" @focus="() => dateRangeInputFocus = 'start'" style="max-width: 200px" />
        <q-input :dark="dark" dense label="To" v-model="dateTo" @focus="() => dateRangeInputFocus = 'end'" style="max-width: 200px" />
        <q-date
          ref="qDateRangeStart"
          v-model="dateRange"
          range
          :edit-range="dateRangeInputFocus !== null ? dateRangeInputFocus : dateRangeFocus !== null ? dateRangeFocus : 'start'"
          default-year-month="2020/06"
          default-range-view="start"
          :navigation-max-year-month="rangeNavMaxYearMonth"
          :dark="dark"
          flat
          minimal
          @mock-range-end="date => {$refs.qDateRangeEnd.setMockRangeEnd(date); dateRangeFocus = dateRangeInputFocus !== null ? dateRangeInputFocus : 'start'}"
          @input="dateRangeInputFocus = null"
        />
        <q-date
          ref="qDateRangeEnd"
          v-model="dateRange"
          range
          :edit-range="dateRangeInputFocus !== null ? dateRangeInputFocus : dateRangeFocus !== null ? dateRangeFocus : 'end'"
          default-year-month="2020/07"
          default-range-view="end"
          :navigation-min-year-month="rangeNavMinYearMonth"
          :dark="dark"
          flat
          minimal
          @mock-range-end="date => {$refs.qDateRangeStart.setMockRangeEnd(date); dateRangeFocus = dateRangeInputFocus !== null ? dateRangeInputFocus : 'end'}"
          @input="dateRangeInputFocus = null"
        />
      </div>
    </div>
  </div>
</template>

<script>
import languages from 'quasar/lang/index.json'

const localeOptions = languages.map(lang => ({
  label: lang.nativeName,
  value: require(`quasar/lang/${lang.isoName}.js`).default
}))

export default {
  data () {
    return {
      dark: null,
      disable: false,
      readonly: false,
      fullWidth: false,
      biggerHeight: false,
      minimal: false,
      todayBtn: false,
      yearsInMonthView: false,
      multiple: false,
      range: false,
      editRange: null,
      dateRangeFocus: null,
      dateRangeInputFocus: null,

      mask: '[Month: ]MMM[, Day: ]Do[, Year: ]YYYY',

      date: '2018/11/03',
      dateParse: 'Month: Aug, Day: 28th, Year: 2018',
      dateNeg: '-13/11/03',
      dateFrom: '2012/06/18',
      dateTo: '2015/04/10',
      nullDate: null,
      nullDate2: null,
      defaultYearMonth: '1986/02',

      persian: false,

      input: null,
      inputFull: null,

      locale: null,
      localeOptions
    }
  },

  computed: {
    lang () {
      return this.$q.lang.isoName
    },
    events () {
      return this.persian === true
        ? ['1397/08/14', '1397/08/15', '1397/08/18', '1397/08/28']
        : ['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23']
    },
    options () {
      return this.persian === true
        ? ['1397/08/14', '1397/08/15', '1397/08/18', '1397/08/28']
        : ['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23']
    },
    props () {
      return {
        dark: this.dark,
        disable: this.disable,
        readonly: this.readonly,
        minimal: this.minimal,
        todayBtn: this.todayBtn,
        yearsInMonthView: this.yearsInMonthView,
        multiple: this.multiple,
        range: this.range,
        editRange: this.editRange,
        calendar: this.persian ? 'persian' : 'gregorian'
      }
    },

    style () {
      let style = ''
      if (this.fullWidth) {
        style += 'width: 100%;'
      }
      if (this.biggerHeight) {
        style += 'height: 650px'
      }
      return style
    },

    localeComputed () {
      return this.locale ? this.locale.date : this.$q.lang.date
    },

    dateRange: {
      get: function () {
        return [[this.dateFrom, this.dateTo]]
      },
      set: function (newValue) {
        this.dateFrom = newValue[0][0]
        this.dateTo = newValue[0][1]
      }
    },

    rangeNavMinYearMonth () {
      const data = this.dateFrom.split('/')
      return `${data[0]}/${('' + (Number(data[1]) + 1)).padStart(2, '0')}`
    },

    rangeNavMaxYearMonth () {
      const data = this.dateTo.split('/')
      return `${data[0]}/${('' + (Number(data[1]) - 1)).padStart(2, '0')}`
    }
  },
  watch: {
    persian (val) {
      if (val === true) {
        this.date = '1397/08/12'
        this.nullDate = undefined
        this.defaultYearMonth = '1364/11'
      }
      else {
        this.date = '2018/11/03'
        this.nullDate = null
        this.defaultYearMonth = '1986/02'
      }
    }
  },
  methods: {
    eventFn (date) {
      return date[9] % 3 === 0
    },

    eventColor (date) {
      return date[9] % 2 === 0 ? 'teal' : 'orange'
    },

    optionsFn (date) {
      return date[9] % 3 === 0
    },

    optionsFn2 (date) {
      return this.persian === true
        ? date >= '1397/08/12' && date <= '1397/08/24'
        : date >= '2018/11/03' && date <= '2018/11/15'
    },

    inputLog (value, reason, date) {
      console.log('@input', value, reason, date)
    }
  }
}
</script>
