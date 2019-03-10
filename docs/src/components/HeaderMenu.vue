<template lang="pug">
div
  q-btn-dropdown.text-bold(:align="align", flat, no-caps, stretch, :label="`v${$q.version}`", auto-close)
    q-list
      q-item(
        clickable
        tag="a"
        :href="`https://quasar-framework.org/`"
        target="_blank"
      )
        q-item-section v0.17
      q-item(
        v-for="version in ['16', '15', '14', '13']"
        :key="version"
        clickable
        tag="a"
        :href="`https://v0-${version}.quasar-framework.org/`"
        target="_blank"
      )
        q-item-section {{ `v0.${version}` }}

  q-btn-dropdown.text-bold(:align="align", flat, no-caps, stretch, label="Links", auto-close)
    q-list
      q-item(clickable, tag="a", href="https://github.com/quasarframework/quasar-awesome", target="_blank")
        q-item-section.text-yellow-9(avatar)
          q-icon(name="flare")
        q-item-section Awesome Quasar

      q-item(clickable, tag="a", href="https://medium.com/quasar-framework", target="_blank")
        q-item-section.text-primary(avatar)
          q-icon(name="fab fa-medium")
        q-item-section Quasar Blog

      q-item(clickable, tag="a", href="https://github.com/quasarframework/quasar", target="_blank")
        q-item-section(avatar)
          q-icon(name="fab fa-github")
        q-item-section Github

      q-item-label(header) Quick Tools

      q-item(clickable, to="/style/theme-builder")
        q-item-section.text-teal(avatar)
          q-icon(name="style")
        q-item-section Theme Builder

      q-item(clickable, tag="a", href="/layout-builder", target="_blank")
        q-item-section.text-primary(avatar)
          q-icon(name="dashboard")
        q-item-section Layout Builder

      q-item-label(header) Playground

      q-item(clickable, tag="a", href="https://codepen.io/rstoenescu/pen/VgQbdx", target="_blank")
        q-item-section.text-brown-5(avatar)
          q-icon(name="fab fa-codepen")
        q-item-section Codepen

      q-item(clickable, tag="a", href="https://jsfiddle.net/rstoenescu/rmaodk0f", target="_blank")
        q-item-section.text-primary(avatar)
          q-icon(name="fab fa-jsfiddle")
        q-item-section jsFiddle

      q-item-label(header) Social

      q-item(clickable, tag="a", href="https://forum.quasar-framework.org/category/1/announcements", target="_blank")
        q-item-section.text-purple(avatar)
          q-icon(name="announcement")
        q-item-section Announcements

      q-item(clickable, tag="a", href="https://twitter.com/quasarframework", target="_blank")
        q-item-section.text-blue(avatar)
          q-icon(name="fab fa-twitter")
        q-item-section Twitter

  q-btn-dropdown.text-bold(:align="align", flat, no-caps, stretch, label="Support", auto-close)
    q-list

      q-item(clickable, tag="a", href="https://discord.gg/5TDhbDg", target="_blank")
        q-item-section.text-primary(avatar)
          q-icon(name="fab fa-discord")
        q-item-section Chat

      q-item(clickable, tag="a", href="https://forum.quasar-framework.org/", target="_blank")
        q-item-section.text-secondary(avatar)
          q-icon(name="fas fa-comments")
        q-item-section Forum

      q-item(clickable, tag="a", href="https://stackoverflow.com/search?q=quasarframework", target="_blank")
        q-item-section.text-red(avatar)
          q-icon(name="fab fa-stack-overflow")
        q-item-section Stack Overflow

      q-separator

      q-item(clickable, tag="a", href="https://www.patreon.com/quasarframework", target="_blank")
        q-item-section.text-red(avatar)
          q-icon(name="fab fa-patreon")
        q-item-section Patreon
</template>

<script>
export default {
  props: {
    align: String
  }
}
</script>
