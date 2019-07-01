<template>
  <div class="text-center text-white z-top q-pa-md z-top">
    <!-- Start Aweber Form Code -->
    <form method="post" action="http://www.aweber.com/scripts/addlead.pl" class="form-horizontal hidden">
      <div style="display:none;">
        <!-- REPLACE ALL HIDDEN INPUT FIELDS WITH YOUR OWN -->
        <input type="hidden" name="meta_web_form_id" value="733048659">
        <input type="hidden" name="meta_split_id" value="">
        <input type="hidden" name="listname" value="awlist5374055">
        <input type="hidden" name="redirect" value="https://quasar.dev?newsletter=done" id="redirect_470c7ee25a0266375f7208bf72b72afc" />
        <input type="hidden" name="meta_adtracking" value="QuasarNewsletter">
        <input type="hidden" name="meta_message" value="1">
        <input type="hidden" name="meta_required" value="email">
        <input type="hidden" name="meta_tooltip" value="">
      </div>
      <div class="" style="margin-left:50px;margin-right:50px;">
        <div class="form-group ">
          <div class="input-group   margin-bottom-sm">
                            <span class="input-group-addon">
                              <i class="fa fa-envelope-o fa-2x fa-fw"></i>
                            </span>
            <input id="awf_field-78882583" type="text" name="email" class="form-control text" v-model="email" placeholder="Enter Your Email Address" tabindex="501">
          </div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="" style="margin-left:50px;margin-right:50px;">
        <div class="buttonContainer">
          <div class="form-group">
            <input ref="newsletterFormBtn" class="btn btn-primary btn-block submit" type="submit" name="submit" value="YES, send it to me now." tabindex="502">
          </div>
          <div class="clear"></div>
        </div>
      </div>

      <div style="display: none;">
        <img src="https://forms.aweber.com/form/displays.htm?id=7MzMDCwcbKyc" alt="" />
      </div>
    </form>
    <!-- End Aweber Form Code -->

    <q-form
      ref="myForm"
      class="flex flex-center"
      @submit="registerEmail"
    >

      <q-input
        v-model="email"
        placeholder="Email address..."
        class="bg-white rounded-borders q-px-md col on-left col-xs-6 col-sm-8 col-md-6 col-lg-5 col-xl-3"
        ref="emailInput"
        borderless
        dense
      />

      <q-btn color="primary" class="col-auto q-py-sm" type="submit">Hook me up!</q-btn>

      <q-separator class="full-width" />

      <q-checkbox
        v-model="acceptTerms"
        :color="termsColor"
        :class="termsClass"
        ref="acceptTerms"
        keep-color
      >
        By submitting your email address you agree to the terms set out in our
        <a
          @click.stop="showTermsAndConditions = !showTermsAndConditions"
          :class="`text-${termsColor}`"
        >
          Privacy Policy
        </a>
      </q-checkbox>
    </q-form>

    <q-dialog
      v-model="showTermsAndConditions"
      transition-show="slide-down"
      content-class="tc__dialog"
    >
      <div class="bg-white z-top q-pa-xs">
        <iframe
          id="tc__frame"
          src="https://www.iubenda.com/privacy-policy/41302963"
          height="500"
          frameborder="0"
        ></iframe>
      </div>
    </q-dialog>
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
      termsClass: ''
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
        const addEmailSubscriber = this.$firebase.functions().httpsCallable('addEmailSubscriber')
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
