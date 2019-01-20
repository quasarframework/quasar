<template>
  <div class="q-layout-padding">
    <q-btn label="Set Cookie A" no-caps @click="add('a')" color="primary" class="q-ma-sm" />
    <q-btn label="DEL Cookie A" no-caps @click="del('a')" color="primary" class="q-ma-sm" />
    <q-btn label="Set Cookie B" no-caps @click="add('b')" color="secondary" class="q-ma-sm" />
    <q-btn label="DEL Cookie B" no-caps @click="del('b')" color="secondary" class="q-ma-sm" />
    <br>
    <q-btn label="Refresh" no-caps @click="refresh" color="tertiary" class="q-ma-sm" />
    <q-btn label="DEL ssr_cookie" no-caps @click="del('ssr_cookie')" color="tertiary" class="q-ma-sm" />
    <br><br>
    <table class="q-table striped" style="width: 400px">
      <thead>
        <tr>
          <th class="text-left">Cookie Name</th>
          <th class="text-left">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(value, name) in cookies" :key="name">
          <td>{{ name }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cookies: this.$q.cookies.getAll()
    }
  },
  methods: {
    refresh () {
      this.cookies = this.$q.cookies.getAll()
    },
    add (name) {
      this.$q.cookies.set(name, 'val')
      this.refresh()
    },
    del (name) {
      this.$q.cookies.remove(name)
      this.refresh()
    }
  },
  created () {
    if (this.$isServer) {
      console.log('setting ssr_cookie')
      this.$q.cookies.set('ssr_cookie', 'yes')
      this.$q.cookies.set('ssr_cookie-second', 'yes')
    }
  }
}
</script>
