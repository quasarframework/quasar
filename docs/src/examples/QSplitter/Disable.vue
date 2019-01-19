<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <div class="q-layout-padding q-mx-auto" style="height: 600px; width: 80%;">
        <q-splitter
          v-model="splitterModel"
          class="q-mt-md"
          style="height: 550px; border: 1px solid black"
          disable
        >

          <div slot="before" class="q-layout-padding">
            <div class="text-h4 q-mb-md">Before</div>
            <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
          </div>

          <div slot="after" class="q-layout-padding">
            <div class="text-h4 q-mb-md">After</div>
            <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
          </div>

        </q-splitter>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      splitterModel: 50 // start at 50%
    }
  }
}
</script>
