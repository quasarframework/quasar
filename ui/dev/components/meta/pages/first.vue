<template>
  <q-page padding>
    <h5 class="text-primary">
      Page first
    </h5>
    <h3>Layout 1</h3>
    <q-btn-group>
      <q-btn color="primary" to="/meta/layout_1/first" label="first" />
      <q-btn color="secondary" to="/meta/layout_1/second" label="second" />
      <q-btn color="accent" to="/meta/layout_1/third" label="third" />
    </q-btn-group>
    <h3>Layout 2</h3>
    <q-btn-group>
      <q-btn color="primary" to="/meta/layout_2/first" label="first" />
      <q-btn color="secondary" to="/meta/layout_2/second" label="second" />
      <q-btn color="accent" to="/meta/layout_2/third" label="third" />
    </q-btn-group>

    <pre>{{ __qMeta }}</pre>

    <br><br>
    <div>gigi: {{ as }}</div>
    {{ $q.lang.label.clear }}
    <q-btn color="primary" @click="showNotif" label="Notif" />
    <q-btn color="secondary" @click="toggleTitle" label="Toggle Title" />
  </q-page>
</template>

<style>
</style>

<script>
function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  name: 'PageIndex',
  meta () {
    return {
      title: this.title,
      meta: {
        description: { name: 'description', content: 'Page 1' }
      },
      link: {
        google: { rel: 'stylesheet', href: 'http://bogus.com/1' }
      },
      noscript: {
        default: `This is for non-JS`
      }
    }
  },
  data () {
    return {
      title: 'Page 1',
      as: {
        client: true
      }
    }
  },
  async preFetch () {
    console.log('called prefetch')
    await timeout(1000)
  },
  methods: {
    showNotif () {
      console.log('yess')
      this.$q.dialog({
        title: 'Prompt',
        message: 'Modern HTML5 Single Page Application front-end framework on steroids.',
        cancel: true,
        // preventClose: true,
        color: 'secondary'
      }).then(data => {
        console.log('>>>> OK, received:', data)
      }).catch(error => {
        console.log('>>>> Cancel', String(error))
      })
    },
    toggleTitle () {
      this.title = this.title === 'Page 1'
        ? 'Page 1 Extended'
        : 'Page 1'
    }
  }
}
</script>
