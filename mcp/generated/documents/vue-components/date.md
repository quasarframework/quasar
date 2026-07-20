---
title: QDate
description: The QDate Vue component provides a method to input dates from Gregorian or Persian calendars.
canonical: https://quasar.dev/vue-components/date
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QDate](../../api/QDate.md)

The QDate component provides a method to input date. Currently it supports Gregorian (default) and Persian calendars.

::: tip
For handling date and/or time, also check out [Quasar Date Utils](/quasar-utils/date-utils).
:::

**API reference:** [QDate](../../api/QDate.md)

## Usage

::: warning
Notice that the actual date(s) of the model are all in String format.
:::

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QDate/Basic.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date v-model="date" />

      <q-date v-model="date" minimal />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

::: tip
For landscape mode, you can use it along with `$q.screen` to make QDate responsive. Example: `:landscape="$q.screen.gt.xs"`. More info: [Quasar Screen Plugin](/options/screen-plugin).
:::

**Example: Landscape**

Source: [Landscape.vue](../../examples/QDate/Landscape.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-date v-model="date" landscape />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

### Multiple selection

Notice below that the model is an Array and we specify the "multiple" prop.

Clicking on an already selected day will deselect it.

**Example: Multiple days**

Source: [SelectionMultiple.vue](../../examples/QDate/SelectionMultiple.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-pb-sm"> Model: {{ days }} </div>

    <q-date v-model="days" multiple />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const days = ref(['2019/02/01', '2019/02/10'])
</script>
```

### Range selection

Notice in the examples below that the model is an Object (single selection) or an Array of Objects (multiple selection).

::: tip TIPS

- Clicking on an already selected day will deselect it.
- The user's current editing range can also be set programmatic through the `setEditingRange` method (check the API card).
- There are two useful events in regards to the current editing range: `range-start` and `range-end` (check the API card).

:::

::: warning
The `range` property is only partially compatible with the `options` prop: selected ranges might also include "unselectable" days.
:::

**Example: Single Range**

Source: [SelectionRange.vue](../../examples/QDate/SelectionRange.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-pb-sm"> Model: {{ model }} </div>

    <q-date v-model="model" range />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref({ from: '2020/07/08', to: '2020/07/17' })
</script>
```

**Example: Multiple ranges**

Source: [SelectionRangeMultiple.vue](../../examples/QDate/SelectionRangeMultiple.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-pb-sm"> Model: {{ days }} </div>

    <q-date v-model="days" range multiple />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const days = ref([
  { from: '2020/07/01', to: '2020/07/10' },
  { from: '2020/07/21', to: '2020/07/25' }
])
</script>
```

### Custom title and subtitle

When not in 'minimal' mode, QDate has a computed header title and subtitle. You can override it, like in the example below.

When clicking on title then the QDate's view is changed to the calendar and when clicking on subtitle, the view will switch to year picking.

**Example: Custom title and subtitle**

Source: [CustomTitleSubtitle.vue](../../examples/QDate/CustomTitleSubtitle.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date v-model="date" title="John Doe" subtitle="Birthday" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

### Functionality

When model is unfilled (like `null`, `void 0` / `undefined`) QDate still has to show the calendar for a month of a year. You can use `default-year-month` prop for this, otherwise the current month of the year will be shown:

When server-side rendering an unfilled QDate in SSR or SSG modes, set `default-year-month` explicitly. Otherwise, a server and browser in different time zones can select different initial months during hydration.

**Example: Default year month**

Source: [DefaultYearMonth.vue](../../examples/QDate/DefaultYearMonth.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-date v-model="date" default-year-month="1964/08" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref(null)
</script>
```

The default view can be changed.

**Example: Default view**

Source: [DefaultView.vue](../../examples/QDate/DefaultView.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-date v-model="date" default-view="Years" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref(null)
</script>
```

The first day of the week is applied depending on the [Quasar Language Pack](/options/quasar-language-packs) that you've set, but you can also force it, like in the example below.

**Example: First day of week**

Source: [FirstDayOfWeek.vue](../../examples/QDate/FirstDayOfWeek.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-date v-model="date" first-day-of-week="1" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

Clicking on the "Today" button sets date to current user date. Requires the header, so you can't use it along with "minimal" mode:

**Example: Today button**

Source: [TodayBtn.vue](../../examples/QDate/TodayBtn.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-date v-model="date" today-btn />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

**Example: Disable and readonly**

Source: [DisableReadonly.vue](../../examples/QDate/DisableReadonly.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date v-model="date" disable />

      <q-date v-model="date" readonly />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

### Model mask

The default model mask is `YYYY/MM/DD`, however you can use custom ones too.

The `mask` prop tokens can be found at [Quasar Utils > Date utils](/quasar-utils/date-utils#format-for-display).

::: warning Note on SSR/SSG
Using `x` or `X` (timestamps) in the mask may cause hydration errors on the client, because decoding the model String must be done with `new Date()` which takes into account the local timezone. As a result, if the server is in a different timezone than the client, then the rendered output of the server will differ than the one on the client so hydration will fail.
:::

::: danger Note on persian calendar
When using the persian calendar, the mask for QDate is forced to `YYYY/MM/DD`.
:::

**Example: Simple mask**

Source: [MaskSimple.vue](../../examples/QDate/MaskSimple.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div>
        <div class="q-pb-sm q-gutter-sm">
          <q-badge color="teal"> Model: {{ model1 }} </q-badge>
          <q-badge color="purple" text-color="white">
            Mask: YYYY-MM-DD
          </q-badge>
        </div>

        <q-date v-model="model1" mask="YYYY-MM-DD" />
      </div>

      <div>
        <div class="q-pb-sm q-gutter-sm">
          <q-badge color="teal"> Model: {{ model2 }} </q-badge>
          <q-badge color="purple" text-color="white">
            Mask: MM-DD-YYYY
          </q-badge>
        </div>

        <q-date v-model="model2" mask="MM-DD-YYYY" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model1 = ref('2019-02-15')
const model2 = ref('03-21-2019')
</script>
```

If you want to insert strings (including `[` and `]` characters) into your mask, make sure you escape them by surrounding them with `[` and `]`, otherwise the characters might be interpreted as format tokens.

**Example: Mask with escaped characters**

Source: [MaskEscape.vue](../../examples/QDate/MaskEscape.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div>
        <div class="q-pb-sm">
          <q-badge color="teal"> Model: {{ model1 }} </q-badge>
        </div>
        <div class="q-pb-sm">
          <q-badge color="purple" text-color="white">
            Mask: dddd, MMM D, YYYY
          </q-badge>
        </div>

        <q-date v-model="model1" mask="dddd, MMM D, YYYY" />
      </div>

      <div>
        <div class="q-pb-sm">
          <q-badge color="teal"> Model: {{ model2 }} </q-badge>
        </div>
        <div class="q-pb-sm">
          <q-badge color="purple" text-color="white">
            Mask: [Month ( ]MMMM ) Do[, Year ( ]YYYY )
          </q-badge>
        </div>

        <q-date v-model="model2" mask="[Month ( ]MMMM ) Do[, Year ( ]YYYY )" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model1 = ref('Sunday, Apr 28, 2019')
const model2 = ref('Month ( March ) 14th, Year ( 2019 )')
</script>
```

Using the mask to connect a QDate and [QTime](/vue-components/time) to the same model:

**Example: QDate and QTime on same model**

Source: [MaskDateTime.vue](../../examples/QDate/MaskDateTime.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-badge color="teal"> Model: {{ model }} </q-badge>
      <q-badge color="purple" text-color="white" class="q-ma-md">
        Mask: YYYY-MM-DD HH:mm
      </q-badge>
    </div>

    <div class="q-gutter-md row items-start">
      <q-date v-model="model" mask="YYYY-MM-DD HH:mm" color="purple" />
      <q-time v-model="model" mask="YYYY-MM-DD HH:mm" color="purple" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('2019-02-22 21:02')
</script>
```

::: tip
If you want to programmatically set the value of QDate, you can do so by just re-assigning the value that you pass. However, the updated value needs to be a string in the same format as your mask. Eg. in the case your mask is `'dddd, MMM D, YYYY'`, passing `'2019/04/28'` as value won't work, you would need to pass `'Sunday, Apr 28, 2019'` instead.
:::

### Custom ad-hoc locale

If, for some reason, you need to use a custom ad-hoc locale rather than the current Quasar Language Pack that has been set, you can use the `locale` prop:

**Example: Custom ad-hoc locale**

Source: [CustomLocale.vue](../../examples/QDate/CustomLocale.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      <q-badge color="teal"> Model: {{ model }} </q-badge>
    </div>

    <q-date v-model="model" :locale="myLocale" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('2019/03/15')

// can supply only what needed (the rest will be taken from current locale):
const myLocale = {
  /* starting with Sunday */
  days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_'
    ),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'dias'
}

const firstDayOfWeek = 1 // 0-6, 0 - Sunday, 1 Monday, ...
const format24h = true
const pluralDay = 'dias'
</script>
```

### Coloring

**Example: Coloring**

Source: [Color.vue](../../examples/QDate/Color.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date v-model="date" color="orange" />

      <q-date v-model="date" color="yellow" text-color="black" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

**Example: Force dark mode**

Source: [Dark.vue](../../examples/QDate/Dark.vue)

```vue
<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <div class="q-gutter-md">
      <q-date v-model="date" dark bordered />

      <q-date v-model="date" color="orange" text-color="black" dark bordered />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

### Highlighting events

The first example is using an array and the second example is using a function.

**Example: Events**

Source: [Events.vue](../../examples/QDate/Events.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date v-model="date" :events="events" />

      <q-date v-model="date" :events="eventsFn" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
const events = [
  // #region
  '2019/02/01',
  '2019/02/05',
  '2019/02/06',
  '2019/02/09',
  '2019/02/23'
  // #endregion
]

function eventsFn(d) {
  const parts = d.split('/')
  return parts[2] % 2 === 0
}
</script>
```

**Example: Event color**

Source: [EventColor.vue](../../examples/QDate/EventColor.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date
        v-model="date"
        :events="events"
        :event-color="date => (date[9] % 2 === 0 ? 'teal' : 'orange')"
      />

      <q-date
        v-model="date"
        :events="eventsFn"
        :event-color="date => (date[9] % 2 === 0 ? 'teal' : 'orange')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
const events = [
  // #region
  '2019/02/01',
  '2019/02/05',
  '2019/02/06',
  '2019/02/09',
  '2019/02/23'
  // #endregion
]

function eventsFn(d) {
  return (
    d === '2019/02/01' ||
    d === '2019/02/05' ||
    d === '2019/02/06' ||
    d === '2019/02/09' ||
    d === '2019/02/23'
  )
}
</script>
```

### Limiting options

- You can use the `options` prop to limit user selection to certain times.
- Alternatively, for a more in-depth way of limiting options, you can also supply a function (second and third example below) to `options-fn` prop.

::: warning
The `options` property is only partially compatible with the `range` prop. Ranges might contain "unselectable" days.
:::

**Example: Options**

Source: [Options.vue](../../examples/QDate/Options.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date v-model="date" :options="options" />

      <q-date v-model="date" :options="optionsFn" />

      <q-date v-model="date" :options="optionsFn2" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')

const options = [
  // #region
  '2019/02/01',
  '2019/02/05',
  '2019/02/06',
  '2019/02/09',
  '2019/02/23'
  // #endregion
]

function optionsFn(d) {
  return d >= '2019/02/03' && d <= '2019/02/15'
}

function optionsFn2(d) {
  const parts = d.split('/')
  return parts[2] % 2 === 0
}
</script>
```

### Applying navigation boundaries

In the example below the navigation is restricted between 2020/07 and 2020/09.

**Example: Navigation boundaries**

Source: [NavigationBoundaries.vue](../../examples/QDate/NavigationBoundaries.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      navigation-min-year-month="2020/07"
      navigation-max-year-month="2020/09"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2020/07/04')
</script>
```

### With additional buttons

You can use the default slot for adding buttons:

**Example: With additional buttons**

Source: [AdditionalButtons.vue](../../examples/QDate/AdditionalButtons.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-mb-sm">
      <q-badge color="teal"> Model: {{ date }} </q-badge>
    </div>

    <q-btn icon="event" round color="primary">
      <q-popup-proxy
        @before-show="updateProxy"
        cover
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date v-model="proxyDate">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup />
            <q-btn
              label="OK"
              color="primary"
              flat
              @click="save"
              v-close-popup
            />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/03/01')
const proxyDate = ref('2019/03/01')

function updateProxy() {
  proxyDate.value = date.value
}

function save() {
  date.value = proxyDate.value
}
</script>
```

### With QSplitter and QTabPanels

**Example: With QSplitter and QTabPanels**

Source: [Splitter.vue](../../examples/QDate/Splitter.vue)

```vue
<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 450px">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-date v-model="date" :events="events" event-color="orange" />
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="date"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="2019/02/01">
            <div class="text-h4 q-mb-md">2019/02/01</div>
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
          </q-tab-panel>

          <!-- #region -->
          <q-tab-panel name="2019/02/05">
            <div class="text-h4 q-mb-md">2019/02/05</div>
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
          </q-tab-panel>

          <q-tab-panel name="2019/02/06">
            <div class="text-h4 q-mb-md">2019/02/06</div>
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
          </q-tab-panel>
          <!-- #endregion -->
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50)
const date = ref('2019/02/01')
const events = ['2019/02/01', '2019/02/05', '2019/02/06']
</script>
```

More info: [QSplitter](/vue-components/splitter), [QTabPanels](/vue-components/tab-panels).

### With QInput

**Example: With QInput**

Source: [Input.vue](../../examples/QDate/Input.vue)

```vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input filled v-model="date" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
```

Connecting a QDate and QTime with same model on a QInput:

**Example: QDate and QTime with QInput**

Source: [InputFull.vue](../../examples/QDate/InputFull.vue)

```vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input filled v-model="date">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019-02-01 12:44')
</script>
```

The following are **helpers** for QInput `mask` and `rules` props. You can use these for convenience or write the string specifying your [custom needs](/vue-components/input#mask).

- Property `mask` helpers: [full list](https://github.com/quasarframework/quasar/blob/dev/ui/src/components/input/use-mask.js#L6).
- Property `rules` helpers: [full list](https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns/patterns.js).

Examples: "date", "time", "fulltime".

More info: [QInput](/vue-components/input).

### Persian calendar

You have to set `calendar` to `persian` to use this feature .

::: tip
You can couple this with a Quasar [language pack](/options/quasar-language-packs) such as Persian (Farsi, `fa-IR`) to have the QDate strings translated too, for the full experience.
:::

::: warning
When using the persian calendar, the mask for QDate is forced to `YYYY/MM/DD`.
:::

<q-btn href="https://codepen.io/rstoenescu/pen/MWKpbNa" target="_blank" label="See example" icon-right="launch" rel="noopener noreferrer" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QDate, otherwise formData will not contain it (if it should):

The browser converts the model to a String. When using `multiple` or `range`, use your own hidden inputs if the server requires individual dates or structured range data.

**Example: Native form**

Source: [NativeForm.vue](../../examples/QDate/NativeForm.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-date name="wedding" v-model="date" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>

    <q-card
      v-if="submitResult.length > 0"
      flat
      bordered
      class="q-mt-md"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
      <q-card-section
        >Submitted form contains the following formData (key =
        value):</q-card-section
      >
      <q-separator />
      <q-card-section class="row q-gutter-sm items-center">
        <div
          v-for="(item, index) in submitResult"
          :key="index"
          class="q-px-sm q-py-xs bg-grey-8 text-white rounded-borders text-center text-no-wrap"
          >{{ item.name }} = {{ item.value }}</div
        >
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2020/03/20')
const submitResult = ref([])

function onSubmit(evt) {
  const formData = new FormData(evt.target)
  const data = []

  for (const [name, value] of formData.entries()) {
    data.push({
      name,
      value
    })
  }

  submitResult.value = data
}
</script>
```
