<template>
  <div class="buttons">
    <div v-for="(button, index) of slideData.buttons" :key="index" :fill="true" :class="`multiple-button m-${button}x`">
      {{ button }}X
    </div>
  </div>
</template>

<script setup>
import slideData from '~/data/slide-info.json'
</script>

<style lang="scss" scoped>
.multiple-button {
    border-radius: 6px;
    height: 50px;
    @apply font-semibold text-xl w-full flex items-center justify-center;
  }

  .buttons {
    gap: 3%;
    @apply flex items-center;
  }
</style>
