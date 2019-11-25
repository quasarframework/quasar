<template lang="pug">
q-layout(container view="lHh Lpr lff")
  q-drawer(
    show-if-above
    :breakpoint="400"
    bordered
  )
    q-scroll-area(style="height: calc(100% - 150px); margin-top: 150px")
      q-list(padding)
        q-item(clickable v-ripple)
          q-item-section(avatar)
            q-icon(name="inbox")
          q-item-section Inbox
        q-item(clickable v-ripple)
          q-item-section(avatar)
            q-icon(name="send")
          q-item-section Send
    q-img.absolute-top(src="https://cdn.quasar.dev/img/material.png" style="height: 150px")
      .absolute-bottom.bg-transparent
        q-avatar.q-mb-sm(size="56px")
          img(src="https://cdn.quasar.dev/img/boy-avatar.png")
        .text-weight-bold Quasar Framework
        div @quasarframework
</template>
