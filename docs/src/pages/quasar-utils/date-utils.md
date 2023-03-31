---
title: Date Utils
desc: A set of Quasar methods for manipulating JS Date objects without the high additional cost of dedicated libraries.
keys: formatDate,buildDate,isValid,addToDate,subtractFromDate,adjustDate,getMinDate,getMaxDate,isBetweenDates,getBetweenDates,isSameDate,getDateDiff,getWeekOfYear,getDayOfYear,getDayOfWeek,daysInMonth,startOfDate,endOfDate,inferDateFormat,clone,extractDate
---

Quasar provides a set of useful functions to manipulate JS Date easily in most use cases, without the high additional cost of integrating dedicated libraries like Momentjs.

Most Quasar date functions take as parameter either a Unix timestamp or a String representing a date which needs to be parsable by the native JS [Date constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). Some examples: `1497159857411`, `Sun Jun 11 2017 08:44:42 GMT+0300`, `2017-06-16`.

Returned values are all JS Dates.

Get familiar with JS native Date class, which is very powerful, and remember that you don't need solutions like Momentjs which add hundreds of minified KB to your bundle.

::: tip
Quasar date utils includes tree shaking, except for the UMD version.
:::

You will notice all examples import `date` Object from Quasar. However, if you need only one method from it, then you can use ES6 destructuring to help Tree Shaking embed only that method and not all of `date`.

Example with `addToDate()`:

```js
// we import all of `date`
import { date } from 'quasar'
// destructuring to keep only what is needed
const { addToDate } = date

const newDate = addToDate(new Date(), { days: 7, months: 1 })
```

::: tip
For usage with the UMD build see [here](/start/umd#quasar-global-object).
:::

## Format for display

It takes a string of tokens and replaces them with their corresponding date values:

```js
import { date } from 'quasar'

const timeStamp = Date.now()
const formattedString = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
```

For i18n, you can use a third parameter:

```js
const formattedString = date.formatDate(timeStamp, 'MMMM - dddd', {
  days: ['Duminica', 'Luni', /* and all the rest of days - remember starting with Sunday */],
  daysShort: ['Dum', 'Lun', /* and all the rest of days - remember starting with Sunday */],
  months: ['Ianuarie', 'Februarie', /* and all the rest of months */],
  monthsShort: ['Ian', 'Feb', /* and all the rest of months */]
})
```

Available format tokens:

| Unit | Formats available |
| --- | --- |
| Year | <ul><li>**YY**: 70 71 ... 29 30</li><li>**YYYY**: 1970 1971 ... 2029 2030</li></ul> |
| Month | <ul><li>**M**: 1 2 ... 11 12</li><li>**MM**: 01 02 ... 11 12</li><li>**MMM**: Jan Feb ... Nov Dec</li><li>**MMMM**: January February ... November December</li></ul> |
| Quarter | <ul><li>**Q**: Quarter number 1 2 3 4</li><li>**Qo**: Quarter number 1st 2nd 3rd 4th</li></ul> |
| Day of Month | <ul><li>**D**: 1 2 ... 30 31</li><li>**Do**: 1st 2nd ... 30th 31st</li><li>**DD**: 01 02 ... 30 31</li></ul> |
| Day of Year | <ul><li>**DDD**: 1 2 ... 364 365</li><li>**DDDD**: 001 002 ... 364 365</li></ul> |
| Day of Week | <ul><li>**d**: 0 1 ... 5 6</li><li>**dd**: Su Mo ... Fr Sa</li><li>**ddd**: Sun Mon ... Fri Sat</li><li>**dddd**: Sunday Monday ... Friday Saturday</li></ul> |
| Day of Week (ISO) | <ul><li>**E**: 1 2 ... 6 7</li></ul> |
| Week of Year | <ul><li>**w**: 1 2 ... 52 53</li><li>**ww**: 01 02 ... 52 53</li></ul> |
| Hour | <ul><li>**H**: 0 1 ... 22 23</li><li>**HH**: 00 01 ... 22 23</li><li>**h**: 0 ... 11 12</li><li>**hh**: 01 02 ... 11 12</li></ul> |
| Minute | <ul><li>**m**: 0 1 ... 58 59</li><li>**mm**: 00 01 ... 58 59</li></ul> |
| Second | <ul><li>**s**: 0 1 ... 58 59</li><li>**ss**: 00 01 ... 58 59</li></ul> |
| Fractional Second | <ul><li>**S**: 0 1 ... 8 9</li><li>**SS**: 00 01 ... 98 99</li><li>**SSS**: 000 001 ... 998 999</li></ul> |
| Timezone offset | <ul><li>**Z**: -07:00 -06:00 ... +06:00 +07:00</li><li>**ZZ**: -0700 -0600 ... +0600 +0700</li></ul> |
| AM/PM | <ul><li>**A**: AM, PM</li><li>**a**: am, pm</li><li>**aa**: a.m, p.m</li></ul> |
| Unix Timestamp | <ul><li>**X**: 1360013296</li><li>**x** (ms): 1360013296123</li></ul> |

If you want to insert strings (including `[` and `]` characters) into your mask, make sure you escape them by surrounding them with `[` and `]`, otherwise the characters might be interpreted as format tokens.

## Manipulate dates

### Create
**Try to create dates with native JS Date class** like so:

```js
const date = new Date();
```

The following method is just a wrapper to help you in cases where you just need current time but with a different year, or month, or second etc.

```js
import { date } from 'quasar'

const newDate = date.buildDate({ year: 2010, date: 5, hours: 15, milliseconds: 123 })
```

You can pass a second argument (a boolean) for setting UTC time (true) instead of local time.

The object literal provided can contain the following keys (all are optional):

| Key | Description |
| --- | --- |
| `millisecond(s)` | for the milliseconds component of the date/time |
| `second(s)` | for the seconds component of the date/time |
| `minute(s)` | for the minutes component of the date/time |
| `hour(s)` | for the hours component of the date/time |
| `day(s)` / `date` | for the day component of the date/time |
| `month(s)` | for the month component of the date/time |
| `year(s)` | for the year component of the date/time |

### Validate
To check if a date string is valid use:

```js
import { date } from 'quasar'

const dateString = 'Wed, 09 Aug 1995 00:00:00 GMT'

if (date.isValid(dateString)) {
  // Do something with date string
}
```

::: warning
`isValid` only validates the date format, not the logic validity of the date.

The underlying implementation is based on native `Date.parse(...)` API and its shortcomings will pass through our API.

It will not check if the date is valid for the month (e.g. 31st of February), or if the date is valid for the year (e.g. 29th of February in a non-leap year), and will return a different value in those cases for Firefox with respect to Chromium-based browsers (Chrome, Edge, etc).
:::

### Add/Subtract
To add/subtract some duration to/from a date use:

```js
import { date } from 'quasar'

let newDate = new Date(2017, 2, 7)

newDate = date.addToDate(newDate, { days: 7, months: 1 })
// `newDate` is now 2017-3-14 00:00:00

newDate = date.subtractFromDate(newDate, { hours: 24, milliseconds: 10000 })
// `newDate` is now 2017-3-12 23:59:50
```

The object literal provided can contain the following keys (all are optional):

| Key | Description |
| --- | --- |
| `millisecond(s)` | for a duration in milliseconds |
| `second(s)` | for a duration in seconds |
| `minute(s)` | for a duration in minutes |
| `hour(s)` | for a duration in hours |
| `day(s)` / `date` | for a duration in days |
| `month(s)` | for a duration in months |
| `year(s)` | for a duration in years |

### Set date/time
To set a specified unit(s) of date/time:

```js
import { date } from 'quasar'

const newDate = new Date(2017, 10, 2)
const adjustedDate = date.adjustDate(newDate, { year: 2010, month: 2 })
// `adjustedDate` is 2010-2-2
```

You can pass a third argument (a Boolean) for setting UTC time (`true`) instead of local time.

The object literal provided can contain the following keys (all are optional):

| Key | Description |
| --- | --- |
| `millisecond(s)` | for the milliseconds component of the date/time |
| `second(s)` | for the seconds component of the date/time |
| `minute(s)` | for the minutes component of the date/time |
| `hour(s)` | for the hours component of the date/time |
| `day(s)` / `date` | for the day component of the date/time |
| `month(s)` | for the month component of the date/time |
| `year(s)` | for the year component of the date/time |

## Query dates

### Minimum/Maximum
To get the minimum/maximum date of a date set (i.e. array) use:

```js
import { date } from 'quasar'

let min = date.getMinDate(new Date(2017, 6, 24), new Date(2017, 5, 20), new Date(2017, 6, 26))
// `min` is 2017-5-20
let max = date.getMaxDate(new Date(2017, 6, 24), new Date(2017, 5, 20), new Date(2017, 6, 26))
// `max` is 2017-6-26

// Or use an array:
const dates = [ new Date(2017, 6, 24), new Date(2017, 5, 20), new Date(2017, 6, 26) ]
let min = date.getMinDate(...dates) // `min` is 2017-5-20
let max = date.getMaxDate(...dates) // `max` is 2017-6-26
```

Note that the returning value is a timestamp.

```js
console.log(max) // 1497906000000
console.log(new Date(max)) // Wed Jul 26 2017 00:00:00 GMT+0300 (Eastern European Summer Time)
```

### Time range
To check if a date is in a given date/time range use:

```js
import { date } from 'quasar'

const dateTarget = new Date()
const dateFrom = new Date()
const dateTo = new Date()

// **strictly** (i.e. exclusive range)
if (date.isBetweenDates(dateTarget, dateFrom, dateTo)) {
  // Do something with dateTarget
}

// including which margin you want
if (date.isBetweenDates(dateTarget, dateFrom, dateTo, { inclusiveFrom: true, inclusiveTo: true })) {
  // Do something with dateTarget
}

// if you only care about comparing dates (year/month/day, regardless of time)
// then you could tip isBetweenDates() about it so it can perform best:
if (date.isBetweenDates(dateTarget, dateFrom, dateTo, { onlyDate: true })) {
  // Do something with dateTarget
}
```

To normalize a date in a given date/time range use:

```js
import { date } from 'quasar'

const newDate = new Date()
const dateMin = new Date(2010, 2, 23)
const dateMax = new Date(2012, 4, 12)
const dateNormalized = date.getDateBetween(newDate, dateMin, dateMax)
// Returns `newDate` if it's between 2010-2-23 and 2012-4-12; `dateMin` if it's lower; `dateMax` if it's greater
```

### Equality
To check if two dates' unit are **equal** use:

```js
import { date } from 'quasar'

const date1 = new Date(2017, 2, 5)
const date2 = new Date(2017, 3, 8)
const unit = 'year'

if (date.isSameDate(date1, date2, /* optional */ unit)) {
  // true because date1 and date2's year is the same
}
```

Unit parameter can be omitted, in which case a full date/time comparison will occur, otherwise it allows to perform partial comparison:

| Unit | Description |
| --- | --- |
| `second(s)` | test if same second only |
| `minute(s)` | test if same minute only |
| `hour(s)` | test if same hour only |
| `day(s)` / `date` | test if same day only |
| `month(s)` | test if same month only |
| `year(s)` | test if same year only |

### Difference
To compute the difference between two dates use:

```js
import { date } from 'quasar'

const date1 = new Date(2017, 4, 12)
const date2 = new Date(2017, 3, 8)
const unit = 'days'

const diff = date.getDateDiff(date1, date2, unit)
// `diff` is 34 (days)
```

The unit parameter indicates the unit of measurement, if not specified then it is `days` by default:

| Unit | Description |
| --- | --- |
| `second(s)` | distance in seconds (disregarding milliseconds) |
| `minute(s)` | distance in minutes (disregarding seconds, ...) |
| `hour(s)` | distance in hours (disregarding minutes, seconds, ...) |
| `day(s)` / `date` | distance in calendar days |
| `month(s)` | distance in calendar months |
| `year(s)` | distance in calendar years |

### Calendar
To get the [ISO week number in year](https://en.wikipedia.org/wiki/ISO_week_date) for a given date object use:

```js
import { date } from 'quasar'

const newDate = new Date(2017, 0, 4)
const week = date.getWeekOfYear(newDate) // `week` is 1
```

To get the day number in year for a given date object use:

```js
import { date } from 'quasar'

const newDate = new Date(2017, 1, 4)
const day = date.getDayOfYear(newDate) // `day` is 35
```

To get the day number in week for a given date object use:

```js
import { date } from 'quasar'

const newDate = new Date(2017, 1, 9)
const day = date.getDayOfWeek(newDate) // `day` is 4
```

To get the number of days in the month for the specified date:

```js
import { date } from 'quasar'

const newDate = new Date()
const days = date.daysInMonth(newDate) // e.g. 30
```

### Start/End of time
To mutate the original date object by setting it to the start of a unit of time use:

```js
import { date } from 'quasar'

let newDate = new Date('2000')
// set to beginning of year 2000 (January 1st, 2000, 00:00:00.000)
newDate = date.startOfDate(newDate, 'year')
// set to end of year 2000 (December 31st, 2000, 23:59:59.999)
newDate = date.endOfDate(newDate, 'year')
```

The second parameter indicates a unit to reset to (beginning of it or end of it):

| Unit | Description |
| --- | --- |
| `second(s)` | reset seconds |
| `minute(s)` | reset minutes |
| `hour(s)` | reset hours |
| `day(s)` / `date` | reset days |
| `month(s)` | reset months |
| `year(s)` | reset years |

## Other

### Get Format

```js
import { date } from 'quasar'

date.inferDateFormat(new Date()) // 'date'
date.inferDateFormat(35346363) // 'number'
date.inferDateFormat('Mon Feb 05 2018 23:05:29') // string
```

### Cloning Date

```js
import { date } from 'quasar'

const newDate = new Date()
const clonedDate = date.clone(newDate)

date.addToDate(newDate, { days: 1 })

console.log(newDate.getDate() === clonedDate.getDate()) // false
```

### Extract Date

Using locale set by current Quasar language pack, this allows you to parse any string into a date object based on the format passed:

```js
import { date } from 'quasar'

// Example 1
const date = date.extractDate('2019-10-29 --- 23:12', 'YYYY-MM-DD --- HH:mm')
// date is a new Date() object

// Example 2
const date = date.extractDate('21/03/1985', 'DD/MM/YYYY')
// date is a new Date() object
```

With optional custom locale:

```js
import { date } from 'quasar'

const obj = date.extractDate('Month: Feb, Day: 11th, Year: 2018', '[Month: ]MMM[, Day: ]Do[, Year: ]YYYY', {
  days: ['Duminica', 'Luni', /* and all the rest of days - remember starting with Sunday */],
  daysShort: ['Dum', 'Lun', /* and all the rest of days - remember starting with Sunday */],
  months: ['Ianuarie', 'Februarie', /* and all the rest of months */],
  monthsShort: ['Ian', 'Feb', /* and all the rest of months */]
})
// obj is a new Date() object
```
