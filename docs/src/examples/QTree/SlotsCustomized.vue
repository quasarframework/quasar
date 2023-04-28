<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="customize"
      node-key="label"
      default-expand-all
    >
      <template v-slot:header-root="prop">
        <div class="row items-center">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" class="q-mr-sm" style="width:50px;height:50px">
          <div>
            {{ prop.node.label }}
            <q-badge color="orange" class="q-ml-sm">New!</q-badge>
          </div>
        </div>
      </template>

      <template v-slot:header-generic="prop">
        <div class="row items-center">
          <q-icon :name="prop.node.icon || 'star'" color="orange" size="28px" class="q-mr-sm" />
          <div class="text-weight-bold text-primary">{{ prop.node.label }}</div>
        </div>
      </template>

      <template v-slot:body-story="prop">
        <span class="text-weight-thin">The story is:</span> {{ prop.node.story }}
      </template>

      <template v-slot:body-toggle="prop">
        <p class="text-caption">{{ prop.node.caption }}</p>
        <q-toggle v-model="prop.node.enabled" label="I agree to the terms and conditions" />
      </template>
    </q-tree>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      customize: ref([
        {
          label: 'Satisfied customers',
          header: 'root',
          children: [
            {
              label: 'Good food',
              icon: 'restaurant_menu',
              header: 'generic',
              children: [
                {
                  label: 'Quality ingredients',
                  header: 'generic',
                  body: 'story',
                  story: 'Lorem ipsum dolor sit amet.'
                },
                {
                  label: 'Good recipe',
                  body: 'story',
                  story: 'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.'
                }
              ]
            },
            {
              label: 'Good service',
              header: 'generic',
              body: 'toggle',
              caption: 'Why are we as consumers so captivated by stories of great customer service? Perhaps it is because...',
              enabled: false,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings',
              children: [
                { label: 'Happy atmosphere' },
                { label: 'Good table presentation', header: 'generic' },
                { label: 'Pleasing decor' }
              ]
            }
          ]
        }
      ])
    }
  }
}
</script>
