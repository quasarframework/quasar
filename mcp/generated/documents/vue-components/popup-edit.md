---
title: Popup Edit
description: The QPopupEdit Vue component can be used to edit a value 'in place', like for example on a cell in QTable.
canonical: https://quasar.dev/vue-components/popup-edit
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QPopupEdit](../../api/QPopupEdit.md)

The QPopupEdit component can be used to edit a value “in place”, like for example a cell in QTable. By default, a cell is displayed as a String, then if you are using QPopupEdit and a user clicks/taps on the table cell, a popup will open where the user will be able to edit the value using a textfield.

This component injects a [QMenu](/vue-components/menu) into its parent DOM element and enables the behavior described above, so **it can be used anywhere**, not only in QTable.

**API reference:** [QPopupEdit](../../api/QPopupEdit.md)

## Usage

::: warning
If used on a QTable, QPopupEdit won't work with cell scoped slots.
:::

### Standalone

**Example: Click on text**

Source: [Standalone.vue](../../examples/QPopupEdit/Standalone.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="cursor-pointer">
      {{ label }}
      <q-popup-edit v-model="label" auto-save v-slot="scope">
        <q-input
          v-model="scope.value"
          dense
          autofocus
          counter
          @keyup.enter="scope.set"
        />
      </q-popup-edit>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const label = ref('Click me')
</script>
````

### With QTable

Click on the cells to see the popup editor. The column "Name" demonstrates the `title` prop. The column "Calories" displays a numeric value usage. The column "Fat" also demonstrates the `disable` prop. If you look at the source code, you'll see the cell for "fat" is using QPopupEdit, yet when clicking on the cell, the popup doesn't show.

**Example: Edit first columns**

Source: [WithTable.vue](../../examples/QPopupEdit/WithTable.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      title="QDataTable with QPopupEdit"
      :rows-per-page-options="[]"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit
              v-model="props.row.name"
              title="Edit the Name"
              auto-save
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit
              v-model.number="props.row.calories"
              auto-save
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            {{ props.row.fat }}
            <q-popup-edit
              disable
              v-model="props.row.fat"
              auto-save
              v-slot="scope"
            >
              <div class="text-italic text-primary q-mb-xs">
                My Custom Title
              </div>

              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
          </q-td>
          <q-td key="protein" :props="props">
            {{ props.row.protein }}
          </q-td>
          <q-td key="sodium" :props="props">
            {{ props.row.sodium }}
          </q-td>
          <q-td key="calcium" :props="props">
            {{ props.row.calcium }}
            <q-popup-edit v-model="props.row.calcium" v-slot="scope">
              <div class="text-italic text-primary"> My Custom Title </div>
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="iron" :props="props">
            {{ props.row.iron }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
    align: 'left',
    label: 'Dessert (100g serving)',
    field: 'name'
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories' },
  { name: 'fat', label: 'Fat (g)', field: 'fat' },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium' },
  { name: 'iron', label: 'Iron (%)', field: 'iron' }
  // #endregion
]

const rows = ref([
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
  // #endregion
])
</script>
````

### Customizing

**Example: Customizing QPopupEdit**

Source: [Customizing.vue](../../examples/QPopupEdit/Customizing.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <div class="cursor-pointer" style="width: 100px">
        {{ label }}
        <q-popup-edit
          v-model="label"
          class="bg-accent text-white"
          v-slot="scope"
        >
          <q-input
            dark
            color="white"
            v-model="scope.value"
            dense
            autofocus
            counter
            @keyup.enter="scope.set"
          >
            <template v-slot:append>
              <q-icon name="edit" />
            </template>
          </q-input>
        </q-popup-edit>
      </div>

      <div class="cursor-pointer" style="width: 100px">
        {{ label2 }}
        <q-popup-edit
          v-model="label2"
          :cover="false"
          :offset="[0, 10]"
          v-slot="scope"
        >
          <q-input
            color="accent"
            v-model="scope.value"
            dense
            autofocus
            counter
            @keyup.enter="scope.set"
          >
            <template v-slot:prepend>
              <q-icon name="record_voice_over" color="accent" />
            </template>
          </q-input>
        </q-popup-edit>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const label = ref('Click me')
const label2 = ref('Also click me')
</script>
````

### Persistent and with buttons

You can also add two buttons with the `buttons` prop, "Cancel" and "Set" (the default labels). These buttons help to control the user's input. Along with the `buttons` prop, you also have the `persistent` prop, which denies the user from closing the popup with the escape key or clicking/ tapping outside of the popup. Lastly, you can control the labels of the two buttons with the `label-set` and `label-cancel` props, as seen in the "Protein" column. Notice "Save" is replacing "Set" and "Close" is replacing "Cancel".

> The `persistent` prop is demonstrated in the "carbs" column.

**Example: Persistent edit, and with buttons**

Source: [WithButtons.vue](../../examples/QPopupEdit/WithButtons.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      title="QDataTable with QPopupEdit"
      :rows-per-page-options="[]"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" buttons v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit
              v-model.number="props.row.calories"
              buttons
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit v-model.number="props.row.fat" buttons v-slot="scope">
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
            <q-popup-edit
              v-model.number="props.row.carbs"
              buttons
              persistent
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="protein" :props="props">
            {{ props.row.protein }}
            <q-popup-edit
              v-model.number="props.row.protein"
              buttons
              label-set="Save"
              label-cancel="Close"
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="sodium" :props="props">
            {{ props.row.sodium }}
            <q-popup-edit
              v-model.number="props.row.sodium"
              buttons
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="calcium" :props="props">
            {{ props.row.calcium }}
            <q-popup-edit v-model="props.row.calcium" buttons v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="iron" :props="props">
            {{ props.row.iron }}
            <q-popup-edit v-model="props.row.iron" buttons v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
    align: 'left',
    label: 'Dessert (100g serving)',
    field: 'name'
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories' },
  { name: 'fat', label: 'Fat (g)', field: 'fat' },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium' },
  { name: 'iron', label: 'Iron (%)', field: 'iron' }
  // #endregion
]

const rows = ref([
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
  // #endregion
])
</script>
````

### The default slot

The default slot's parameters are:

<!-- prettier-ignore -->
```js
{
  initialValue, value, validate, set, cancel, updatePosition
}
```

::: warning
Do not destructure the slot's parameters as it will generate linting errors when using the `value` prop directly with `v-model`.
:::

**Example: Default slot parameters**

Source: [DefaultSlotParameters.vue](../../examples/QPopupEdit/DefaultSlotParameters.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="cursor-pointer">
      {{ nickname }}
      <q-popup-edit
        v-model="nickname"
        :validate="val => val.length > 5"
        v-slot="scope"
      >
        <q-input
          autofocus
          dense
          v-model="scope.value"
          :model-value="scope.value"
          hint="Your nickname"
          :rules="[val => scope.validate(val) || 'More than 5 chars required']"
        >
          <template v-slot:after>
            <q-btn
              flat
              dense
              color="negative"
              icon="cancel"
              @click.stop.prevent="scope.cancel"
            />

            <q-btn
              flat
              dense
              color="positive"
              icon="check_circle"
              @click.stop.prevent="scope.set"
              :disable="
                !scope.validate(scope.value) ||
                scope.initialValue === scope.value
              "
            />
          </template>
        </q-input>
      </q-popup-edit>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nickname = ref('Click me')
</script>
````

### Textarea / QEditor

Since QPopupEdit wraps QInput, you can basically use any type of QInput. For instance, you can also use a text area as shown below in the "Comments" column.

::: tip
When using a multi-line control (textarea, QEditor) for input, you'll need to also use `@keyup.enter.stop` on the component in order to stop the enter key from closing the popup. You'll also need to add buttons for controlling the popup too.
:::

**Example: QInput textarea**

Source: [TextArea.vue](../../examples/QPopupEdit/TextArea.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      title="QDataTable with QPopupEdit"
      :rows-per-page-options="[]"
      row-key="name"
      wrap-cells
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
          </q-td>

          <q-td key="comment" :props="props">
            <div>{{ props.row.comment }}</div>
            <q-popup-edit buttons v-model="props.row.comment" v-slot="scope">
              <q-input
                type="textarea"
                v-model="scope.value"
                autofocus
                counter
                @keyup.enter.stop
              />
            </q-popup-edit>
          </q-td>

          <q-td key="calories" :props="props">
            {{ props.row.calories }}
          </q-td>

          <q-td key="fat" :props="props">
            <div>{{ props.row.fat }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'desc',
    style: 'min-width: 160px; width: 160px',
    align: 'left',
    label: 'Dessert',
    field: 'name'
  },
  {
    name: 'comment',
    style: 'min-width: 200px; width: 200px',
    align: 'left',
    label: 'Comment (editable)',
    field: 'comment'
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories' },
  { name: 'fat', label: 'Fat (g)', field: 'fat' }
]

const rows = ref([
  // #region
  {
    name: 'Frozen Yogurt',
    comment: `It's cold but great and tastes different than normal ice cream, but it's great too!
Have a taste!`,
    calories: 159,
    fat: 6
  },
  {
    name: 'Ice cream sandwich',
    comment: `It's also cold but great!
Have a taste!`,
    calories: 237,
    fat: 9
  },
  {
    name: 'Eclair',
    comment: `It's not cold and also great!
Have a taste!`,
    calories: 262,
    fat: 16
  },
  {
    name: 'Cupcake',
    comment: `It could be warm and it's great!
 Have a taste!`,
    calories: 305,
    fat: 3.7
  },
  {
    name: 'Gingerbread',
    comment: `It's spicy and great!
Have a taste!`,
    calories: 356,
    fat: 16
  },
  {
    name: 'Jelly bean',
    comment: `It's neither cold or warm, but great!
Have one or two or several, but not too many!`,
    calories: 375,
    fat: 0
  },
  {
    name: 'Lollipop',
    comment: `It's sticky and normally sweet!
Have a lick!`,
    calories: 392,
    fat: 0.2
  },
  {
    name: 'Honeycomb',
    comment: `It's special and sweet!
Have a taste!`,
    calories: 408,
    fat: 3.2
  },
  {
    name: 'Donut',
    comment: `It's an American classic glazed!
Have one with coffee!`,
    calories: 452,
    fat: 25
  },
  {
    name: 'KitKat',
    comment: `It's good with a break!
Have a section to perfection!`,
    calories: 518,
    fat: 26
  }
  // #endregion
])
</script>
````

**Example: QEditor**

Source: [PopupWithEditor.vue](../../examples/QPopupEdit/PopupWithEditor.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      title="QDataTable with QPopupEdit"
      :rows-per-page-options="[]"
      row-key="name"
      wrap-cells
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>

          <q-td key="comment" :props="props">
            <div v-html="props.row.comment"></div>
            <q-popup-edit buttons v-model="props.row.comment" v-slot="scope">
              <q-editor
                v-model="scope.value"
                min-height="5rem"
                autofocus
                @keyup.enter.stop
              />
            </q-popup-edit>
          </q-td>

          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit v-model.number="props.row.calories" v-slot="scope">
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>

          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit v-model.number="props.row.fat" v-slot="scope">
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'desc',
    style: 'min-width: 160px; width: 160px',
    align: 'left',
    label: 'Dessert',
    field: 'name'
  },
  {
    name: 'comment',
    style: 'min-width: 200px; width: 200px',
    align: 'left',
    label: 'Comment (editable)',
    field: 'comment'
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories' },
  { name: 'fat', label: 'Fat (g)', field: 'fat' }
]

const rows = ref([
  // #region
  {
    name: 'Frozen Yogurt',
    comment:
      "<p>It's cold but great and tastes different than normal ice cream, but it's great too!</p><p><strong>Have a taste!</strong></p>",
    calories: 159,
    fat: 6
  },
  {
    name: 'Ice cream sandwich',
    comment:
      "<p>It's also cold but great!</p><p><strong>Have a taste!</strong></p>",
    calories: 237,
    fat: 9
  },
  {
    name: 'Eclair',
    comment:
      "<p>It's not cold and also great!</p><p><strong>Have a taste!</strong></p>",
    calories: 262,
    fat: 16
  },
  {
    name: 'Cupcake',
    comment:
      "<p>It could be warm and it's great!</p><p><strong>Have a taste!</strong></p>",
    calories: 305,
    fat: 3.7
  },
  {
    name: 'Gingerbread',
    comment:
      "<p>It's spicy and great!</p><p><strong>Have a taste!</strong></p>",
    calories: 356,
    fat: 16
  },
  {
    name: 'Jelly bean',
    comment:
      "<p>It's neither cold or warm, but great!</p><p><strong>Have one or two or several, but not too many!</strong></p>",
    calories: 375,
    fat: 0
  },
  {
    name: 'Lollipop',
    comment:
      "<p>It's sticky and normally sweet!</p><p><strong>Have a lick!</strong></p>",
    calories: 392,
    fat: 0.2
  },
  {
    name: 'Honeycomb',
    comment:
      "<p>It's special and sweet!</p><p><strong>Have a taste!</strong></p>",
    calories: 408,
    fat: 3.2
  },
  {
    name: 'Donut',
    comment:
      "<p>It's an American classic glazed!</p><p><strong>Have one with coffee!</strong></p>",
    calories: 452,
    fat: 25
  },
  {
    name: 'KitKat',
    comment:
      "<p>It's good with a break!</p><p><strong>Have a section to perfection!</strong></p>",
    calories: 518,
    fat: 26
  }
  // #endregion
])
</script>
````

### Validation

QPopupEdit also allows for simple validation of the input. To use it, you give it a callback function in the form of an arrow function and it should return a Boolean. `(value) => Boolean`. This is **demonstrated in the "Calories" column** below.

::: tip Tip 1
Notice we are using the `hide` event to also revalidate the input. If we don't, QInput's error prop will 'hang' in an invalid state.
:::

::: tip Tip 2
With this example, we are using QInput's external error handling. We could also use QInput's validation prop and emit the value to QPopupEdit's validation prop. The same concept can be implemented, when using [Regle](https://reglejs.dev/) external validation library too. In other words, the value given to QPopupEdit's validate function can come from anywhere.
:::

**Example: Edit with validation**

Source: [WithValidation.vue](../../examples/QPopupEdit/WithValidation.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      title="QDataTable with QPopupEdit"
      :rows-per-page-options="[]"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit
              v-model.number="props.row.calories"
              buttons
              label-set="Save"
              label-cancel="Close"
              :validate="caloriesRangeValidation"
              @hide="caloriesRangeValidation"
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                hint="Enter a number between 4 and 7"
                :error="errorCalories"
                :error-message="errorMessageCalories"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
          </q-td>
          <q-td key="protein" :props="props">
            {{ props.row.protein }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'desc', align: 'left', label: 'Dessert', field: 'name' },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories (editable)',
    field: 'calories'
  },
  { name: 'fat', label: 'Fat', field: 'fat' },
  { name: 'carbs', label: 'Carbs', field: 'carbs' },
  { name: 'protein', label: 'Protein', field: 'protein' }
]

const rows = ref([
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7
  }
  // #endregion
])

const errorCalories = ref(false)
const errorMessageCalories = ref('')

function caloriesRangeValidation(val) {
  if (val < 4 || val > 7) {
    errorCalories.value = true
    errorMessageCalories.value = 'The value must be between 4 and 7!'
    return false
  }
  errorCalories.value = false
  errorMessageCalories.value = ''
  return true
}
</script>
````
