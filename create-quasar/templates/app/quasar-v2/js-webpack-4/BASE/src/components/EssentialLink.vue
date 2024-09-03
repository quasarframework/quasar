<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="<% if (sfcStyle === 'composition-setup') { %>props.<% } %>link"
  >
    <q-item-section
      v-if="<% if (sfcStyle === 'composition-setup') { %>props.<% } %>icon"
      avatar
    >
      <q-icon :name="<% if (sfcStyle === 'composition-setup') { %>props.<% } %>icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ <% if (sfcStyle === 'composition-setup') { %>props.<% } %>title }}</q-item-label>
      <q-item-label caption>{{ <% if (sfcStyle === 'composition-setup') { %>props.<% } %>caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
<% if (sfcStyle === 'composition-setup') { %>
<script setup>
defineOptions({
  name: 'EssentialLink'
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  }
})
</script><% } else if (sfcStyle === 'composition' || sfcStyle === 'options') { %>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
})
</script><% } %>
