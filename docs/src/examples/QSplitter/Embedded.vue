<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      style="height: 400px"
    >

      <div slot="before" class="q-pa-md">
        <div class="text-h4 q-mb-md">Before</div>
        <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
      </div>

      <q-splitter
        slot="after"
        v-model="insideModel"
        horizontal
      >

        <div slot="before" class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
        </div>

        <div slot="after" class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
        </div>

      </q-splitter>

    </q-splitter>
  </div>
</template>

<script>
export default {
  data () {
    return {
      splitterModel: 50, // start at 50%
      insideModel: 50
    }
  }
}
</script>
