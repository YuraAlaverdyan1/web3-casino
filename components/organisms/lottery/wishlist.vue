<template>
  <div class="mt-20">
    <div class="flex justify-between">
      <div class="flex gap-4 items-center">
        <div class="lottery-title">
          Wishlist Lotteries
        </div>
        <div v-if="isLarge" class="default-text">
          Win physical goods on blockchain through NFT redeemables.
        </div>
      </div>
      <LotteryArrows :all="isLarge" @next="next" @prev="prev" />
    </div>
    <div class="mt-4">
      <LotteryWishlistItems :items-to-show="itemsToShow" :data="wishListData" :active="active" @set-active="(e) => active = e" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import wishListData from '~/data/wishlist-items.json'
import { BreakPoint } from '~/model/break-points'

export default {
    setup() {
      const active = ref(0)

    const breakpoints = useBreakpoints(BreakPoint)

      const isLarge = computed(() => breakpoints.greaterOrEqual('sm').value)

      const itemsToShow = computed(() => {
        if (breakpoints.sm.value || breakpoints.lg.value || breakpoints.md.value) {
          return 4
        } else if (breakpoints.sm.value) {
          return 2
        }
        return 1
      })

      const next = () => {
        if (active.value < wishListData.length - 1) {
          active.value++
        }
      }
      const prev = () => {
        if (active.value > 0) {
          active.value--
        }
      }
        return {
            wishListData,
            active,
            itemsToShow,
            next,
            prev,
            breakpoints,
            isLarge
        }
    }
}
</script>

<style lang="scss" scoped>
  :deep(.o-car) {
    height: 360px;
  }
</style>
