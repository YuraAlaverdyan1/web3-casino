<template>
  <div class="mt-14">
    <div class="flex justify-between items-center">
      <div class="lottery-title">
        Hot Games
      </div>
      <div>
        <LotteryArrows
          :all="true"
          @prev="active > 0 ? active-- : active"
          @next="active < hotGames.length - 1 ? active++ : active"
        />
      </div>
    </div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="itemsToShow"
      :repeat="true"
      :has-drag="true"
      class="mt-4"
    >
      <o-carousel-item v-for="(item, index) of hotGames" :key="index">
        <WishlistItem
          :first-item="active === index"
          :image="item.image"
          :title="item.title"
          :subtitle="item.subtitle"
          :completed="item.completed"
          :limit="item.limit"
          :finished="item.finished"
          :token="item.token"
          :end-in="item.endIn"
          :jackpot="item.jackpot"
          :collected="item.collected"
          class="item"
        />
      </o-carousel-item>
    </o-carousel>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import hotGames from '~/data/hot-games.json'
import { BreakPoint } from '~/model/break-points'

export default {
  setup() {
    const active = ref(0)
    const breakpoints = useBreakpoints(BreakPoint)

    const itemsToShow = computed(() => (breakpoints.lg.value ? 4 : 2))

    return {
      hotGames,
      active,
      breakpoints,
      itemsToShow
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-car__items) {
  gap: 0 !important;
}

.item {
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.02),
      rgba(255, 255, 255, 0.02)
    ),
    #1c1b1f;
  border-radius: 15px;
  width: 96%;

  @screen lg {
    height: 430px;
  }

  height: 400px;
}
</style>
