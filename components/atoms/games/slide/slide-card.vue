<template>
  <div class="card" :style="`background: url(/games/video-poker/cards/${card}.png)`" />
</template>

  <script setup lang="ts">
  const { card } = defineProps({
    card: {
      type: String,
      required: true
    }
  })
  </script>

  <style lang="scss" scoped>

  .card {
    cursor: pointer;
    transition: .3s;
    background-size: 100% 100% !important;
    background-repeat: no-repeat !important;
    width: 100%;
    height: 100%;
  }
  </style>
