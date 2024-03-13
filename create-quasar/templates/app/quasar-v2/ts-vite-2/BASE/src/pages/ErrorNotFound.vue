<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<% if (typescriptConfig === 'composition-setup') { %><script setup lang="ts">
<% } else if (typescriptConfig === 'composition') { %><script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorNotFound'
});<% } else if (typescriptConfig === 'options') { %><script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorNotFound'
});<% } else if (typescriptConfig === 'class') { %><script lang="ts">
import { Vue } from 'vue-class-component';

export default class ErrorNotFound extends Vue {}<% } %>
</script>
