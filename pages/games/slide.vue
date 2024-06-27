<template>
  <game>
    <template #game>
      <slide :hand="hand" />
    </template>
    <template #roundInfo>
      <round-info class="mt-6" bets="multiBet" />
    </template>
    <template #info>
      <slide-info />
    </template>
  </game>
</template>

<script setup lang="ts">
import game from '~/components/organisms/game.vue'
import roundInfo from '~/components/atoms/games/round-info.vue'
import slideInfo from '~/components/atoms/games/slide/slide-info.vue'
import slide from '~/components/atoms/games/slide/slide.vue'
</script>

<style lang="scss" scoped></style>
