<template>
  <div class="doc-page-footer" v-once>
    <nav class="doc-page-footer__nav">
      <q-list v-for="entry in links" :key="entry.name">
        <q-item-label
          class="doc-page-footer__title doc-page-footer__margin row items-end text-weight-bold letter-spacing-225"
        >{{ entry.name }}</q-item-label>

        <q-separator spaced color="brand-primary" class="doc-page-footer__margin" />

        <q-item
          v-for="(item, index) in entry.children"
          :key="index"
          dense
          clickable
          :to="item.path"
          :href="item.external ? item.path : void 0"
          :target="item.external ? '_blank' : void 0"
          class="doc-layout__item"
        >
          <q-item-section class="letter-spacing-100">{{ item.name }}</q-item-section>
        </q-item>
      </q-list>
    </nav>

    <q-separator class="landing-mx--large" />

    <div class="doc-page-footer__license row justify-center q-my-md letter-spacing-225">
      <q-btn
        no-caps
        flat
        href="https://github.com/quasarframework/quasar/blob/dev/LICENSE"
        target="_blank"
        class="header-btn text-weight-bold"
        label="MIT License"
      />
      <q-btn
        no-caps
        flat
        href="https://www.iubenda.com/privacy-policy/40685560"
        target="_blank"
        class="header-btn text-weight-bold"
        label="Privacy Policy"
      />
    </div>

    <q-separator class="full-width" />

    <div class="doc-page-footer__copyright text-center q-pa-lg letter-spacing-100">
      <div class="q-mb-xs">
        Copyright © 2015-present - PULSARDEV SRL,
        <a
          href="https://github.com/rstoenescu"
          target="_blank"
          class="text-brand-accent text-weight-bold"
        >Razvan Stoenescu</a>
      </div>
      <div>
        This website has been designed in collaboration with
        <a
          href="https://www.dreamonkey.com/"
          target="_blank"
          class="text-brand-accent text-weight-bold"
        >Dreamonkey Srl</a>
      </div>
    </div>
  </div>
</template>

<script>
import menu from 'assets/menu.json'
import { footerLinks } from 'assets/links.footer.js'

/**
 * Loop through the menus and extract all menu items therein, including children to a flat array of menu items
 * @param menus menu items to extract from
 * @return {*[]} An array of flattened menu items (no more children, they move up to the same level as others)
 */
function getMenu (path) {
  const children = []
  const menuItem = menu.find(item => item.path === path)

  for (const item of menuItem.children) {
    item.children === void 0 && children.push({
      name: item.name,
      path: item.external === true ? item.path : `/${path}/${item.path}`,
      external: item.external
    })
  }

  return children
}

const links = footerLinks.flatMap(nav => ({
  name: nav.name,
  children: [
    ...(nav.children || []),
    ...((nav.extract !== void 0 && getMenu(nav.extract)) || [])
  ]
}))

export default {
  setup () {
    return { links }
  }
}
</script>

<style lang="sass">
.doc-page-footer
  position: relative
  background-color: $void-suit
  width: 100%
  z-index: 1
  box-shadow: $shadow--primary

  &__margin
    margin-left: 6px

  &__nav
    display: grid
    grid-row-gap: 64px
    grid-column-gap: 32px
    padding: 64px 32px
    grid-template-columns: 1fr

    @media (min-width: 720px)
      padding-left: 64px
      padding-right: 64px
      grid-template-columns: repeat(2, 1fr)

    @media (min-width: 830px)
      grid-column-gap: 64px

    @media (min-width: 1070px)
      padding-top: 100px
      padding-bottom: 100px
      grid-row-gap: 64px
      grid-template-columns: repeat(3, 1fr)

    @media (min-width: 1400px)
      grid-template-columns: repeat(4, 1fr)

    @media (min-width: 2060px)
      grid-template-columns: repeat(5, 1fr)

  &__copyright
    font-size: ($font-size - 2px)

body.body--dark
  .doc-page-footer
    background-color: $floating-rock
    border-top-color: $brand-primary
</style>
