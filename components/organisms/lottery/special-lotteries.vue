<template>
  <div>
    <div class="nav flex justify-between mt-20">
      <div class="text-white text-2xl font-medium">
        Countdown Lotteries
      </div>
      <div class="flex items-center gap-2">
        <div
          class="border-[1px] border-[#424245] rounded-[8px] w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
          @click="showAll = !showAll"
        >
          <p>All</p>
        </div>
        <LotteryArrows
          :active="active"
          :items="specialLotteries.length - itemsToShow - 1"
          :disable-buttons="showAll"
          @next="next"
          @prev="prev"
        />
      </div>
    </div>
    <div class="lotteries flex gap-7 mt-4">
      <o-carousel
        v-if="!showAll"
        v-model="active"
        :arrow="false"
        :indicator="false"
        :items-to-show="itemsToShow"
        :repeat="false"
        :has-drag="true"
        class="mt-[20px]"
      >
        <o-carousel-item v-for="(item, index) of specialLotteries" :key="index">
          <LotterySpecialLotteryItem
            :amount="item.amount"
            :date="item.date"
            :end-in="item.endIn"
            :image="item.image"
            :btn-color="item.btnColor"
            :token-symbol="item.tokenSymbol"
            :bg-color="item.bgColor"
            :title="item.title"
            :type="'lottery'"
            @on-reward="rewardsModal.active = true"
            @on-my-tickets="myTicketsModal = { active: true, round: '1' }"
          />
        </o-carousel-item>
      </o-carousel>
      <div
        v-else
        :style="`grid-template-columns: repeat(${itemsToShow}, minmax(0, 1fr));`"
        class="w-full grid lg:grid-cols-4 mt-[22px] gap-x-[4px] gap-y-[10px]  px-[2px]"
      >
        <div v-for="(item, index) of specialLotteries" :key="index">
          <LotterySpecialLotteryItem
            :amount="item.amount"
            :date="item.date"
            :end-in="item.endIn"
            :image="item.image"
            :btn-color="item.btnColor"
            :token-symbol="item.tokenSymbol"
            :bg-color="item.bgColor"
            :title="item.title"
            :type="'lottery'"
            @on-reward="rewardsModal.active = true"
            @on-my-tickets="myTicketsModal.active = true"
          />
        </div>
      </div>
    </div>
    <ModalsRewardsModal
      v-if="rewardsModal.active"
      :active="rewardsModal.active"
      class="tickets-modal"
      @close="rewardsModal.active = false"
    />
    <ModalsMyTicketsModal
      v-if="myTicketsModal.active"
      :active="myTicketsModal.active"
      class="tickets-modal"
      @close="myTicketsModal.active = false"
    />
  </div>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useLottery } from '../../../composables/useLottery'
import specialLotteries from '~/data/special-lotteries.json'
import { BreakPoint } from '~/model/break-points'

export default {
  setup() {
    const active = ref(0)
    const rewardsModal = ref({
      active: false
    })
    const { myTicketsModal } = useLottery()

    const showAll = ref(false)

    const breakpoints = useBreakpoints(BreakPoint)

    const itemsToShow = computed(() => {
      if (breakpoints.lg.value) {
        return 4
      } else if (breakpoints.sm.value || breakpoints.md.value) {
        return 2
      } else if (breakpoints.smaller('sm').value) {
        return 1
      } else {
        return 4
      }
    })

    watch(() => showAll.value, () => {
      active.value = 0
    })

    const next = () => {
      if (active.value < specialLotteries.length - itemsToShow.value) {
        active.value++
      }
    }

    const prev = () => {
      if (active.value > 0) {
        active.value--
      }
    }

    return {
      specialLotteries,
      active,
      itemsToShow,
      next,
      prev,
      rewardsModal,
      myTicketsModal,
      showAll
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-car__scene) {
  width: 66vw !important;
}
</style>
