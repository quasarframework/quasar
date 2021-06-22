<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="customize"
      node-key="label"
      default-expand-all
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <q-icon :name="prop.node.icon || 'share'" color="orange" size="28px" class="q-mr-sm" />
          <div class="text-weight-bold text-primary">{{ prop.node.label }}</div>
        </div>
      </template>

      <template v-slot:default-body="prop">
        <div v-if="prop.node.story">
          <span class="text-weight-bold">This node has a story</span>: {{ prop.node.story }}
        </div>
        <span v-else class="text-weight-light text-black">This is some default content.</span>
      </template>
    </q-tree>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      customize: [
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
      ]
    }
  }
}
</script>
