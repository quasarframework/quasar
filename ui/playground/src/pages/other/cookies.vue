<template>
  <div class="q-layout-padding">
    <q-btn
      label="Set Cookie awesome1"
      no-caps
      @click="add('awesome1')"
      color="primary"
      class="q-ma-sm"
    />
    <q-btn
      label="DEL Cookie awesome1"
      no-caps
      @click="del('awesome1')"
      color="primary"
      class="q-ma-sm"
    />
    <q-btn
      label="Set Cookie cool2"
      no-caps
      @click="add('cool2')"
      color="secondary"
      class="q-ma-sm"
    />
    <q-btn
      label="DEL Cookie cool2"
      no-caps
      @click="del('cool2')"
      color="secondary"
      class="q-ma-sm"
    />
    <br />
    <q-btn
      label="Refresh"
      no-caps
      @click="refresh"
      color="accent"
      class="q-ma-sm"
    />
    <q-btn
      label="DEL ssr_cookie"
      no-caps
      @click="del('ssr_cookie')"
      color="accent"
      class="q-ma-sm"
    />
    <br /><br />
    <q-markup-table flat bordered>
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
    </q-markup-table>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const cookies = ref($q.cookies.getAll())

function refresh() {
  cookies.value = $q.cookies.getAll()
}
function add(name) {
  $q.cookies.set(name, 'val')
  refresh()
}
function del(name) {
  $q.cookies.remove(name)
  refresh()
}

if (import.meta.env.QUASAR_SERVER) {
  console.log('setting ssr_cookie')
  $q.cookies.set('ssr_cookie', 'yes')
  $q.cookies.set('ssr_cookie-second', 'yes')
}
</script>
