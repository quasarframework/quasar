<template>
<div class="row items-stretch q-col-gutter-lg">
  <div class="col-12 col-sm-6 row items-stretch" v-for="(t, index) in translations" :key="index">
    <ul>
      <li>
        <a class="doc-link" :href="t.address" target="_blank" >{{ t.language }}</a>
        <span v-if="t.author"  class="q-mx-sm">
          @
          <a class="doc-link" :href="t.author.address" target="_blank">
            {{ t.author.name }}
          </a>
        </span>
        <span>
          [
          <a class="doc-link" v-if="t.source" :href="t.source" target="_blank" >source</a>
          ]
        </span>
      </li>
    </ul>
  </div>
</div>
</template>

<script setup>
import translations from 'assets/translations.js'

</script>
