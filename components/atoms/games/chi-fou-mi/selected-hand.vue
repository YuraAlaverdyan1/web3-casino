<template>
  <div class="hand-container">
    <img src="/games/chi-fou-mi/card.png" class="card">
    <img :src="`/games/chi-fou-mi/${hand}.png`" class="hand">
  </div>
</template>

<script setup>
defineProps({
  hand: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.hand-container {
  @apply relative flex items-center justify-center h-full;
}
.hand {
  height: 45%;
  @apply absolute top-0 left-0 right-0 bottom-0 m-auto;
}

.card {
  height: 55%;
}

@media (max-width: 768px) {
  .card {
    height: 60%;
  }
  .hand {
    height: 50%;
  }
}
</style>
