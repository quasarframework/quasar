<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Notify the user something is going on under the covers.
        There is also the <em>progress</em> Dialog type you can use.
      </p>
      <div class="group">
        <button class="light push" @click="noMessage()">
          Show
        </button>
        <button class="primary push" @click="withMessage()">
          Show With Message
        </button>
      </div>
      <p class="caption">
        You can use a custom spinner.
      </p>
      <button class="light push" @click="customSpinner()">
        Custom Spinner
      </button>
      <p class="caption">
        ...with a custom color and spinner size.
      </p>
      <button class="light push" @click="customColorSpinner()">
        Custom Color and Size Spinner
      </button>
    </div>
  </div>
</template>

<script>
import { Loading } from 'quasar'

function show (options) {
  Loading.show(options)

  setTimeout(() => {
    Loading.hide()
  }, 3000)
}

export default {
  methods: {
    noMessage () {
      show()
    },
    customSpinner () {
      show({spinner: 'facebook'})
    },
    customColorSpinner () {
      show({
        spinner: 'pie',
        spinnerColor: '#027be3',
        spinnerSize: 220,
        message: 'Some important process is in progress. Hang on...',
        messageColor: '#ef0'
      })
    },
    withMessage () {
      show({message: 'Some important process is in progress. Hang on...'})
    }
  }
}
</script>
