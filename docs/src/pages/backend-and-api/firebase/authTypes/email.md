---
title: Authentication - Email
desc: Firebase authentication using email instructions for the Quasar framework.
---

Email Authentication is one of a handful of authentication methods provided by Firebase. In order to setup email authentication you first have to enable it in your project in your console:

- In the Firebase console, open the Auth section.
- On the Sign-in method tab, enable the Email/password sign-in method and click Save.

Moving forward a form is needed for the user to register or login. This can be achieved by creating a page called `Auth.vue` which will house both registration and loggin in.

```bash
$ quasar new page Auth
```

In the `Auth.vue` page:

**/src/pages/Auth.vue**

```js
<template>
  <q-page padding>
    <h5 class="text-center">Authentication</h5>
    <q-form class="authentication q-gutter-y-md" ref="emailAuthenticationForm" @submit="onSubmit">
      <q-input
        v-model="email"
        id="email"
        name="email"
        outlined="outlined"
        lazy-rules="lazy-rules"
        autocomplete="email"
        color="primary"
        data-cy="email"
        label="EMAIL"
        type="email"
        :rules="[val => !!val || '*Field is required', val => val.includes('@') && val.includes('.') || '*Please Provide a valid email']"
      />
      <q-input
        v-model="password"
        lazy-rules="lazy-rules"
        outlined="outlined"
        autocomplete="current-password new-password"
        color="primary"
        data-cy="password"
        label="PASSWORD"
        :rules="[val => !!val || '*Field is required']" :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit(); $event.target.blur()"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-input
        v-if="isRegistration"
        lazy-rules="lazy-rules"
        outlined="outlined"
        autocomplete="new-password"
        color="primary"
        data-cy="verifyPassword"
        label="VERIFY PASSWORD"
        v-model="passwordMatch"
        :rules="[val => !!val || '*Field is required', val => val === password || `*Passwords don't match`]" :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit(); $event.target.blur()"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-btn
        class="full-width q-mt-md"
        color="primary"
        data-cy="submit"
        :label="getAuthType"
        :loading="loading"
        @click="onSubmit"
      >
        <template v-slot:loading>
          <q-spinner-gears />
        </template>
      </q-btn>
    </q-form>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Auth',
  computed: {
    getAuthType () {
      return this.isRegistration ? 'Register' : 'Login'
    },
    isRegistration () {
      return this.$route.name === 'Registration'
    }
  },
  data () {
    return {
      email: null,
      isPwd: true,
      loading: false,
      password: null,
      passwordMatch: null
    }
  },
  methods: {
    ...mapActions('auth', ['createNewUser', 'loginUser']),
    onSubmit () {
      const { email, password } = this
      this.$refs.emailAuthenticationForm.validate()
        .then(async success => {
          if (success) {
            this.loading = true
            if (this.isRegistration) {
              this.createNewUser(email, password)
            } else {
              this.loginUser(email, password)
            }
          }
        })
    }
  }
}
</script>

<style lang="stylus">
.authentication
  margin auto
  max-width 30em
  width 100%
</style>

```
