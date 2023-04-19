<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-btn color="indigo">
        Hover
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>top</em>
          (<q-icon name="keyboard_arrow_up"/>)
        </q-tooltip>
      </q-btn>

      <q-btn color="red">
        Over
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>right</em>
          (<q-icon name="keyboard_arrow_right"/>)
        </q-tooltip>
      </q-btn>

      <q-btn color="purple">
        These
        <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>left</em>
          (<q-icon name="keyboard_arrow_left"/>)
        </q-tooltip>
      </q-btn>

      <q-btn color="amber">
        Buttons
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>bottom</em>
          (<q-icon name="keyboard_arrow_down"/>)
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
