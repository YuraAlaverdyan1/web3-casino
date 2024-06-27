<template>
  <game class="plinko-game">
    <template #game>
      <plinko-game />
    </template>
    <template #info>
      <plinko-info />
    </template>
  </game>
</template>

<script setup>
import game from '~/components/organisms/game.vue'
import plinkoGame from '~/components/atoms/games/plinko/plinko-game.vue'
import plinkoInfo from '~/components/atoms/games/plinko/plinko-info.vue'
</script>
