<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="customize"
      node-key="label"
      default-expand-all
    >
      <div slot="header-root" slot-scope="prop" class="row items-center">
        <img src="https://cdn.quasar-framework.org/img/quasar-logo.png" class="avatar q-mr-sm">
        <div>
          {{ prop.node.label }} <q-chip color="orange" small>New!</q-chip>
        </div>
      </div>

      <div slot="header-generic" slot-scope="prop" class="row items-center">
        <q-icon :name="prop.node.icon || 'star'" color="orange" size="28px" class="q-mr-sm" />
        <div class="text-weight-bold text-primary">{{ prop.node.label }}</div>
      </div>

      <div slot="body-story" slot-scope="prop">
        <span class="text-weight-thin">The story is:</span> {{ prop.node.story }}
      </div>

      <div slot="body-toggle" slot-scope="prop">
        <p class="text-caption">{{ prop.node.caption }}</p>
        <q-toggle v-model="prop.node.enabled" label="I agree to the terms and conditions" />
      </div>
    </q-tree>
  </div>
</template>

<script>
export default {
  data: () => ({
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
  })
}
</script>
