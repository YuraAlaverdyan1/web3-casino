<template>
  <game :title-image="'/games/mine/title-image.png'">
    <template #roundInfo>
      <round-info ininal-message="Mine game inital text" bets="multiBet" />
    </template>
    <template #game>
      <GamesMine />
    </template>
    <template #info>
      <mine-info />
    </template>
  </game>
</template>

<script setup lang="ts">
import game from '~/components/organisms/game.vue'
import roundInfo from '~/components/atoms/games/round-info.vue'
import mineInfo from '~/components/atoms/games/mine/mine-info.vue'
</script>
