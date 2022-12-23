<template>
  <div class="doc-page-footer text-size-12">
    <nav class="doc-page-footer__nav">
      <q-list v-for="entry in links" :key="entry.name">
        <q-item-label
          class="doc-page-footer__title doc-page-footer__margin row items-end text-dark text-weight-bold letter-spacing-225"
        >{{ entry.name }}</q-item-label>

        <q-separator spaced color="brand-primary" class="doc-page-footer__margin" />

        <q-item
          v-for="(item, index) in entry.children"
          :key="index"
          dense
          clickable
          :dark="false"
          :to="item.path"
          :href="item.external ? item.path : void 0"
          :target="item.external ? '_blank' : void 0"
          class="doc-layout__item"
        >
          <q-item-section class="text-dark letter-spacing-100">{{ item.name }}</q-item-section>
        </q-item>
      </q-list>
    </nav>

    <q-separator color="brand-primary" class="landing-mx--large" />

    <div class="row justify-center q-my-md letter-spacing-225">
      <q-btn
        no-caps
        flat
        href="https://github.com/quasarframework/quasar/blob/dev/LICENSE"
        target="_blank"
        class="text-black-54 text-weight-bold"
        label="MIT License"
      />
      <q-btn
        no-caps
        flat
        href="https://www.iubenda.com/privacy-policy/40685560"
        target="_blank"
        class="text-black-54 text-weight-bold"
        label="Privacy Policy"
      />
    </div>

    <q-separator class="full-width" :dark="false" />

    <div class="text-dark text-center q-pa-lg letter-spacing-100">
      <div class="q-mb-sm">Copyright © 2015 - {{ currentYear }} PULSARDEV SRL, Razvan Stoenescu</div>
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

const currentYear = (new Date()).getFullYear()

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
    return {
      links,
      currentYear
    }
  }
}
</script>

<style lang="sass">
.doc-page-footer
  position: relative
  background-color: #d8e1e5
  width: 100%
  z-index: 1
  box-shadow: $shadow--primary

  &__margin
    margin-left: 6px

  &__nav
    display: grid
    grid-row-gap: 100px
    padding: 100px 30px
    grid-template-columns: 1fr

    @media (min-width: 720px)
      padding-left: 100px
      padding-right: 100px
      grid-column-gap: 36px
      grid-template-columns: repeat(2, 1fr)

    @media (min-width: 980px)
      grid-template-columns: repeat(3, 1fr)

    @media (min-width: 1270px)
      grid-template-columns: repeat(4, 1fr)

    @media (min-width: 1540px)
      grid-template-columns: repeat(5, 1fr)

body.body--dark .doc-page-footer
  border-top-color: $brand-primary
</style>
