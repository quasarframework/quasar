<template>
  <div class="no-ssr-page q-layout-padding">
    <div class="q-title">
      1. Basic
    </div>
    <q-no-ssr>
      <div>This won't be rendered on server</div>
    </q-no-ssr>

    <div class="q-title">
      2. Multiple client nodes
    </div>
    <q-no-ssr>
      <div>This won't be rendered on server.</div>
      <div>This won't either.</div>
    </q-no-ssr>

    <div class="q-title">
      3. Multiple client nodes with tag prop
    </div>
    <q-no-ssr tag="blockquote">
      <div>This won't be rendered on server.</div>
      <div>This won't either.</div>
    </q-no-ssr>

    <div class="q-title">
      4. Placeholder prop
    </div>
    <q-no-ssr placeholder="Rendered on server">
      <div>This won't be rendered on server</div>
    </q-no-ssr>

    <div class="q-title">
      5. Placeholder slot
    </div>
    <q-no-ssr>
      <div>This won't be rendered on server</div>

      <template v-slot:placeholder>
        <div>
          Rendered on server
        </div>
      </template>
    </q-no-ssr>

    <div class="q-title">
      6. Multiple placeholder slot
    </div>
    <q-no-ssr>
      <div>This won't be rendered on server</div>

      <template v-slot:placeholder>
        <div>
          Rendered on server (1/2)
        </div>
        <div>
          Rendered on server (2/2)
        </div>
      </template>
    </q-no-ssr>

    <div class="q-title">
      7. Only placeholder slot
    </div>
    <q-no-ssr>
      <template v-slot:placeholder>
        <div>
          Rendered on server
        </div>
      </template>
    </q-no-ssr>
  </div>
</template>

<style lang="sass">
.no-ssr-page
  .q-title
    margin-top: 42px
</style>
