<template>
  <div>
    <div
      class="flex items-center sm:justify-between justify-center sm:gap-1 gap-3 sm:flex-nowrap flex-wrap"
    >
      <card
        v-for="(item, index) in hand"
        :key="index"
        :card="item"
        class="card"
        :selected="selectedHand[index]"
        :index="index"
      />
    </div>
  </div>
</template>

<script setup>
import card from '~/components/atoms/games/video-poker/poker-card.vue'
import { useVideoPoker } from '~/composables/games/useVideoPoker'

const { hand, selectedHand } = useVideoPoker()
</script>

<style lang="scss" scoped></style>
