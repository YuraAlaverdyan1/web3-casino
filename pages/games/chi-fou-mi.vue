<template>
  <game class="chi-fou-mi-container" :title-image="'/games/chi-fou-mi/title-image.png'">
    <template #game>
      <chi-fou-mi-game :is-started="isPlaying" />
    </template>
    <template #info>
      <chi-fou-mi-details :select-hand="selectHand" />
    </template>
    <template #roundInfo>
      <round-info
        ininal-message="Every move counts in Chi-Fou-Mi – make yours lucky!"
        type="Shoots"
        class="chi-fou-mi-info my-6"
        bets="multiBet"
      />
    </template>
  </game>
</template>

<script setup>
import chiFouMiGame from '~/components/atoms/games/chi-fou-mi/chi-fou-mi.vue'
import chiFouMiDetails from '~/components/atoms/games/chi-fou-mi/chi-fou-mi-details.vue'
import game from '~/components/organisms/game.vue'
import { useMiniGames } from '~/composables/useMiniGames'
import roundInfo from '~/components/atoms/games/round-info.vue'

const { isPlaying } = useMiniGames()

defineExpose({
  isPlaying
})
</script>

<style lang="scss" scoped>
.chi-fou-mi-container {
  @screen sm {
    min-height: 600px;
  }
  min-height: 350px;
  position: relative;
}

.chi-fou-mi-info {
  width: 93% !important;
  position: absolute !important;
  z-index: 10;
  @apply bottom-3 left-0 right-0 m-auto;
}
</style>
