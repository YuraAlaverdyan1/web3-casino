<template>
  <game>
    <template #game>
      <GamesToTheMoonGame />
    </template>
    <template #roundInfo>
      <round-info class="mt-6" bets="multiBet" />
    </template>
    <template #selectorInfo>
      <GamesToTheMoonInfo />
    </template>
    <template #selectorValue>
      <GamesToTheMoonSelector />
    </template>
    <template #mission>
      <GamesToTheMoonMission />
    </template>
  </game>
</template>

<script setup lang="ts">
import roundInfo from '~/components/atoms/games/round-info.vue'
</script>

<style lang="scss" scoped>

</style>
