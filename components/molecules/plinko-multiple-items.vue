<template>
  <div class="multiple-items">
    <multiple-item v-for="(item, index) of plinkoMultipleItems" :key="index" :color="item.color" :multiple="item.multiple" />
    <multiple-item color="#FFBA08" multiple="0.2" />
    <multiple-item v-for="(item, index) of reversedItems" :key="index" :color="item.color" :multiple="item.multiple" />
  </div>
</template>

<script setup>
import multipleItem from '~/components/atoms/games/plinko/multiple-item.vue'
import plinkoMultipleItems from '~/data/plinko-win-items.json'
const reversedItems = plinkoMultipleItems.reverse()
</script>

<style lang="scss" scoped>
.multiple-items {
    @apply flex items-center justify-between gap-2;
}
</style>
