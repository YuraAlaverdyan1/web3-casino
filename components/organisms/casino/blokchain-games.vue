<template>
  <div class="mt-20">
    <div class="lottery-title">
      Blockchain Games
    </div>
    <div class="flex items-center justify-between my-4">
      <div class="flex gap-2">
        <SelectBtn :text="'RTP'" />
        <SelectBtn :text="'Biggest Win'" />
        <SelectBtn :text="'Name'" />
        <SelectBtn :text="'New'" />
        <SelectBtn :text="'Popular'" />
        <SelectBtn :text="'Type'" />
      </div>
      <LotteryArrows />
    </div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="12"
      :repeat="false"
      :has-drag="true"
    >
      <o-carousel-item v-for="(item, index) of data" :key="index">
        <img :src="item.image" class="w-full">
      </o-carousel-item>
    </o-carousel>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import blockchainGames from '~/data/blokchain-games.json'
export default {
    setup() {
        const active = ref(0)
        return {
            data: blockchainGames,
            active
        }
    }
}
</script>

<style lang="scss" scoped>
:deep(.o-car__items) {
    display: grid;
    grid-template-columns: 14% 14% 14% 14% 14% 14%;
    grid-auto-rows: 51% 51%;
    justify-content: space-between;
}
:deep(.o-car__item) {
    width: 100% !important;
}
</style>
