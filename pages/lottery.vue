<template>
  <div class="overflow-hidden w-full px-[24px] md:px-0" :class="menu ? 'opened-menu' : 'closed-menu'">
    <LotteryJackpot
      :data="[1, 2]"
      :small-details1="true"
      :small-details2="true"
      :details2-title="'Verifiably Fair, Everyday!'"
      :details2-sub-title="'Live lucky and win big, today and everyday! Buy a ticket, watch the countdown, and check for matching numbers. Stay tuned for more exciting lottery games coming soon!'"
      :details2-btn="true"
      :details-2-btn-text="'Buy Tickets'"
      @buy-ticket="ticketsModal.active = true"
    />
    <LotterySpecialLotteries />
    <LotteryLatestDraws :is-small="true" :small="true" />
    <LotteryPlayLottery v-if="!isSmall" :is-small="isSmall" />
    <HomeNewsCarousel v-if="isSmall" :btn-color="'#FF6600'" />
    <LotteryLatestTable />
    <HomeNewsCarousel v-if="isSmall" :btn-color="'#6600FF'" />
    <LotteryBanner
      v-if="!isSmall"
      :image="inviteFriendsData.image"
      :title="inviteFriendsData.title"
      :subtitle="inviteFriendsData.subtitle"
      :button-color="'#6600FF'"
      :button-text="inviteFriendsData.btnText"
      :btn-text-color="'white'"
    />
    <ModalsBuyTicketsModal
      v-if="ticketsModal.active"
      :active="ticketsModal.active"
      :is-small="isSmall"
      class="tickets-modal"
      @close="ticketsModal.active = false"
    />
    <ModalsPrizeBreakdowns
      v-if="prizeBreakdownsModal.active"
      :data="prizeModalData"
      :token-symbol="'usdt'"
      :active="prizeBreakdownsModal.active"
      @close="prizeBreakdownsModal.active = false"
    />
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import communityData from '~/data/community-items.json'
import inviteFriendsData from '~/data/invite-friends-banner.json'
import { BreakPoint } from '~/model/break-points'
import { useMenu } from '~/composables/useMenu'
import { useLottery } from '~/composables/useLottery'

export default {
  setup() {
    const prizeModalData = ref()
    const { ticketsModal } = useLottery()

    const { menu } = useMenu()

    const breakpoints = useBreakpoints(BreakPoint)

    const prizeBreakdownsModal = ref({
      active: false
    })

    const itemsToShow = computed(() => {
      if (breakpoints.lg.value || breakpoints.md.value) {
        return 6
      } else if (breakpoints.sm.value) {
        return 3
      }
      return 2
    })

    const isSmall = computed(() => {
      return breakpoints.smallerOrEqual('sm').value
    })

    const openPrizeModal = (el) => {
      prizeModalData.value = el
      prizeBreakdownsModal.value.active = true
    }

    watch(
      () => ticketsModal.value.active,
      () => {
        if (ticketsModal.value.active) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = 'auto'
        }
      }
    )

    return {
      ticketsModal,
      isSmall,
      itemsToShow,
      communityData,
      prizeBreakdownsModal,
      menu,
      data: {
        btn1Text: 'Buy Tickets',
        smallSubTitle: 'Live lucky and win big',
        smallTitle1:
          'Play the Worlds First 100% Verifiably Fair Jackpot Lottery',
        smallTitle2: 'Today and Everyday!'
      },
      inviteFriendsData,
      openPrizeModal
    }
  }
}
</script>

<style lang="scss" scoped>
.tickets-modal {
  transition: 0.4s;
}

.closed-menu {
  width: 89vw;
}

.opened-menu {
  width: 77vw;
}
</style>
