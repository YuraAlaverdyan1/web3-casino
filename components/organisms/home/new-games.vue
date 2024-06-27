<template>
  <div class="mt-20" :class="!menu ? 'opened-menu' : ''">
    <div class="flex justify-between">
      <div class="lottery-title">
        New Games
      </div>
      <LotteryArrows
        :all="true"
        @prev="active > 0 ? active-- : ''"
        @next="active < newGames.length - 1 ? active++ : ''"
      />
    </div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="itemsToShow"
      :repeat="true"
      :has-drag="true"
      class="mt-10"
    >
      <o-carousel-item v-for="(item, index) of newGames" :key="index">
        <LotterySpecialLotteryItem
          v-if="isLarge"
          :image="item.image"
          :title="item.title"
          :subtitle="item.subtitle"
          :amount="item.amount"
          :date="item.date"
          :end-in="item.endIn"
          :type="item.type"
          :token-symbol="item.token"
          :home="true"
        />
        <SmallNewGame
          v-else
          :image="item.image"
          :name="item.title"
          :game="item.type"
          :token="item.token"
          :percent="item.percent"
        />
      </o-carousel-item>
    </o-carousel>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import newGames from '~/data/new-games.json'
import { useMenu } from '~/composables/useMenu'

import { BreakPoint } from '~/model/break-points'
export default {

  setup() {
    const active = ref(0)
    const { menu } = useMenu()

    const breakpoints = useBreakpoints(BreakPoint)
    const itemsToShow = computed(() => {
      if (breakpoints.smallerOrEqual('sm').value) {
        return 4
      }
      return 3
    })

    const isLarge = computed(() => breakpoints.greaterOrEqual('sm').value)

    return {
      newGames,
      active,
      menu,
      itemsToShow,
      breakpoints,
      isLarge
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-car__items) {
  gap: 5px !important;
}

@media (max-width: 768px) {
  :deep(.o-car__items) {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-auto-rows: 50% 50%;
  }

  :deep(.o-car__item) {
    width: 100% !important;
  }
}
</style>
