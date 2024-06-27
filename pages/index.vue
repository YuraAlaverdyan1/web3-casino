<template>
  <div
    class="overflow-hidden w-full px-[24px] md:px-0"
    :class="menu ? 'opened-menu' : 'closed-menu'"
  >
    <HomePartOne
      :data="homeData"
      :small-details1="true"
      :small-details2="true"
      :details2-title="'Verifiably Fair, Everyday!'"
      :details2-sub-title="'Live lucky and win big, today and everyday! Buy a ticket, watch the countdown, and check for matching numbers. Stay tuned for more exciting lottery games coming soon!'"
      :details2-btn="true"
      :details-2-btn-text="'Buy Tickets'"
    />
    <InfoContainers />
    <HomeGoTo v-if="!isSmall" />
    <LotteryNews />
    <HomeTopGames v-if="!isSmall" />
    <HomeNewsCarousel v-if="isSmall" :btn-color="'#6600FF'" :btn-text-color="'white'" />
    <GamesLine v-if="isLarge" />
    <HomeSmallHotGames v-if="isSmall" />
    <HomeNewGames />
    <HomeNewsElementsContainer v-if="!isSmall" class="mb-20" />
    <LotteryBanner
      v-if="!isSmall"
      :image="'/images/home/banner.svg'"
      :is-title-italic="false"
      :button-color="'#B9FF6E'"
      :title="'Stake your tokens'"
      :subtitle="'EARN UP TO %49'"
      :button-text="'Earn'"
      :btn-text-color="'#171120'"
    />
    <HomeHotGames v-if="!isSmall" class="mt-20" />
    <LotteryPartnership :is-small="isSmall" :home="true" class="my-20" />
    <LotteryLeaderboard />
    <HomeNewsCarousel v-if="isSmall" :btn-color="'#FF6600'" :btn-text-color="'white'" />
    <LotteryBanner
      v-if="!isSmall"
      :image="'/images/home/banner-2.svg'"
      :is-title-italic="false"
      :button-color="'#6600FF'"
      :title="'Invite your friends'"
      :subtitle="'AFFILIATE BONUS'"
      :button-text="'Invite Friends'"
      :btn-text-color="'white'"
    />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { BreakPoint } from '~/model/break-points'
import { useMenu } from '~/composables/useMenu'
import part1Images from '~/data/part-1.json'

export default {
  methods: {
    ForcesUpdateComponent() {
      this.$forceUpdate() // Notice we have to use a $ here
    }
  },
  setup() {
    const breakpoints = useBreakpoints(BreakPoint)

    const { menu } = useMenu()

    const isSmall = computed(() => breakpoints.smaller('sm').value)
    const isLarge = computed(() => breakpoints.greaterOrEqual('sm').value)

    return {
      isSmall,
      menu,
      breakpoints,
      isLarge,
      homeData: {
        smallTitle1: 'Play the World\'s First 100% Verifiably Fair Jackpot Lottery',
        smallTitle2: 'Today and Everyday!',
        smallSubTitle: 'Live lucky and win big',
        title: 'Play the World\'s First 100% Verifiably Fair Jackpot Lottery',
        subtitle:
          'Live lucky and win big, today and everyday! Buy a ticket, watch the countdown, and check for matching numbers. \n Stay tuned for more exciting lottery games coming soon!',
        btnText: 'Buy Tickets',
        images: part1Images
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.opened-menu {
  @screen md {
    width: 79vw !important;
  }
}

.closed-menu:deep(.o-car),
.container {
  width: 89vw;
}

:deep(.o-car__items) {
  gap: 20px;
}
</style>
