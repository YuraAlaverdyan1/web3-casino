<template>
  <div class="container mt-[20px] lg:mt-[50px] w-full max-w-none" :class="menu ? 'opened-menu' : 'closed-menu'">
    <div class="mx-[16px] lg:mx-[0px] mt-[16px] lg:mt-[0px]">
      <ResolveRouter class="mb-[16px]" />
    </div>
    <div class="flex w-full flex-col lg:flex-row gap-[16px] mt-[40px]">
      <sports-template :sports-items="sportsItems">
        <div class="flex justify-between items-center gap-[12px]">
          <p class="text-[16px] font-[700] -mt-[10px]">
            My Bets
          </p>
          <div
            v-if="unredeemedBets.length"
            class="bg-[#F60] rounded-[8px] w-[120px] flex items-center justify-center h-[32px] scale-100 hover:scale-[1.03] transition-all cursor-pointer relative"
            @click="handleWithdrawAllPayout"
          >
            <p class="text-[12px] font-[700]">
              Redeem All
            </p>
            <div
              v-if="redeemAllLoading"
              class="absolute right-[10px] top-[50%] -translate-y-[50%] flex items-center justify-center"
            >
              <span class="loader" />
            </div>
          </div>
        </div>
        <div class="flex items-center gap-[16px] border-b-[1px] border-[#6F6C75] mt-[10px]">
          <div
            :class="selectedMenu === 'all' ? 'text-[#fff] border-b-[1px] border-[#fff]' : 'text-[#6F6C75]'"
            class="text-[16px] font-[700] scale-100 hover:scale-[1.05] transition-all cursor-pointer h-[28px]"
            @click="selectedMenu = 'all'"
          >
            All
          </div>
          <div
            :class="selectedMenu === SportStatus.Accepted ? 'border-b-[1px] border-[#fff]' : ''"
            class="scale-100 hover:scale-[1.05] transition-all cursor-pointer flex items-center gap-[8px] pb-[4px]"
            @click="selectedMenu = SportStatus.Accepted"
          >
            <p
              :class="selectedMenu === SportStatus.Accepted ? 'text-[#fff]' : 'text-[#6F6C75]'"
              class="text-[16px] font-[700]"
            >
              Accepted
            </p>
            <div
              v-if="acceptedBets.length"
              class="w-[20px] h-[20px] border border-[#fff] bg-[#60F] rounded-full flex justify-center items-center"
            >
              <p class="text-[10px] font-[400]">
                {{ acceptedBets.length > 9 ? "9+" : acceptedBets.length }}
              </p>
            </div>
          </div>
          <div
            :class="selectedMenu === SportStatus.Unredeemed ? ' border-[#fff]' : ''"
            class="scale-100 hover:scale-[1.05] transition-all cursor-pointer flex items-center gap-[8px] pb-[4px]"
            @click="selectedMenu = SportStatus.Unredeemed"
          >
            <p
              :class="selectedMenu === SportStatus.Unredeemed ? 'text-[#fff]' : 'text-[#6F6C75]'"
              class="text-[16px] font-[700]"
            >
              Unredeemed
            </p>
            <div
              v-if="unredeemedBets.length"
              class="w-[20px] h-[20px] border border-[#fff] bg-[#60F] rounded-full flex justify-center items-center"
            >
              <p class="text-[10px] font-[400]">
                {{ unredeemedBets.length > 9 ? "9+" : unredeemedBets.length }}
              </p>
            </div>
          </div>
          <div
            class="scale-100 hover:scale-[1.05] transition-all cursor-pointer pb-[4px]"
            @click="selectedMenu = SportStatus.Settled"
          >
            <p
              :class="selectedMenu === SportStatus.Settled ? 'text-[#fff] border-b-[1px] border-[#fff]' : 'text-[#6F6C75]'"
              class="text-[16px] font-[700]"
            >
              Settled
            </p>
          </div>
        </div>
        <div v-if="filteredBets.length" class="flex flex-col gap-[16px] mt-[16px]">
          <my-bets-item
            v-for="(item, index) of filteredBets"
            :key="index"
            :item="item"
            is-full-item
            :selected-menu="selectedMenu"
          />
        </div>
        <div v-else class="flex flex-col items-center justify-center h-full py-[30px]">
          <img alt="ticket" src="/betting/ticket.svg">
          <p class="text-[16px] font-[400]">
            No {{ selectedMenu }} bets
          </p>
          <NuxtLink
            to="/sports/"
            class="flex justify-center items-center bg-[#60F] rounded-[12px] gap-[16px] h-[48px] mt-[8px] cursor-pointer scale-100 hover:scale-[1.02] transition-all w-[300px]"
          >
            <p class="text-[24px] font-[700]">
              Bet Now
            </p>

            <img alt="play icon" src="/betting/play.svg">
          </NuxtLink>
        </div>
      </sports-template>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useMenu } from '~/composables/useMenu'
import SportsTemplate from '~/components/organisms/sports/sports.vue'
import { useAzuro, Sports, SportStatus } from '~/composables/useAzuro'
import MyBetsItem from '~/components/organisms/sports/my-bet-item.vue'
import { useWalletConnect } from '~/composables/useWalletConnect'

export default {
  components: {
    SportsTemplate,
    MyBetsItem
  },
  props: {
    sportsItems: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { menu } = useMenu()
    const { allGames, myBetsArr, getMyBets, unredeemedBets, redeemAllLoading, withdrawAllPayout } = useAzuro()
    const selectedMenu = ref('all')
    const { account } = useWalletConnect()

    onMounted(async () => {
      if (account.value.address) {
        await getMyBets()
        setInterval(async () => {
          await getMyBets()
        }, 5000)
      }
    })

    const handleWithdrawAllPayout = () => {
      redeemAllLoading.value = true
      withdrawAllPayout().then(() => {
        redeemAllLoading.value = false
      }
      ).catch((e) => {
        console.log(e)
        redeemAllLoading.value = false
      })
    }

    const acceptedBets = computed(() => {
      return myBetsArr.value.filter(e => e.status === SportStatus.Accepted)
    })

    const filteredBets = computed(() => {
      if (selectedMenu.value === SportStatus.Accepted) {
        return acceptedBets.value
      } else if (selectedMenu.value === SportStatus.Unredeemed) {
        return unredeemedBets.value
      } else if (selectedMenu.value === SportStatus.Settled) {
        return myBetsArr.value.filter(e => e.isRedeemed === true || e.result === SportStatus.Lost)
      } else {
        return myBetsArr.value
      }
    })

    return {
      menu,
      allGames,
      myBetsArr,
      selectedMenu,
      filteredBets,
      acceptedBets,
      unredeemedBets,
      Sports,
      SportStatus,
      redeemAllLoading,
      handleWithdrawAllPayout
    }
  }
}
</script>

<style lang="scss" scoped>
.blur-bg {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 1px 8px 0px rgba(23, 17, 32, 0.15);
  backdrop-filter: blur(10px);
}

.loader {
  width: 15px;
  height: 15px;
  border: 2px solid #FFF;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
