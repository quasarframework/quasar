<template>
  <quasar-dropdown>
    <button slot="target" class="primary">
      <i>more_vert</i>
    </button>

    <div class="list item-delimiter highlight">
      <div class="item item-link" v-for="n in 20">
        <div class="item-content">
          <div class="item-label">Label</div>
          <div class="item-value">Value</div>
        </div>
      </div>
    </div>
  </quasar-dropdown>

  <quasar-dropdown>
    <button slot="target" class="primary">
      <i>mail</i>
    </button>

    <div class="list item-delimiter highlight">
      <div class="item item-link" v-for="n in 3">
        <div class="item-content">
          <div class="item-label">Label</div>
          <div class="item-value">Value</div>
        </div>
      </div>
    </div>
  </quasar-dropdown>

  <p class="caption">
    Context menu also available. Right click on this page to see it.
  </p>

  <quasar-context-dropdown>
    <div class="list item-delimiter highlight">
      <div class="item item-link" v-for="n in 30">
        <div class="item-content">
          <div class="item-label">Label</div>
          <div class="item-value">Value</div>
        </div>
      </div>
    </div>
  </quasar-context-dropdown>

  <div style="height: 200px; width: 200px; background-color: teal;">
    <quasar-context-dropdown>
      <div class="list item-delimiter highlight">
        <div class="item item-link" v-for="n in 3">
          <div class="item-content">
            <div class="item-label">Label</div>
            <div class="item-value">Value</div>
          </div>
        </div>
      </div>
    </quasar-context-dropdown>
  </div>
</template>

<script></script>
