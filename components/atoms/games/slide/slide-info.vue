<template>
  <div class="slide-info-container">
    <slide-data-info />
  </div>
</template>

<script setup>
import slideDataInfo from '~/components/atoms/games/slide/slide-data-info.vue'
</script>

<style lang="scss" scoped>
.slide-info-container {
    @apply flex flex-col gap-8;
}

</style>
