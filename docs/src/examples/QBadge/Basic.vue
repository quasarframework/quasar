<template>
  <div class="q-pa-md q-gutter-md">
    <q-badge color="blue">
      #4D96F2
    </q-badge>

    <q-badge color="orange" text-color="black" label="2" />

    <q-badge color="purple">
      <q-icon name="bluetooth" color="white" />
    </q-badge>

    <q-badge color="red">
      12 <q-icon name="warning" color="white" class="q-ml-xs" />
    </q-badge>

    <div class="text-h6">
      Badge <q-badge color="primary">v1.0.0+</q-badge>
    </div>

    <div>
      Feature <q-badge color="primary">v1.0.0+</q-badge>
    </div>

    <q-item
      clickable
      v-ripple
      class="rounded-borders"
      :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2'"
    >
      <q-item-section avatar>
        <q-avatar rounded>
          <img src="https://cdn.quasar.dev/img/chaosmonkey.png">
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          Ganglia
        </q-item-label>
        <q-item-label caption>
          <q-badge color="yellow-6" text-color="black">
            3
            <q-icon
              name="warning"
              size="14px"
              class="q-ml-xs"
            />
          </q-badge>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <span>2 min ago</span>
      </q-item-section>
    </q-item>
  </div>
</template>
