<template>
  <h4>Vue Template Transform Asset URLs</h4>

  <div>
    <NativeImage />
    <ImgWithSrc />
    <ImgWithPlaceholderSrc />
    <ChatMessageWithAvatar />

    <!-- The list is not exhaustive and doesn't need to be -->
  </div>
</template>

<script setup>
import NativeImage from './asset-transform/NativeImage.vue'
import ImgWithSrc from './asset-transform/ImgWithSrc.vue'
import ImgWithPlaceholderSrc from './asset-transform/ImgWithPlaceholderSrc.vue'
import ChatMessageWithAvatar from './asset-transform/ChatMessageWithAvatar.vue'
</script>
