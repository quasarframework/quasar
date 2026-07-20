---
title: Stepper
description: The QStepper Vue component conveys progress through a sequence of numbered steps. It may also be used for navigation. It's usually useful when the user has to follow steps to complete a process, like in a wizard.
canonical: https://quasar.dev/vue-components/stepper
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QStep](../../api/QStep.md)
- [QStepper](../../api/QStepper.md)
- [QStepperNavigation](../../api/QStepperNavigation.md)

Steppers display progress through a sequence of logical and numbered steps. They may also be used for navigation.
They're usually useful when the user has to follow steps to complete a process, like in a [wizard](<https://en.wikipedia.org/wiki/Wizard_(software)>).

**API reference:** [QStepper](../../api/QStepper.md)

**API reference:** [QStep](../../api/QStep.md)

**API reference:** [QStepperNavigation](../../api/QStepperNavigation.md)

The `QStepperNavigation` component allows you to place buttons within `QStepper` or `QStep` to
navigate through the steps. It is up to you to add whatever buttons you require.

::: tip
To use global navigation, you must add it to the `QStepper` "navigation" slot.
:::

## Usage

::: tip
If the QStep content also has images and you want to use swipe actions to navigate, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

::: danger Keep Alive

- Please take notice of the Boolean `keep-alive` prop for QStepper, if you need this behavior. Do NOT use Vue's native `<keep-alive>` component over QStep.
- Should you need the `keep-alive-include` or `keep-alive-exclude` props then the QStep `name`s must be valid Vue component names (no spaces allowed, don't start with a number etc).

:::

### Horizontal

**Example: Horizontal**

Source: [TypeHorizontal.vue](../../examples/QStepper/TypeHorizontal.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" ref="stepperRef" color="primary" animated>
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" title="Ad template" icon="assignment" disable>
        This step won't show up because it is disabled.
      </q-step>

      <q-step :name="4" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="primary"
            :label="step === 4 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

### Vertical

**Example: Vertical**

Source: [TypeVertical.vue](../../examples/QStepper/TypeVertical.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.

        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.

        <q-stepper-navigation>
          <q-btn @click="step = 4" color="primary" label="Continue" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Ad template" icon="assignment" disable>
        This step won't show up because it is disabled.
      </q-step>

      <q-step :name="4" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

### Header navigation

**Example: Non-linear header navigation**

Source: [NonLinearNavigation.vue](../../examples/QStepper/NonLinearNavigation.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      label="Reset"
      push
      color="white"
      text-color="primary"
      @click="reset"
      class="q-mb-md"
    />

    <q-stepper v-model="step" header-nav color="primary" animated>
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="done1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.

        <q-stepper-navigation>
          <q-btn
            @click="
              () => {
                done1 = true
                step = 2
              }
            "
            color="primary"
            label="Continue"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="done2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.

        <q-stepper-navigation>
          <q-btn
            @click="
              () => {
                done2 = true
                step = 3
              }
            "
            color="primary"
            label="Continue"
          />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Create an ad" icon="add_comment" :done="done3">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" @click="done3 = true" label="Finish" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
const done1 = ref(false)
const done2 = ref(false)
const done3 = ref(false)

function reset() {
  done1.value = false
  done2.value = false
  done3.value = false
  step.value = 1
}
</script>
````

**Example: Linear header navigation**

Source: [LinearNavigation.vue](../../examples/QStepper/LinearNavigation.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      label="Reset"
      push
      color="white"
      text-color="primary"
      @click="step = 1"
      class="q-mb-md"
    />

    <q-stepper v-model="step" header-nav color="primary" animated>
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
        :header-nav="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.

        <q-stepper-navigation>
          <q-btn
            @click="
              () => {
                done1 = true
                step = 2
              }
            "
            color="primary"
            label="Continue"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
        :header-nav="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.

        <q-stepper-navigation>
          <q-btn
            @click="
              () => {
                done2 = true
                step = 3
              }
            "
            color="primary"
            label="Continue"
          />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Create an ad"
        icon="add_comment"
        :header-nav="step > 3"
      >
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" @click="done3 = true" label="Finish" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

### Header options

**Example: Signaling step error**

Source: [StepError.vue](../../examples/QStepper/StepError.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepperRef"
      color="primary"
      header-nav
      animated
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :error="step < 3"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="primary"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(2)
</script>
````

**Example: Alternative labels**

Source: [AlternativeLabels.vue](../../examples/QStepper/AlternativeLabels.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepperRef"
      alternative-labels
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="primary"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

::: tip
You can also connect `contracted` prop to `$q.screen` to create a responsive behavior, like `:contracted="$q.screen.lt.md"`.
More info: [Quasar Screen Plugin](/options/screen-plugin).
:::

**Example: Contracted**

Source: [Contracted.vue](../../examples/QStepper/Contracted.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepperRef"
      contracted
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="primary"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

### Style

Play with coloring using the `*-icon` and `*-color` props (on QStepper or override on specific QStep).

**Example: Coloring**

Source: [Coloring.vue](../../examples/QStepper/Coloring.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepperRef"
      animated
      done-color="deep-orange"
      active-color="purple"
      inactive-color="secondary"
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="deep-orange"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="deep-orange"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

You can also use `prefix` prop (max 2 characters) instead of an icon for each step's header. This will be displayed if the step is not currently being edited and it isn't marked with error or as "done".

**Example: Step prefix**

Source: [Prefix.vue](../../examples/QStepper/Prefix.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" ref="stepperRef" animated active-color="purple">
      <q-step :name="1" prefix="1" title="Select campaign settings">
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        prefix="2"
        title="Create an ad group"
        caption="Optional"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" prefix="3" title="Create an ad">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="deep-orange"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="deep-orange"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

**Example: Force dark mode**

Source: [Dark.vue](../../examples/QStepper/Dark.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepperRef"
      dark
      class="bg-grey-9"
      active-color="deep-orange"
      done-color="secondary"
      animated
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="deep-orange"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="deep-orange"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

You can use the `header-class` prop to apply any CSS class(es) to the header. In the example below, we are applying bolded text:

**Example: Header Class**

Source: [HeaderClass.vue](../../examples/QStepper/HeaderClass.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepperRef"
      color="primary"
      header-class="text-bold"
      animated
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="3" title="Ad template" icon="assignment" disable>
        This step won't show up because it is disabled.
      </q-step>

      <q-step :name="4" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="primary"
            :label="step === 4 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````

### Message slot

**Example: Message slot with fixed height steps**

Source: [MessageSlot.vue](../../examples/QStepper/MessageSlot.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" ref="stepperRef" color="primary" animated>
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
        style="min-height: 200px"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.
      </q-step>

      <!-- #region -->
      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
        style="min-height: 200px"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step
        :name="3"
        title="Ad template"
        icon="assignment"
        disable
        style="min-height: 200px"
      >
        This step won't show up because it is disabled.
      </q-step>

      <q-step
        :name="4"
        title="Create an ad"
        icon="add_comment"
        style="min-height: 200px"
      >
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>
      <!-- #endregion -->

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepperRef.next()"
            color="primary"
            :label="step === 4 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepperRef.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>

      <template v-slot:message>
        <q-banner v-if="step === 1" class="bg-purple-8 text-white q-px-lg">
          Campaign settings are important...
        </q-banner>
        <q-banner v-else-if="step === 2" class="bg-orange-8 text-white q-px-lg">
          The ad group helps you to...
        </q-banner>
        <q-banner v-else-if="step === 3" class="bg-green-8 text-white q-px-lg">
          The Ad template is disabled - this won't be displayed
        </q-banner>
        <q-banner v-else class="bg-blue-8 text-white q-px-lg">
          The final step is creating the ad...
        </q-banner>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
````
