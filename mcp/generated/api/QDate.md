# QDate API

Type: component

Canonical documentation: https://quasar.dev/vue-components/date

## Props

### `name`

Type: `String`

Used to specify the name of the control; Useful if dealing with forms submitted directly to a URL

Examples:

- `'car_id'`

### `landscape`

Type: `Boolean`

Display the component in landscape mode

### `mask`

Type: `String`

Default: `'YYYY/MM/DD'`

Mask (formatting string) used for parsing and formatting value

Examples:

- `'YYYY-MM-DD'`
- `'MMMM Do, YYYY'`
- `'YYYY-MM-DD HH:mm:ss'`

### `locale`

Type: `Object`

Locale formatting options

Examples:

- `{ monthsShort: [ 'Ian', 'Feb', 'Mar', '...' ] }`

### `calendar`

Type: `String`

Default: `'gregorian'`

Specify calendar type

Accepted values: `'gregorian'`, `'persian'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `text-color`

Type: `String`

Overrides text color (if needed); Color name from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `square`

Type: `Boolean`

Removes border-radius so borders are squared

### `flat`

Type: `Boolean`

Applies a 'flat' design (no default shadow)

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `readonly`

Type: `Boolean`

Put component in readonly mode

### `disable`

Type: `Boolean`

Put component in disabled mode

### `model-value`

Type: `String | Array | Object | null | undefined`

Required: yes

Date(s) of the component; Must be Array if using 'multiple' prop; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="myDate"`
- `# v-model="[myDate1, myDate2]"`
- `# v-model="[{ from: myDateFrom, to: myDateTo }]"`
- `# v-model="[myDate1, { from: myDateFrom, to: myDateTo }, myDate2]"`

### `title`

Type: `String`

When specified, it overrides the default header title; Makes sense when not in 'minimal' mode

Examples:

- `'Birthday'`

### `subtitle`

Type: `String`

When specified, it overrides the default header subtitle; Makes sense when not in 'minimal' mode

Examples:

- `'John Doe'`

### `default-year-month`

Type: `String`

The default year and month to display (in YYYY/MM format) when model is unfilled (undefined or null); Please ensure it is within the navigation min/max year-month (if using them)

Examples:

- `'1986/02'`

### `default-view`

Type: `String`

Default: `'Calendar'`

The view which will be displayed by default

Accepted values: `'Calendar'`, `'Months'`, `'Years'`

### `years-in-month-view`

Type: `Boolean`

Show the years selector in months view

### `events`

Type: `Array | Function`

A list of events to highlight on the calendar; If using a function, it receives the date as a String and must return a Boolean (matches or not); If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `['2018/11/05', '2018/11/06', '2018/11/09', '2018/11/23']`
- `date => (date[ 9 ] % 3 === 0)`

### `event-color`

Type: `String | Function`

Color name (from the Quasar Color Palette); If using a function, it receives the date as a String and must return a String (color for the received date); If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `'teal-10'`
- `date => (date[ 9 ] % 2 === 0 ? 'teal' : 'orange')`

### `options`

Type: `Array | Function`

Optionally configure the days that are selectable; If using a function, it receives the date as a String and must return a Boolean (is date acceptable or not); If using a function then for best performance, reference it from your scope and do not define it inline; Incompatible with 'range' prop

Examples:

- `['2018/11/05', '2018/11/12', '2018/11/19', '2018/11/26']`
- `date => (date[ 9 ] % 3 === 0)`
- `date => (date >= '2018/11/03' && date <= '2018/11/15')`

### `navigation-min-year-month`

Type: `String`

Lock user from navigating below a specific year+month (in YYYY/MM format); This prop is not used to correct the model; You might want to also use 'default-year-month' prop

Examples:

- `'2020/07'`

### `navigation-max-year-month`

Type: `String`

Lock user from navigating above a specific year+month (in YYYY/MM format); This prop is not used to correct the model; You might want to also use 'default-year-month' prop

Examples:

- `'2020/10'`

### `no-unset`

Type: `Boolean`

Remove ability to unselect a date; It does not apply to selecting a range over already selected dates

### `first-day-of-week`

Type: `String | Number`

Default: `# based on configured Quasar lang language`

Sets the day of the week that is considered the first day (0 - Sunday, 1 - Monday, ...); This day will show in the left-most column of the calendar

Examples:

- `1`
- `# first-day-of-week="1"`
- `# :first-day-of-week="selectedFirstDayOfTheWeek"`

### `today-btn`

Type: `Boolean`

Display a button that selects the current day

### `minimal`

Type: `Boolean`

Don’t display the header

### `multiple`

Type: `Boolean`

Allow multiple selection; Model must be Array

### `range`

Type: `Boolean`

Allow range selection; Partial compatibility with 'options' prop: selected ranges might also include 'unselectable' days

### `emit-immediately`

Type: `Boolean`

Emit model when user browses month and year too; ONLY for single selection (non-multiple, non-range)

## Slots

### `default`

This is where additional buttons can go

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `navigation`

Emitted when user navigates to a different month or year (and even when the model changes from an outside source)

### `range-start`

User has started a range selection

### `range-end`

User has ended a range selection

## Methods

### `setToday`

Change model to today

### `setView`

Change current view

### `offsetCalendar`

Increment or decrement calendar view's month or year

### `setCalendarTo`

Change current year and month of the Calendar view; It gets corrected if using navigation-min/max-year-month and sets the current view to Calendar

### `setEditingRange`

Configure the current editing range
