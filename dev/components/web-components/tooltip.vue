<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">
          Move mouse over the elements below. On a mobile device,
          you need to tap the elements.
        </span>
        <span class="mobile-only">
          Tap on elements below. On desktop you can move the mouse
          over the elements.
        </span>
      </p>

      <div v-tooltip="'Quasar Rulz!'" style="margin-top: 40px;width: 200px; height: 70px;background-color: #26A69A;">
        &nbsp;
      </div>
      <br><br>
      <div class="group">
        <div v-tooltip.inline="'Tooltip'">
          <button class="indigo">Hover</button>
        </div>
        <div v-tooltip.inline="'Tooltip for the user'">
          <button class="red">Over</button>
        </div>
        <div v-tooltip.inline="'Lorem Ipsum... Some long tooltip...'">
          <button class="purple">These</button>
        </div>
        <div v-tooltip.inline="'Lorem Ipsum...'">
          <button class="amber">Buttons</button>
        </div>
      </div>
    </div>
  </div>
</template>
