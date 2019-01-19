<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor v-model="editor" />
    <q-card>
      <q-card-section>
        {{ editor }}
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section v-html="editor" />
    </q-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      editor: 'What you see is <b>what</b> you get.'
    }
  }
}
</script>
