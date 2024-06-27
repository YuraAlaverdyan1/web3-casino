<template>
  <div class="wheel-info-container">
    <wheel-data-buttons />
  </div>
</template>

<script setup>
import wheelDataButtons from '~/components/atoms/games/wheel/wheel-data-buttons.vue'
</script>

<style lang="scss" scoped>
.wheel-info-container {
    @apply flex flex-col gap-8;
}

</style>
