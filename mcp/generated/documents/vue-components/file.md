---
title: File Picker
description: The QFile Vue component is used as a file picker.
canonical: https://quasar.dev/vue-components/file
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QFile](../../api/QFile.md)

QFile is a component which handles the user interaction for picking file(s).

::: tip
If you also want a component to handle the upload for you, please consider using [QUploader](/vue-components/uploader) instead.
:::

**API reference:** [QFile](../../api/QFile.md)

## Design

::: warning
For your QFile you can use only one of the main designs (`filled`, `outlined`, `standout`, `borderless`). You cannot use multiple as they are self-exclusive.
:::

**Example: Design Overview**

Source: [DesignOverview.vue](../../examples/QFile/DesignOverview.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-file v-model="model" label="Standard" />

      <q-file filled v-model="model" label="Filled" />

      <q-file outlined v-model="model" label="Outlined" />

      <q-file standout v-model="model" label="Standout" />

      <q-file
        standout="bg-teal text-white"
        v-model="model"
        label="Custom standout"
      />

      <q-file borderless v-model="model" label="Borderless" />

      <q-file rounded filled v-model="model" label="Rounded filled" />

      <q-file rounded outlined v-model="model" label="Rounded outlined" />

      <q-file rounded standout v-model="model" label="Rounded standout" />

      <q-file square filled v-model="model" label="Square filled" />

      <q-file square outlined v-model="model" label="Square outlined" />

      <q-file square standout v-model="model" label="Square standout" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
````

### Decorators

**Example: Decorators**

Source: [Decorators.vue](../../examples/QFile/Decorators.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-file filled v-model="model" label="Label (stacked)" stack-label />

      <q-file outlined v-model="model">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <q-file standout v-model="model">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-file>

      <q-file filled bottom-slots v-model="model" label="Label" counter>
        <template v-slot:prepend>
          <q-icon name="cloud_upload" @click.stop.prevent />
        </template>
        <template v-slot:append>
          <q-icon
            name="close"
            @click.stop.prevent="model = null"
            class="cursor-pointer"
          />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-file>

      <q-file
        rounded
        outlined
        bottom-slots
        v-model="model"
        label="Label"
        counter
        max-files="12"
      >
        <template v-slot:before>
          <q-icon name="attachment" />
        </template>

        <template v-slot:append>
          <q-icon
            v-if="model !== null"
            name="close"
            @click.stop.prevent="model = null"
            class="cursor-pointer"
          />
          <q-icon name="search" @click.stop.prevent />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-file>

      <q-file
        filled
        bottom-slots
        v-model="model"
        label="Label"
        counter
        max-files="12"
      >
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon
            v-if="model !== null"
            name="close"
            @click.stop.prevent="model = null"
            class="cursor-pointer"
          />
          <q-icon name="create_new_folder" @click.stop.prevent />
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-file>

      <q-file
        filled
        bottom-slots
        v-model="model"
        label="Label"
        counter
        max-files="12"
      >
        <template v-slot:before>
          <q-icon name="folder_open" />
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" @click.stop.prevent />
        </template>
      </q-file>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
````

### Coloring

**Example: Coloring**

Source: [Coloring.vue](../../examples/QFile/Coloring.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-file color="purple-12" v-model="model" label="Label">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <q-file color="teal" filled v-model="model" label="Label">
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>

      <q-file
        color="grey-3"
        outlined
        label-color="orange"
        v-model="model"
        label="Label"
      >
        <template v-slot:append>
          <q-icon name="attachment" color="orange" />
        </template>
      </q-file>

      <q-file
        color="lime-11"
        bg-color="green"
        filled
        v-model="model"
        label="Label"
      >
        <template v-slot:prepend>
          <q-icon name="attachment" />
        </template>
      </q-file>

      <q-file color="teal" outlined v-model="model" label="Label">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-file>

      <q-file
        clearable
        color="orange"
        standout
        bottom-slots
        v-model="model"
        label="Label"
        counter
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
        <template v-slot:append>
          <q-icon name="favorite" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-file>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
````

### Clearable

As a helper, you can use `clearable` prop so user can reset model to `null` through an appended icon. The second QFile in the example below is the equivalent of using `clearable`.

**Example: Clearable**

Source: [Clearable.vue](../../examples/QFile/Clearable.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-file
        clearable
        filled
        color="purple-12"
        v-model="model"
        label="Label"
      />

      <!-- equivalent -->
      <q-file color="orange" filled v-model="model" label="Label">
        <template v-if="model" v-slot:append>
          <q-icon
            name="cancel"
            @click.stop.prevent="model = null"
            class="cursor-pointer"
          />
        </template>
      </q-file>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
````

### Disable and readonly

**Example: Disable and readonly**

Source: [DisableReadonly.vue](../../examples/QFile/DisableReadonly.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-file
        disable
        filled
        v-model="model"
        hint="Disable"
        style="width: 250px"
      />

      <q-file
        readonly
        filled
        v-model="model"
        hint="Readonly"
        style="width: 250px"
      />

      <q-file
        disable
        readonly
        filled
        v-model="model"
        hint="Disable and readonly"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
````

## Usage

::: warning
Under the hood, QFile uses a native input. Due to browser security policy, it is not allowed to programmatically fill such an input with a value. As a result, even if you set v-model from the beginning to a value, the component will show those file(s) but the input tag itself won't be filled in with that value. A user interaction (click/tap/<kbd>ENTER</kbd> key/<kbd>SPACE</kbd> key) is absolutely required in order for the native input to contain them. It's best to always have the initial value of model set to `null` or `undefined/void 0`.
:::

### Basic

**Example: Single file**

Source: [BasicSingle.vue](../../examples/QFile/BasicSingle.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-file
      v-model="file"
      label="Pick one file"
      filled
      style="max-width: 300px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const file = ref(null)
</script>
````

**Example: Multiple files**

Source: [BasicMultiple.vue](../../examples/QFile/BasicMultiple.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-file
      v-model="files"
      label="Pick files"
      filled
      multiple
      style="max-width: 300px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref(null)
</script>
````

### Appending files

By default, QFile replaces the model each time the user selects any files through the popup. However, when you are accepting multiple files (`multiple` prop) you can change this behavior and append the new selection to the model rather than replacing its old value.

Below you can pick files multiple times and QFile will keep on appending them to the model:

**Example: Appending files**

Source: [AppendingFiles.vue](../../examples/QFile/AppendingFiles.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-file
      v-model="files"
      label="Pick files"
      filled
      multiple
      append
      style="max-width: 300px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref(null)
</script>
````

### Counters

**Example: Basic counter**

Source: [CounterBasic.vue](../../examples/QFile/CounterBasic.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        v-model="files"
        label="Pick files"
        filled
        counter
        multiple
        style="max-width: 300px"
      />

      <q-file
        v-model="files"
        label="Pick files"
        filled
        counter
        max-files="3"
        multiple
        style="max-width: 300px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref(null)
</script>
````

**Example: Counter label**

Source: [CounterLabel.vue](../../examples/QFile/CounterLabel.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        v-model="files"
        label="Pick files"
        filled
        counter
        :counter-label="counterLabelFn"
        max-files="3"
        multiple
        style="max-width: 300px"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref(null)

function counterLabelFn({ totalSize, filesNumber, maxFiles }) {
  return `${filesNumber} files of ${maxFiles} | ${totalSize}`
}
</script>
````

### Using chips

**Example: With chips**

Source: [WithChips.vue](../../examples/QFile/WithChips.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-file
      v-model="files"
      label="Pick files"
      outlined
      use-chips
      multiple
      style="max-width: 300px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref(null)
</script>
````

### Using file slot

The example below highlights how you can customize the display of each file and even incorporate a possible upload progress indicator:

**Example: With progress indicator**

Source: [WithProgress.vue](../../examples/QFile/WithProgress.vue)

````vue
<template>
  <div class="q-pa-md column items-start q-gutter-y-md">
    <q-file
      :model-value="files"
      @update:model-value="updateFiles"
      label="Pick files"
      outlined
      multiple
      :clearable="!isUploading"
      style="max-width: 400px"
    >
      <template v-slot:file="{ index, file }">
        <q-chip
          class="full-width q-my-xs"
          :removable="isUploading && uploadProgress[index].percent < 1"
          square
          @remove="cancelFile(index)"
        >
          <q-linear-progress
            class="absolute-full full-height"
            :value="uploadProgress[index].percent"
            :color="uploadProgress[index].color"
            track-color="grey-2"
          />

          <q-avatar>
            <q-icon :name="uploadProgress[index].icon" />
          </q-avatar>

          <div class="ellipsis relative-position">
            {{ file.name }}
          </div>

          <q-tooltip>
            {{ file.name }}
          </q-tooltip>
        </q-chip>
      </template>

      <template v-slot:after v-if="canUpload">
        <q-btn
          color="primary"
          dense
          icon="cloud_upload"
          round
          @click="upload"
          :disable="!canUpload"
          :loading="isUploading"
        />
      </template>
    </q-file>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const files = ref(null)
const uploadProgress = ref([])
const uploading = ref(null)

const isUploading = computed(() => uploading.value !== null)
const canUpload = computed(() => files.value !== null)

function cleanUp() {
  clearTimeout(uploading.value)
}

function updateUploadProgress() {
  let done = true

  uploadProgress.value = uploadProgress.value.map(progress => {
    if (progress.percent === 1 || progress.error) {
      return progress
    }

    const percent = Math.min(1, progress.percent + Math.random() / 10)
    const error = percent < 1 && Math.random() > 0.95

    if (!error && percent < 1 && done) {
      done = false
    }

    return {
      ...progress,
      error,
      color: error ? 'red-2' : 'green-2',
      percent
    }
  })

  uploading.value = done !== true ? setTimeout(updateUploadProgress, 300) : null
}

onBeforeUnmount(cleanUp)

function cancelFile(index) {
  uploadProgress.value[index] = {
    ...uploadProgress.value[index],
    error: true,
    color: 'orange-2'
  }
}

function updateFiles(newFiles) {
  files.value = newFiles
  uploadProgress.value = (newFiles || []).map(file => ({
    error: false,
    color: 'green-2',
    percent: 0,
    icon:
      file.type.indexOf('video/') === 0
        ? 'movie'
        : file.type.indexOf('image/') === 0
          ? 'photo'
          : file.type.indexOf('audio/') === 0
            ? 'audiotrack'
            : 'insert_drive_file'
  }))
}

function upload() {
  cleanUp()

  const allDone = uploadProgress.value.every(progress => progress.percent === 1)

  uploadProgress.value = uploadProgress.value.map(progress => ({
    ...progress,
    error: false,
    color: 'green-2',
    percent: allDone ? 0 : progress.percent
  }))

  updateUploadProgress()
}
</script>
````

### Restricting files

**Example: Basic restrictions**

Source: [RestrictionBasic.vue](../../examples/QFile/RestrictionBasic.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        style="max-width: 300px"
        v-model="filesImages"
        filled
        rounded
        label="Restricted to images"
        multiple
        accept=".jpg, image/*"
        @rejected="onRejected"
      />

      <q-file
        style="max-width: 300px"
        v-model="filesMaxSize"
        outlined
        label="Max file size (2k)"
        multiple
        max-file-size="2048"
        @rejected="onRejected"
      />

      <q-file
        style="max-width: 300px"
        v-model="filesMaxTotalSize"
        standout
        label="Max total upload size (4k)"
        multiple
        max-total-size="4096"
        @rejected="onRejected"
      />

      <q-file
        style="max-width: 300px"
        v-model="filesMaxNumber"
        standout
        label="Max number of files (3)"
        multiple
        max-files="3"
        @rejected="onRejected"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const filesImages = ref(null)
const filesMaxSize = ref(null)
const filesMaxTotalSize = ref(null)
const filesMaxNumber = ref(null)

function onRejected(rejectedEntries) {
  // Notify plugin needs to be installed
  // https://v2.quasar.dev/quasar-plugins/notify#Installation
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}
</script>
````

You can even combine the restrictions above.

::: tip
In the example above, we're using `accept` property. Its value must be a comma separated list of unique file type specifiers. Maps to 'accept' attribute of native input type=file element. [More info](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers).
:::

::: warning
Recommended format for the `accept` property is `<mediatype>/<extension>`. Examples: "image/png", "image/png". QFile uses an `<input type="file">` under the hood and it relies entirely on the host browser to trigger the file picker. If the `accept` property (that gets applied to the input) is not correct, no file picker will appear on screen or it will appear but it will accept all file types.
:::

You can also apply custom filters (which are executed after user picks files):

**Example: Filter**

Source: [RestrictionFilter.vue](../../examples/QFile/RestrictionFilter.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        style="max-width: 300px"
        v-model="filesMaxSize"
        filled
        label="Filtered (for <2k size)"
        multiple
        :filter="checkFileSize"
        @rejected="onRejected"
      />

      <q-file
        style="max-width: 300px"
        v-model="filesPng"
        rounded
        outlined
        label="Filtered (png only)"
        multiple
        :filter="checkFileType"
        @rejected="onRejected"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const filesMaxSize = ref(null)
const filesPng = ref(null)

function checkFileSize(files) {
  return files.filter(file => file.size < 2048)
}

function checkFileType(files) {
  return files.filter(file => file.type === 'image/png')
}

function onRejected(rejectedEntries) {
  // Notify plugin needs to be installed
  // https://v2.quasar.dev/quasar-plugins/notify#Installation
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}
</script>
````

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QFile, otherwise formData will not contain it (if it should):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QFile/NativeForm.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-file
        name="poster_file"
        v-model="file"
        filled
        label="Select poster image"
      />

      <q-file
        name="cover_files"
        v-model="files"
        filled
        multiple
        use-chips
        label="Select cover images"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>

    <q-card
      v-if="submitted"
      flat
      bordered
      class="q-mt-md"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
      <template v-if="submitEmpty">
        <q-card-section>
          Submitted form contains empty formData.
        </q-card-section>
      </template>
      <template v-else>
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
      </template>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const submitted = ref(false)
const submitEmpty = ref(false)
const submitResult = ref([])

const file = ref(null)
const files = ref(null)

function onSubmit(evt) {
  const formData = new FormData(evt.target)
  const data = []

  for (const [name, value] of formData.entries()) {
    if (value.name.length !== 0) {
      data.push({
        name,
        value: value.name
      })
    }
  }

  submitted.value = true
  submitResult.value = data
  submitEmpty.value = data.length === 0
}
</script>
````
