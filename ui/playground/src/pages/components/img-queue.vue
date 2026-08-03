<template>
  <div class="q-layout-padding">
    <q-btn color="primary" label="Refresh" @click="refresh" class="q-my-lg" />

    <div class="row items-start">
      <q-img
        v-for="image in images"
        :key="image.id"
        :src="image.src"
        :ratio="4 / 3"
        class="col-6 col-sm-4 col-md-3"
      >
        <template v-slot:error>
          <div class="absolute-bottom text-body1 text-center text-negative">
            {{ image.bogus ? 'Bogus image' : 'Error on loading' }}
          </div>
        </template>
      </q-img>
    </div>
  </div>
</template>

<script>
const imageUrls = Array.from(
  { length: 12 },
  (_, i) => `https://picsum.photos/seed/quasar-${i}/400/300`
)

const generateImageList = () => {
  const length = imageUrls.length,
    list = []

  for (let i = length; i >= 0; i--) {
    list.push({
      id: i + Math.random(),
      bogus: i === length,
      src: i === length ? 'https://bogu.bogus' : imageUrls[i]
    })
  }

  return list
}

export default {
  data() {
    return {
      images: generateImageList()
    }
  },

  methods: {
    refresh() {
      this.images = generateImageList()
    }
  }
}
</script>
