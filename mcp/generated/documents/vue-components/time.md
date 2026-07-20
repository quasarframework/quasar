---
title: QTime
description: The QTime component provides a method to input time.
canonical: https://quasar.dev/vue-components/time
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QTime](../../api/QTime.md)

The QTime component provides a method to input time.

::: tip
For handling date and/or time, also check out [Quasar Date Utils](/quasar-utils/date-utils).
:::

**API reference:** [QTime](../../api/QTime.md)

## Usage

Notice that the model is a String only.

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QTime/Basic.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time v-model="time" />

      <q-time v-model="timeWithSeconds" with-seconds />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('10:56')
const timeWithSeconds = ref('09:24:10')
</script>
```

**Example: Landscape**

Source: [Landscape.vue](../../examples/QTime/Landscape.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time v-model="time" landscape />

      <q-time v-model="timeWithSeconds" with-seconds landscape />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('10:56')
const timeWithSeconds = ref('09:24:10')
</script>
```

::: tip
For landscape mode, you can use it along with `$q.screen` to make QTime responsive. Example: `:landscape="$q.screen.gt.xs"`. More info: [Quasar Screen Plugin](/options/screen-plugin).
:::

### Keyboard navigation

The hour, minute, second, and AM/PM controls can be activated with `Space` or `Enter`. When an hour, minute, or second control has focus, use `Arrow Left` and `Arrow Right` to adjust its value.

### Functionality

The 24 hour format is applied depending on the [Quasar Language Pack](/options/quasar-language-packs) that you've set, but you can also force it, like in the example below.

**Example: 24h format**

Source: [Format24h.vue](../../examples/QTime/Format24h.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-time v-model="time" format24h />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('19:42')
</script>
```

Clicking on the "Now" button sets time to current user time:

**Example: Now button**

Source: [NowBtn.vue](../../examples/QTime/NowBtn.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-time v-model="time" now-btn />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('04:56')
</script>
```

**Example: Disable and readonly**

Source: [DisableReadonly.vue](../../examples/QTime/DisableReadonly.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time v-model="time" disable />

      <q-time v-model="time" readonly />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('10:56')
</script>
```

### Model mask

The default model mask is `HH:mm` (or `HH:mm:ss` when using `with-seconds` prop), however you can use custom masks too.

The `mask` prop tokens can be found at [Quasar Utils > Date utils](/quasar-utils/date-utils#format-for-display).

::: warning Note on SSR/SSG
Using `x` or `X` (timestamps) in the mask may cause hydration errors on the client, because decoding the model String must be done with `new Date()` which takes into account the local timezone. As a result, if the server is in a different timezone than the client, then the rendered output of the server will differ than the one on the client so hydration will fail.

If the mask contains date tokens, set `default-date` explicitly when using SSR or SSG. The runtime default is the current local date, which can differ between the server and browser.
:::

::: danger Note on persian calendar
When using the persian calendar, the mask for QTime is forced to `HH:mm` or `HH:mm:ss` (if `with-seconds` is specified).
:::

**Example: Simple mask**

Source: [MaskSimple.vue](../../examples/QTime/MaskSimple.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div>
        <div class="q-pb-sm q-gutter-sm">
          <q-badge color="teal"> Model: {{ model1 }} </q-badge>
          <q-badge color="purple" text-color="white"> Mask: hh:mm A </q-badge>
        </div>

        <q-time v-model="model1" mask="hh:mm A" />
      </div>

      <div>
        <div class="q-pb-sm q-gutter-sm">
          <q-badge color="teal"> Model: {{ model2 }} </q-badge>
          <q-badge color="purple" text-color="white"> Mask: HH*mm**ss </q-badge>
        </div>

        <q-time v-model="model2" mask="HH*mm**ss" with-seconds />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model1 = ref('01:51 PM')
const model2 = ref('08*22**10')
</script>
```

If you want to insert strings (including `[` and `]` characters) into your mask, make sure you escape them by surrounding them with `[` and `]`, otherwise the characters might be interpreted as format tokens.

**Example: Mask with escaped characters**

Source: [MaskEscape.vue](../../examples/QTime/MaskEscape.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-badge color="teal"> Model: {{ model }} </q-badge>
      <q-badge color="purple" text-color="white">
        Mask: hh[h and ]mm[ minutes (]A)
      </q-badge>
    </div>

    <div class="q-mt-sm">
      <q-time v-model="model" mask="hh[h and ]mm[ minutes (]A)" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('10h and 20 minutes (AM)')
</script>
```

Using the mask to connect a [QDate](/vue-components/date) and QTime to the same model:

**Example: QDate and QTime on same model**

Source: [MaskDateTime.vue](../../examples/QTime/MaskDateTime.vue)

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

### Custom ad-hoc locale

If, for some reason, you need to use a custom ad-hoc locale rather than the current Quasar Language Pack that has been set, you can use the `locale` prop:

**Example: Custom ad-hoc locale**

Source: [CustomLocale.vue](../../examples/QTime/CustomLocale.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      <q-badge color="teal"> Model: {{ model }} </q-badge>
    </div>

    <q-time v-model="model" mask="MMMM D, YYYY - HH:mm" :locale="myLocale" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('Febrero 22, 2019 - 21:02')
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
</script>
```

### Coloring

**Example: Coloring**

Source: [Color.vue](../../examples/QTime/Color.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time v-model="time" color="orange" />

      <q-time v-model="time" color="yellow" text-color="black" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('10:56')
</script>
```

**Example: Force dark mode**

Source: [Dark.vue](../../examples/QTime/Dark.vue)

```vue
<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <div class="q-gutter-md">
      <q-time v-model="time" dark bordered />

      <q-time v-model="time" color="orange" text-color="black" dark bordered />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('10:56')
</script>
```

### Limiting options

- You can use the `hour-options`, `minute-options` and `second-options` props to limit user selection to certain times.
- Alternatively, for a more in-depth way of limiting options, you can also supply a function (second example below) to `options-fn` prop.

**Example: Options**

Source: [Options.vue](../../examples/QTime/Options.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time
        v-model="time1"
        :hour-options="hourOptionsTime1"
        :minute-options="minuteOptionsTime1"
        :second-options="secondOptionsTime1"
        with-seconds
      />

      <q-time v-model="time2" :options="optionsFnTime2" with-seconds />

      <q-time v-model="time3" :options="optionsFnTime3" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time1 = ref('10:45:40')
const time2 = ref('14:27:20')
const time3 = ref('10:56')

const hourOptionsTime1 = [9, 10, 11, 13, 15]
const minuteOptionsTime1 = [0, 15, 30, 45]
const secondOptionsTime1 = [0, 10, 20, 30, 40, 50]

function optionsFnTime2(hr, min, sec) {
  if (hr < 6 || hr > 15 || hr % 2 !== 0) {
    return false
  }
  if (min !== null && (min <= 25 || min >= 58)) {
    return false
  }
  if (sec !== null && sec % 25 !== 0) {
    return false
  }
  return true
}

function optionsFnTime3(hr) {
  return hr % 2 === 0 || hr % 3 === 0
}
</script>
```

### With QInput

**Example: Input**

Source: [Input.vue](../../examples/QTime/Input.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row">
      <q-input filled v-model="time" mask="time" :rules="['time']">
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="time">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        filled
        v-model="timeWithSeconds"
        mask="fulltime"
        :rules="['fulltime']"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="timeWithSeconds" with-seconds format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('10:56')
const timeWithSeconds = ref('10:56:00')
</script>
```

Connecting a QDate and QTime with same model on a QInput:

**Example: QDate and QTime with QInput**

Source: [InputFull.vue](../../examples/QTime/InputFull.vue)

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

### With additional buttons

You can use the default slot for adding buttons:

**Example: With additional buttons**

Source: [AdditionalButtons.vue](../../examples/QTime/AdditionalButtons.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-mb-sm">
      <q-badge color="teal"> Model: {{ time }} </q-badge>
    </div>

    <q-btn icon="access_time" round color="primary">
      <q-popup-proxy
        @before-show="updateProxy"
        cover
        transition-show="scale"
        transition-hide="scale"
      >
        <q-time v-model="proxyTime">
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
        </q-time>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('10:56')
const proxyTime = ref('10:56')

function updateProxy() {
  proxyTime.value = time.value
}

function save() {
  time.value = proxyTime.value
}
</script>
```

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QTime, otherwise formData will not contain it (if it should):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QTime/NativeForm.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-time name="alarm" v-model="time" />

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

const time = ref('22:15')
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
