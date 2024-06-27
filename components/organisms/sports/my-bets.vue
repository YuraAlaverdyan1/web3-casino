<template>
  <div class="lg:w-full lg:max-w-[400px]">
    <div
      :class="isSportsBets ? '-z-[100]' : 'z-[10]'"
      class="w-screen h-screen fixed left-0 bottom-0 lg:hidden"
      @click="isSportsBets = true"
    />
    <div
      :class="isSportsBets ? betslips.length ? 'max-h-[24px]' : 'max-h-[0px] lg:max-h-fit' : 'max-h-[90vh] lg:h-fit'"
      class="fixed left-0 bottom-[52px] lg:bottom-auto lg:sticky lg:top-[100px]  w-full transition-all duration-300 z-[10]"
    >
      <div
        class="h-fit justify-between bg-[#201A29] flex flex-col lg:gap-4 lg:border-[1px] rounded-t-[12px] lg:rounded-lg lg:border-[#424245] lg:p-[24px] z-[30]"
      >
        <div
          :class="betslips.length ? 'h-[24px]' : 'h-[0px]'"
          class="bg-[#F60] flex items-center justify-between px-[24px] transition-all overflow-hidden lg:hidden"
        >
          <p class="text-[14px] font-[400]">
            {{ isSingle ? "Single" : "Combo" }} Bet
          </p>
          <p class="text-[14px] font-[400]">
            {{ totalOdds.toFixed(2) }}
          </p>
        </div>
        <div class="p-[24px] lg:p-[0px]">
          <div class="flex items-center border-b-[1px] border-[#424245] gap-[16px]">
            <div
              :class="!isMyBets ? 'border-[#fff]' : 'border-transparent'"
              class="border-b-[2px] pb-[4px] transition-all cursor-pointer"
              @click="isMyBets = false"
            >
              <p class="text-[16px] font-[700]">
                Betslip
              </p>
            </div>
            <div
              :class="isMyBets ? 'border-[#fff]' : 'border-transparent'"
              class="border-b-[2px] pb-[4px] transition-all cursor-pointer"
              @click="isMyBets = true"
            >
              <p class="text-[16px] font-[700]">
                My Bets
              </p>
            </div>
          </div>
          <div v-if="!isMyBets">
            <div v-if="betslips.length !== 0" class="flex flex-col gap-[16px] mt-[10px] lg:mt-[8px]">
              <div class="flex justify-between bg-[#2C2634] rounded-[12px] h-[40px] relative">
                <div
                  :class="isSingle ? 'left-0' : 'left-[50%]'"
                  class="w-[50%] h-full bg-[#60F]  top-0 rounded-[12px] absolute transition-all"
                />
                <div class="flex justify-center items-center w-full relative cursor-pointer" @click="isSingle = true">
                  <p class="text-[14px] font-[700]">
                    Single
                  </p>
                </div>
                <div class="flex justify-center items-center w-full relative cursor-pointer" @click="isSingle = false">
                  <p class="text-[14px] font-[700]">
                    Combo
                  </p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <img alt="settings icon" src="/betting/settings.svg">
                <p v-if="isSingle">
                  Multiple Single Bet ({{ betslips.length }})
                </p>
                <p v-if="!isSingle">
                  Combo Bet ({{ betslips.length }})
                </p>
                <img
                  alt="delete icon"
                  src="/betting/delete.svg"
                  class="cursor-pointer scale-100 hover:scale-[1.05] transition-all"
                  @click="betslips = []"
                >
              </div>
              <div class="flex flex-col gap-[16px] max-h-[29vh] lg:max-h-[32vh] overflow-y-auto overflow-x-hidden">
                <my-bets-tile v-for="(item, index) of betslips" :key="index" :is-single="isSingle" :item="item" />
              </div>
              <div class="px-[24px] py-[16px] tile">
                <div
                  class="overflow-hidden transition-all duration-300"
                  :class="isSingle ? 'max-h-[0px] mb-[0px]' : 'max-h-[50px] mb-[8px]'"
                >
                  <div
                    class="flex px-[16px] py-[8px] gap-[8px] border-[1px]  rounded-[12px] overflow-hidden transition-all"
                    :class="wagerError ? 'border-[#ED5565]' : 'border-[#424245]'"
                  >
                    <img alt="usdt icon" src="/tokens/usdt.svg">
                    <input v-model="wager" class="bg-transparent border-0 outline-none">
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-[14px] font-[400]">
                    Total Bet
                  </p>
                  <p class="text-[14px] font-[700]">
                    {{ isSingle ? totalBet : wager }} USDT
                  </p>
                </div>
                <div
                  :class="isSingle ? 'max-h-[0px] mt-[0px]' : 'max-h-[50px] mt-[4px]'"
                  class="flex justify-between items-center transition-all overflow-hidden"
                >
                  <p class="text-[14px] font-[400]">
                    Total Odds
                  </p>
                  <p class="text-[14px] font-[700] text-[#9E68FF]">
                    {{ totalOdds.toFixed(2) }}
                  </p>
                </div>
                <div class="flex justify-between items-center mt-[4px]">
                  <p class="text-[14px] font-[400]">
                    Possible Payout
                  </p>
                  <p class="text-[14px] font-[700] text-[#B9FF6E]">
                    {{ isSingle ? possiblePayout.toFixed(2) : (wager * totalOdds).toFixed(2) }} USDT
                  </p>
                </div>
                <div
                  class="bet-btn flex justify-center items-center  rounded-[12px] gap-[16px] h-[48px] mt-[8px] cursor-pointer scale-100 transition-all relative"
                  :class="!isDisabled ? 'bg-[#60F] hover:scale-[1.02] ' : 'bg-[#424245]'"
                  @click="handlePlaceBet"
                >
                  <p class="text-[24px] font-[700]">
                    Bet Now
                  </p>
                  <div v-if="isLoading" class="flex items-center justify-center">
                    <span v-if="isLoading" class="loader w-[20px] h-[20px]" />
                  </div>
                  <img v-if="!isLoading" alt="play icon" src="/betting/play.svg">
                  <div
                    v-if="isDisabled"
                    :class="isDisabled && 'tooltip'"
                    class="absolute -top-[35px] left-[10px] flex justify-center items-center bg-[#2C2634] rounded-[8px] w-[182px] h-[48px]"
                  >
                    <p class="text-[12px] font-[400] bg-transparent text-[#fff]">
                      {{ isDisabled }}
                    </p>
                    <div class="bg-[#2C2634] w-[7px] h-[7px] absolute -bottom-[3px] rotate-[45deg]" />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center">
              <img alt="ticket icon" src="/betting/ticket.svg">
              <p class="text-[16px] font-[400]">
                Betslip is empty
              </p>
              <p class="text-[20px] font-[700]">
                Start Betting Now!
              </p>
              <div
                :class="activeHowPlay === 1 ? 'max-h-[50px]' : 'max-h-[0px]'"
                class="flex items-center gap-[4px] overflow-hidden transition-all duration-300 cursor-pointer scale-100 hover:scale-[1.03]"
                @click="activeHowPlay = 0"
              >
                <p class="text-[12px] text-[#FFDC7E] font-[700]">
                  How to play?
                </p>
                <img
                  alt="arrow icon"
                  :class="activeHowPlay === 1 ? 'rotate-[180deg]' : ' rotate-0'"
                  class="transition-all"
                  src="/betting/yellow-arrow.svg"
                >
              </div>
              <div
                class="flex justify-center flex-col rounded-[12px] h-full mt-[8px] w-full border-[1px] transition-all duration-300"
                :class="activeHowPlay === 1 ? 'p-[24px] bg-[#2C2634] border-[#424245] items-start max-h-[700px]' : 'bg-[#60F] border-transparent items-center max-h-[48px] cursor-pointer scale-100 hover:scale-[1.03]'"
                @click="activeHowPlay = 1"
              >
                <div
                  :class="activeHowPlay === 1 ? 'max-h-[50px]' : 'max-h-[0px]'"
                  class="text-[16px] font-[400] overflow-hidden transition-all h-fit"
                >
                  <p> Ridotto Betting</p>
                </div>
                <div class="flex items-center gap-[16px]">
                  <p class="text-[24px] font-[700]">
                    How to Play?
                  </p>
                  <img v-if="activeHowPlay === 0" alt="play icon" src="/betting/play.svg">
                </div>
                <p
                  :class="activeHowPlay === 1 ? 'max-h-[50px]' : 'max-h-[0px]'"
                  class="text-[16px] font-[400] overflow-hidden transition-all h-full"
                >
                  Follow our easy, step-by-step basic guide to securely migrate your assets.
                </p>
                <div
                  :class="activeHowPlay === 1 ? 'max-h-[130px] mt-[40px]' : 'mt-[0px] max-h-[0px]'"
                  class="flex flex-col gap-[8px] transtion-all overflow-hidden"
                >
                  <div class="flex items-center gap-[8px]">
                    <div
                      class="w-[28px] h-[28px] rounded-full border-[1px] border-[#fff] flex items-center justify-center"
                    >
                      1
                    </div>
                    <p class="capitalize text-[14px] font-[700]">
                      choose event
                    </p>
                  </div>
                  <div class="flex items-center gap-[8px]">
                    <div
                      class="w-[28px] h-[28px] rounded-full border-[1px] border-[#fff] flex items-center justify-center"
                    >
                      2
                    </div>
                    <p class="capitalize text-[14px] font-[700]">
                      make a bet
                    </p>
                  </div>
                  <div class="flex items-center gap-[8px]">
                    <div
                      class="w-[28px] h-[28px] rounded-full border-[1px] border-[#fff] flex items-center justify-center"
                    >
                      3
                    </div>
                    <p class="capitalize text-[14px] font-[700]">
                      check your bet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="lg:hidden relative">
              <div
                class="absolute bg-[#201A29] z-[20] left-0 top-[10px] flex items-center justify-center w-[40px] h-[40px] border-[1px] border-[#424245] rounded-[8px] -rotate-[90deg]"
                @click="active === 0 ? active = allBets.length - 1 : active = active - 1"
              >
                <img alt="arrow icon" src="/betting/arrow.svg">
              </div>
              <div
                class="absolute bg-[#201A29] z-[20] right-0 top-[10px] flex items-center justify-center w-[40px] h-[40px] border-[1px] border-[#424245] rounded-[8px] rotate-[90deg]"
                @click="active === allBets.length - 1 ? active = 0 : active = active + 1"
              >
                <img alt="arrow icon" src="/betting/arrow.svg">
              </div>
              <o-carousel
                v-model="active"
                :arrow="false"
                :indicator="false"
                :items-to-show="1"
                :repeat="false"
                :has-drag="true"
                class="mt-[20px]"
              >
                <o-carousel-item v-for="(i, idx) of allBets" :key="idx">
                  <p class="text-[16px] font-[700] text-center mb-[23px] mt-[16px]">
                    {{ i.title }} ({{ i.items.length }})
                  </p>
                  <div class="flex flex-col gap-[16px] max-h-[53vh] lg:max-h-[282px] overflow-y-auto overflow-x-hidden">
                    <div v-for="(item, index) of i.items" :key="index">
                      <my-bets-item :item="item" />
                    </div>
                  </div>
                  <NuxtLink
                    to="/sports/my-bets"
                    class="border-[1px] border-[#F5F5F7] h-[56px] w-full justify-center items-center rounded-[12px] mt-[16px] hidden lg:flex"
                  >
                    <p class="text-[16px] font-[700]">
                      All Bets
                    </p>
                  </NuxtLink>
                </o-carousel-item>
              </o-carousel>
            </div>
            <div v-if="isLoadingMybets" class="py-[30px] flex flex-col items-center justify-center gap-[20px]">
              <div class="flex items-center justify-center">
                <span class="loader w-[40px] h-[40px]" />
              </div>
              <p class="text-[16px] font-[700]">
                Loading bets
              </p>
            </div>
            <div v-else-if="filteredBets.length" class="hidden lg:block">
              <p class="text-[16px] font-[700] text-center my-[16px]">
                Accepted ({{ filteredBets.length }})
              </p>
              <div class="flex flex-col gap-[16px] max-h-[53vh] lg:max-h-[282px] overflow-y-auto overflow-x-hidden">
                <div v-for="(item, index) of filteredBets" :key="index">
                  <my-bets-item :item="item" />
                </div>
              </div>

              <NuxtLink
                to="/sports/my-bets"
                class="border-[1px] border-[#F5F5F7] h-[56px] w-full justify-center items-center rounded-[12px] mt-[16px] hidden lg:flex"
              >
                <p class="text-[16px] font-[700]">
                  All Bets
                </p>
              </NuxtLink>
            </div>
            <div v-else class="flex flex-col items-center">
              <img alt="ticket icon" src="/betting/ticket.svg">
              <p class="text-[16px] font-[400]">
                No active bets
              </p>
              <p class="text-[16px] font-[700]">
                All unsettled bets will be listed here
              </p>
              <div
                :class="activeHowPlay === 2 ? 'max-h-[50px]' : 'max-h-[0px]'"
                class="flex items-center gap-[4px] overflow-hidden transition-all duration-300 cursor-pointer scale-100 hover:scale-[1.03]"
                @click="activeHowPlay = 0"
              >
                <p class="text-[12px] text-[#FFDC7E] font-[700]">
                  How to play?
                </p>
                <img
                  alt="arrow icon"
                  :class="activeHowPlay === 2 ? 'rotate-[180deg]' : ' rotate-0'"
                  class="transition-all"
                  src="/betting/yellow-arrow.svg"
                >
              </div>
              <div
                class="flex justify-center flex-col rounded-[12px] h-full mt-[8px] w-full border-[1px] transition-all duration-300"
                :class="activeHowPlay === 2 ? 'p-[24px] bg-[#2C2634] border-[#424245] items-start max-h-[700px]' : 'bg-[#60F] border-transparent items-center max-h-[48px] cursor-pointer scale-100 hover:scale-[1.03]'"
                @click="activeHowPlay = 2"
              >
                <div
                  :class="activeHowPlay === 2 ? 'max-h-[50px]' : 'max-h-[0px]'"
                  class="text-[16px] font-[400] overflow-hidden transition-all h-fit"
                >
                  <p> Ridotto Betting</p>
                </div>
                <div class="flex items-center gap-[16px]">
                  <p class="text-[24px] font-[700]">
                    How to Play?
                  </p>
                  <img v-if="activeHowPlay === 0" alt="play icon" src="/betting/play.svg">
                </div>
                <p
                  :class="activeHowPlay === 2 ? 'max-h-[50px]' : 'max-h-[0px]'"
                  class="text-[16px] font-[400] overflow-hidden transition-all h-full"
                >
                  Follow our easy, step-by-step basic guide to securely migrate your assets.
                </p>
                <div
                  :class="activeHowPlay === 2 ? 'max-h-[130px] mt-[40px]' : 'mt-[0px] max-h-[0px]'"
                  class="flex flex-col gap-[8px] transtion-all overflow-hidden"
                >
                  <div class="flex items-center gap-[8px]">
                    <div
                      class="w-[28px] h-[28px] rounded-full border-[1px] border-[#fff] flex items-center justify-center"
                    >
                      1
                    </div>
                    <p class="capitalize text-[14px] font-[700]">
                      choose event
                    </p>
                  </div>
                  <div class="flex items-center gap-[8px]">
                    <div
                      class="w-[28px] h-[28px] rounded-full border-[1px] border-[#fff] flex items-center justify-center"
                    >
                      2
                    </div>
                    <p class="capitalize text-[14px] font-[700]">
                      make a bet
                    </p>
                  </div>
                  <div class="flex items-center gap-[8px]">
                    <div
                      class="w-[28px] h-[28px] rounded-full border-[1px] border-[#fff] flex items-center justify-center"
                    >
                      3
                    </div>
                    <p class="capitalize text-[14px] font-[700]">
                      check your bet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { computed, ref, watch } from 'vue'
import { useAzuro, SportStatus } from '../../../composables/useAzuro'
import MyBetsTile from '~/components/organisms/sports/my-bet-tile.vue'
import MyBetsItem from '~/components/organisms/sports/my-bet-item.vue'
import { useMobileMenu } from '~/composables/useMobileMenu'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { useWeb3 } from '~/composables/useWeb3'
export default {
  components: {
    MyBetsTile,
    MyBetsItem
  },
  setup() {
    const totalBet = ref(0)
    const { account } = useWalletConnect()
    const possiblePayout = ref(0)
    const totalOdds = ref(0)
    const { betslips, handlePlaceBet, wager, isSingle, isMyBets, myBetsArr, isLoadingMybets, isLoading, wagerError, isDisabled } = useAzuro()
    const { isSportsBets } = useMobileMenu()
    const active = ref(0)
    const activeHowPlay = ref(0)

    const { web3Global } = useWeb3()
    const filteredBets = computed(() => {
      return myBetsArr.value.filter(e => e.status === SportStatus.Accepted)
    })

    const allBets = computed(() => {
      return [
        { title: 'All', items: myBetsArr.value },
        { title: SportStatus.Accepted, items: filteredBets.value },
        { title: SportStatus.Unredeemed, items: myBetsArr.value.filter(e => e.isRedeemed === false && e.result === SportStatus.Won) },
        { title: SportStatus.Settled, items: myBetsArr.value.filter(e => e.isRedeemed === true || e.result === SportStatus.Lost) }
      ]
    })

    watch(() => wager.value, () => {
      wagerError.value = false
    })

    watch(() => isMyBets.value, () => {
      activeHowPlay.value = 0
    })

    watch(() => [betslips.value, isSingle.value], () => {
      totalOdds.value = betslips.value.reduce((acc, cur) => +cur.bet.currentOdds + acc, 0)
        totalBet.value = betslips.value.reduce((acc, cur) => +cur.wager + acc, 0)
        possiblePayout.value = betslips.value.reduce((acc, cur) => (+cur.wager * +cur.bet.currentOdds) + acc, 0)
    }, { deep: true, immediate: true })

    watch(() => [wagerError.value, account.value, web3Global.chain, betslips.value, isSingle.value], () => {
      if ((!wagerError.value || isSingle.value) && betslips.value.filter(el => el.wager <= 0).length === 0) {
        isDisabled.value = ''
      }
      if (!isSingle.value && wagerError.value) {
        isDisabled.value = 'Wager cannot be 0'
      }
      if (web3Global.chain.code !== 'POLYGON') {
        isDisabled.value = 'Please change your network'
      }
    }, { deep: true, immediate: true })

    return {
      isSingle,
      betslips,
      totalBet,
      possiblePayout,
      totalOdds,
      isMyBets,
      handlePlaceBet,
      wager,
      filteredBets,
      isLoading,
      isSportsBets,
      active,
      allBets,
      isLoadingMybets,
      activeHowPlay,
      wagerError,
      isDisabled
    }
  }
}
</script>

<style scoped>
.tile {
  border-radius: 12px;
  border: 1px solid #424245;
  background: #251F2D;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.loader {
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

.bet-btn .tooltip {
  transition: all 0.3s;
  opacity: 0;
}

.bet-btn:hover .tooltip {
  transition: all 0.3s;
  opacity: 100;
}
</style>
