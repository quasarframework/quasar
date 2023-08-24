<template>
  <div class="q-pa-md example-break-row">

    <div class="row items-start example-container">
      <div class="example-cell" tabindex="0">Col 1 / Row 1</div>
      <div class="example-cell col-6" tabindex="0">Col 2 / Row 1 - 1<br>Col 2 / Row 1 - 2</div>
      <div class="flex-break"></div>
      <div class="example-cell" tabindex="0">Col 1 / Row 2</div>
      <div class="flex-break q-py-md"></div>
      <div class="example-cell col-4" tabindex="0">Col 1 / Row 3</div>
      <div class="example-cell" tabindex="0">Col 2 / Row 3</div>
      <div class="example-cell" tabindex="0">Col 3 / Row 3</div>
    </div>

  </div>
</template>

<style lang="sass">
.example-break-row
  .flex-break
    flex: 1 0 100% !important
    height: 0 !important

  .example-container
    .example-cell
      margin: 1px
      padding: 4px 8px
      box-shadow: inset 0 0 0 2px #9e9e9e
</style>
