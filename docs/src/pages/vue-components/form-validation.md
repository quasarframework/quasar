---
title: Form Validation
---
Recommended package for Form Validations is `Vuelidate`.
Get started with the [documentation](https://monterail.github.io/vuelidate/).

```bash
$ yarn add vuelidate
# or:
$ npm install --save vuelidate

$ quasar new plugin vuelidate
```
An app plugin file got created: `/src/boot/vuelidate.js`. We edit it:

```js
import Vuelidate from 'vuelidate'

export default ({ Vue }) => {
  Vue.use(Vuelidate)
}
```
Then, edit `/quasar.conf.js` to add the app plugin file to the build. Add this to the main plugins at the top of the file, not in the framework plugins section.

```js
boot: ['vuelidate']
```

## Example
```vue
<template>
  <div>
    <q-input
      v-model="form.email"
      @blur="$v.form.email.$touch"
      @keyup.enter="submit"
      :error="$v.form.email.$error"
    />

    <q-btn color="primary" @click="submit">Submit</q-btn>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: {
        email: ''
      }
    }
  },
  validations: {
    form: {
      email: { required, email }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()

      if (this.$v.form.$error) {
        this.$q.notify('Please review fields again.')
        return
      }

      // ...
    }
  }
}
</script>
```
