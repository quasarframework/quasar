<template>
  <div>
    <!--
    <q-form
      ref="myForm"
      class="flex flex-center"
      @submit="registerEmail"
      method="POST"
      action="https://sibforms.com/serve/MUIEADG6z0wl6_1-9yC8nQLvyzJ0xyfsQ5b34LhN7Ptf3005mmPPmClSZYF_p77q2Ev5PvwPjqv6Dglwpdf7elKB_1Z4Et3w6o2ybRbBZyz7gzeR_pPh3GGrO5t7-j6MdbLNk2l3EubpW4E6m72gkgNmI_JVJuG9BXAiQjuKX7uSVhrwjL6RUjWI7Ba0d1Lt4psPSB2KOZ6M7FrY"
      target="frame"
    >

      <q-input
        v-model="email"
        placeholder="Email address..."
        class="rounded-borders q-px-md col on-left col-xs-6 col-sm-8 col-md-6 col-lg-5 col-xl-3"
        ref="emailInput"
        color="black"
        outlined
        dense
        maxlength="200" type="email" id="EMAIL" name="EMAIL"
      />

      <q-btn color="primary" class="col-auto q-py-sm" type="submit">Hook me up!</q-btn>

      <q-separator class="full-width" />

      <q-checkbox
        v-model="acceptTerms"
        :color="termsColor"
        :class="`text-${termsClass}`"
        ref="acceptTerms"
        keep-color
        :dark="false"
      >
        By submitting your email address you agree to the terms set out in our
        <a
          @click.stop="showTermsAndConditions = !showTermsAndConditions"
          :class="`text-${termsColor}`"
        >
          Privacy Policy
        </a>
      </q-checkbox>
      <input type="text" name="email_address_check" value="" class="hidden">
      <input type="hidden" name="locale" value="en">
      <input type="hidden" name="html_type" value="simple">
    </q-form>

    <q-dialog
      v-model="showTermsAndConditions"
      transition-show="slide-down"
      content-class="tc__dialog"
    >
      <div class="bg-white z-top q-pa-xs">
        <iframe
          id="tc__frame"
          src="https://www.iubenda.com/privacy-policy/40685560"
          height="500"
          frameborder="0"
        ></iframe>
      </div>
    </q-dialog>
        -->

  </div>
</template>

<script>
import { throttle } from 'quasar'

export default {
  name: 'registerInterest',

  data () {
    return {
      email: null,
      timeout: 5000,
      interval: null,
      acceptTerms: false,
      showTermsAndConditions: false,
      termsColor: 'primary',
      termsClass: 'black'
    }
  },

  methods: {
    validateEmail (email) {
      let re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
      return re.test(String(email).toLowerCase())
    },

    highlightTerms () {
      this.$refs.acceptTerms.$el.focus()
      this.termsColor = 'negative'
      this.termsClass = 'shake'
      setTimeout(() => {
        this.termsClass = ''
        this.termsColor = 'primary'
      }, 2000)
    },

    registerEmail () {
      this.$refs.emailInput.focus()
      if (!this.email || !this.validateEmail(this.email)) {
        this.$q.notify({
          message: 'Please enter a valid email address.', // this.$t('strEmailIsRequired'),
          color: 'primary',
          position: 'top'
        })
      }
      else if (!this.acceptTerms) {
        this.highlightTerms()
        this.$q.notify({
          message: 'Please accept the terms and conditions to submit your email address.', // this.$t('strEmailIsRequired'),
          color: 'primary',
          position: 'top'
        })
      }
      else {
        this.termsColor = 'primary'
        this.email = this.email.toLowerCase()
        this.$q.loading.show()

        /* const addEmailSubscriber = this.$firebase.functions().httpsCallable('addEmailSubscriber')

          addEmailSubscriber({
            email: this.email
          }).then(res => {
            if (res.data.status === 'info') {
              this.doGoodResponse(res.data)
            }
            else {
              this.$refs.newsletterFormBtn.click()
            }
          }).catch(e => {
            this.$q.loading.hide()
            this.$q.notify({
              message: `Something went wrong: ${e.message}`,
              color: 'negative',
              position: 'top'
            })
          })

       */
      }
    },

    doGoodResponse (data) {
      this.$q.notify({
        message: data.message,
        color: this.getStatusColor(data.status),
        position: 'top'
      })
      this.email = ''
      this.acceptTerms = false
      this.$q.loading.hide()
    },

    getStatusColor (status) {
      switch (status) {
        case 'failed': return 'negative'
        case 'info': return 'primary'
        default: return 'positive'
      }
    }
  },

  mounted () {
    this.$refs.emailInput.focus()
  },

  beforeMount () {
    this.registerEmail = throttle(this.registerEmail, 1500)
  },

  created () {
    if (this.$route.query.newsletter === 'done') {
      this.$q.notify({
        message: 'Thank you for subscribing. Please confirm your subscription by clicking the link in your confirmation email (check your spam box)',
        color: 'positive',
        position: 'top',
        timeout: 7500
      })
    }
  }
}
</script>

<style lang="stylus">
  .interest__form
    width 100vw
    margin 0 auto

    input
      background rgba(255, 255, 255, 0.22) !important

  .shake
    animation shake 0.82s cubic-bezier(.36,.07,.19,.97) both
    transform translate3d(0, 0, 0)
    backface-visibility hidden
    perspective 1000px

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  #tc__frame
    width 100%

  .tc__dialog
    z-index 7001 !important

  .testimonial__container
    background rgba(255, 255, 255, 0.05)

  .interest__separator
    opacity 0.22
</style>
