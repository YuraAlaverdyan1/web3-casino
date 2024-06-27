<template>
  <div>
    <div v-if="!isFullItem" class="tile">
      <div class="h-[32px] flex items-center justify-between px-[12px] bg-[#38333F] rounded-t-[12px]">
        <div>
          <p class="text-[14px] font-[400]">
            {{ createdDate }}
          </p>
        </div>
        <div class="flex items-center gap-[4px]">
          <img alt="done icon" src="/betting/done.svg">
          <p class="text-[14px] font-[400] text-[#9E68FF]">
            {{ item.status }}
          </p>
        </div>
      </div>
      <div class="px-[12px] py-[4px] flex flex-col gap-[4px]">
        <div class="flex items-center gap-[4px]">
          <img alt="game icon" :src="resolveGameIcons(item.game[0].sport.slug).icon" class="w-[18px] h-[18px]">
          <div v-if="item.conditionIds.length === 1">
            <p>{{ item.game[0].participants[0].name }} - {{ item.game[0].participants[1].name }}</p>
          </div>
          <div v-else class="flex white-space gap-[5px]">
            <p class="cut-text">
              <span v-for="(obj, index) of item.game" :key="index" class="">
                {{ obj.participants[0].name }} - {{ obj.participants[1].name }}&nbsp;
              </span>
            </p>
          </div>
        </div>
        <p class="text-[12px] font-[400]">
          {{ item.conditionIds.length > 1 ? `${item.conditionIds.length} events` : market.marketName }}
        </p>
        <div class="flex justify-between items-center -mt-[5px]">
          <p class="text-[14px] font-[700]">
            {{ item.selections.length > 1 ? 'Combo' : market.outcome && market.outcome[0].selectionName }}
          </p>
          <p class="text-[14px] font-[700]">
            {{ item.amount }}
          </p>
        </div>
      </div>
      <div>
        <div
          class="flex items-center gap-[4px] justify-center mt-[5px] mb-[2px] cursor-pointer scale-100 hover:scale-[1.02] transition-all"
          @click="showDetails = !showDetails"
        >
          <p class="text-[12px] font-[700] text-[#FFDC7E]">
            More Details
          </p>
          <img
            alt="arrow icon"
            src="/betting/arrow-down-yellow.svg"
            class="transition-all duration-300"
            :class="!showDetails ? 'rotate-0' : ' rotate-180'"
          >
        </div>
        <div class="overflow-hidden transition-all duration-300" :class="showDetails ? 'max-h-[500px]' : ' max-h-[0px]'" />
      </div>
    </div>
    <div v-else class="tile p-[16px] bg-[#251F2D] bottom-[1px] border-[#424245]">
      <div class="bg-[#38333F] border-b-[1px] border-[#424245] rounded-[12px] px-[16px] py-[8px]">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <p class="text-[12px] sm:text-[14px] font-[400]">
              {{ item.conditionIds.length > 1 ? 'Combo' : 'Single' }}
            </p>
            &nbsp;/&nbsp;
            <p class="text-[12px] sm:text-[14px] font-[400]">
              {{ createdDate }}
            </p>
            <NuxtLink
              target="_blank"
              :to="`https://polygonscan.com/tx/${item.txHash}`"
              class="scale-100 hover:scale-[1.03] transition-all"
            >
              <img alt="share icon" src="/betting/share.svg" class="ml-[4px]">
            </NuxtLink>
          </div>
          <div class="flex gap-[4px] items-center">
            <img alt="game icon" :src="resolveStatus.img">
            <p :class="`text-[${resolveStatus.color}]`" class="text-[12px] sm:text-[14px] font-[400]">
              {{ resolveStatus.status }}
            </p>
          </div>
        </div>
      </div>
      <div v-for="(obj, index) of item.game" :key="index">
        <div class="mt-[12px] flex items-center gap-[8px]">
          <img alt="game icon" :src="resolveGameIcons(obj.sport.slug).icon" class="w-[24px] h-[24px]">
          <p class="text-[14px] font-[700]">
            {{ obj.league.name }}
          </p>
        </div>
        <div class="px-[16px] mt-[8px]">
          <p class="text-[14px] font-[400]">
            {{ resolveDateGame(obj.startsAt) }}
          </p>
        </div>
        <div
          class="w-full border-[1px] border-[#424245] rounded-[12px] px-[16px] py-[8px] flex flex-col sm:flex-row items-center justify-between mt-[5px] sm:h-[68px]"
        >
          <div class="flex items-center justify-between sm:block my-[10px] sm:my-[0px]">
            <div class="flex items-center gap-[7px] pr-[15px]">
              <img
                alt="team icon"
                :onerror="`javascript:this.src='${resolveGameIcons(obj.sport.slug).bg}'`"
                :src="obj.participants[0].image"
                class="w-[18px] h-[18px]"
              >
              <p class="cut-text">
                {{ obj.participants[0].name }}
              </p>
            </div>
            <div class="flex items-center gap-[7px] sm:mt-[10px] pr-[15px]">
              <img
                alt="team icon"
                :onerror="`javascript:this.src='${resolveGameIcons(obj.sport.slug).bg}'`"
                :src="obj.participants[1].image"
                class="w-[18px] h-[18px]"
              >
              <p class="cut-text">
                {{ obj.participants[1].name }}
              </p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-[8px] w-full sm:w-fit">
            <div
              class="bg-[#201A29] border-[1px] border-[#424245] rounded-[4px] w-full flex flex-col sm:block items-center sm:w-[130px] h-[52px] px-[12px] py-[4px]"
            >
              <p class="text-[14px] font-[400]">
                Market
              </p>

              <p class="text-[12px] font-[700]">
                {{ market.marketName }}
              </p>
            </div>
            <div class="flex items-center gap-[8px] w-full sm:w-fit">
              <div
                class="bg-[#201A29] border-[1px] border-[#424245] rounded-[4px] w-full flex flex-col sm:block items-center sm:w-[130px] h-[52px] px-[12px] py-[4px]"
              >
                <p class="text-[14px] font-[400]">
                  Outcome
                </p>
                <p class="text-[14px] font-[700]">
                  {{ market.outcome && market.outcome[index] && market.outcome[index].selectionName }}
                </p>
              </div>
              <div
                class="bg-[#201A29] border-[1px] border-[#424245] rounded-[4px] w-full flex flex-col sm:block items-center sm:w-[130px] h-[52px] px-[12px] py-[4px]"
              >
                <p class="text-[14px] font-[400]">
                  Odds
                </p>
                <p class="text-[14px] font-[700]">
                  {{ Number(market.outcome && market.outcome[index] && market.outcome[index].currentOdds).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-[8px] rounded-[12px] bg-[#201A29] border-[1px] border-[#424245] gap-[5px] sm:gap-[0px] px-[16px] py-[8px] flex flex-col sm:flex-row items-center justify-between sm:h-[48px]"
      >
        <div class="flex items-center gap-[12px]">
          <p class="text-[14px] font-[400]">
            Bet Amount
          </p>
          <p class="text-[14px] font-[700]">
            {{ item.amount }} USDT
          </p>
        </div>
        <div class="flex items-center gap-[8px]">
          <p class="text-[14px] font-[400]">
            {{ resolveStatus.text }}
          </p>
          <p class="text-[14px] font-[700]" :class="resolveStatus.status === SportStatus.Won ? 'text-[#B9FF6E]' : 'text-[#9E68FF]'">
            {{ resolveStatus.status === SportStatus.Won ? '+' : "" }}{{ resolveStatus.amount.toFixed(2) }} USDT
          </p>
        </div>
        <div class="flex gap-[8px] items-center">
          <div
            v-if="!item.isRedeemed && item.result === SportStatus.Won"
            class="bg-[#9E68FF] relative rounded-[12px] w-[100px] h-[32px] flex items-center justify-center cursor-pointer scale-100 hover:scale-[1.03] transition-all"
            @click="handleWithdrawPayout"
          >
            <p class="text-[14px] font-[700]">
              Redeem
            </p>
            <div
              v-if="isLoading"
              class="absolute right-[5px] top-[50%] -translate-y-[50%] flex items-center justify-center"
            >
              <span class="loader" />
            </div>
          </div>
          <div
            class="rounded-[12px] w-[100px] h-[32px] flex items-center justify-center border-[1px] border-[#fff] cursor-pointer scale-100 hover:scale-[1.03] transition-all"
            @click="isShareModal = true"
          >
            <p class="text-[16px] font-[700]">
              Share
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      :class="isShareModal ? 'scale-100' : ' scale-0'"
      class="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] transition-all z-[100] flex items-center justify-center w-full"
    >
      <div class="w-screen h-screen absolute" @click="isShareModal = false" />
      <div class="relative z-[101] bg-[#201A29] rounded-[16px] w-full max-w-[466px] p-[24px]">
        <div class="flex justify-between">
          <p class="text-[24px] font-[700]">
            Share your bet
          </p>
          <img alt="close icon" src="/images/nav/close.svg" class="max-w-[20px]" @click="isShareModal = false">
        </div>

        <img alt="share icon" src="/betting/banners/share-banner.webp" class="rounded-[16px] overflow-hidden mt-[24px]">
        <div class="mt-[24px] flex items-center justify-between">
          <NuxtLink class="scale-100 hover:scale-[1.03] transtion-all" to="/">
            <img alt="twitter icon" src="/images/menu/twitter.svg">
          </NuxtLink>
          <NuxtLink class="scale-100 hover:scale-[1.03] transtion-all" to="/">
            <img alt="instagram icon" src="/images/footer/instagram.svg">
          </NuxtLink>
          <NuxtLink class="scale-100 hover:scale-[1.03] transtion-all" to="/">
            <img alt="telegram icon" src="/images/menu/telegram.svg">
          </NuxtLink>
          <NuxtLink class="scale-100 hover:scale-[1.03] transtion-all" to="/">
            <img alt="m icon" src="/images/footer/m-logo.svg">
          </NuxtLink>
          <NuxtLink class="scale-100 hover:scale-[1.03] transtion-all" to="/">
            <img alt="youtube icon" src="/images/footer/youtube.svg">
          </NuxtLink>
          <NuxtLink class="scale-100 hover:scale-[1.03] transtion-all" to="/">
            <img alt="reddit icon" src="/images/footer/reddit.svg">
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { computed, onMounted, ref, watch } from 'vue'
import { aggregateOutcomesByMarkets } from '@azuro-org/toolkit'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { useAzuro, SportStatus } from '~/composables/useAzuro'
import { resolveGameIcons } from '~/utils/helpers'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    isFullItem: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedMenu: {
      type: String,
      required: true

    }
  },
  setup(props) {
    const { chain, withdrawPayout } = useAzuro()
    const market = ref({})
    const showDetails = ref(false)
    const isLoading = ref(false)
    const isShareModal = ref(false)
    const route = useRoute()

    watch(() => route, () => {
      isShareModal.value = false
    }, { deep: true, immediate: true })

    const createdDate = computed(() => {
      if (props.isFullItem) {
        return dayjs(props.item.createdAt * 1000).format('D.M.YYYY , HH:MM A')
      }
      return dayjs(props.item.createdAt * 1000).format('DD MMM YYYY , HH:MM A')
    })

    const resolveDateGame = (date) => {
      const d = new Date(date * 1000)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      function padTo2Digits(num) {
        return String(num).padStart(2, '0')
      }

      const hoursAndMinutes =
        `${padTo2Digits(d.getHours())
        }:${padTo2Digits(d.getMinutes())}`

      if (today.toDateString() === d.toDateString()) {
        return `Today ${hoursAndMinutes}`
      } else if (tomorrow.toDateString() === d.toDateString()) {
        return `Tomorrow ${hoursAndMinutes}`
      } else {
        return dayjs(date * 1000).format('DD MMM YYYY , HH:MM A')
      }
    }

    const resolveStatus = computed(() => {
      if (props.item.result === SportStatus.Lost) {
        return { status: SportStatus.Lost, color: '#FFDC7E', img: '/betting/lost.svg', text: 'Possible Win', amount: +props.item.amount * +props.item.odds }
      } else if (props.item.result === SportStatus.Won) {
        return { status: SportStatus.Won, color: '#B9FF6E', img: '/betting/won.svg', text: 'Winning', amount: +props.item.amount * +props.item.odds }
      }
      return { status: props.item.status, color: '#9E68FF', img: '/betting/done.svg', text: 'Possible Win', amount: +props.item.amount * +props.item.odds }
    })
    const changeMenu = () => {
      const markets = aggregateOutcomesByMarkets({
        lpAddress: chain.value.smartContracts.contracts.LPAddress.address,
        conditions: props.item.conditions
      })
      market.value = {
        marketName: markets[0].marketName,
        outcome: props.item.selections.map((e, index) => {
          if (markets[0].outcomes && markets[0].outcomes.length === 1) {
            return markets[0].outcomes[0].find((el) => {
              return el.id === e.outcome.id
            })
          } else if (markets[0].outcomes) {
            return markets[0].outcomes[index].find((el) => {
              return el.id === e.outcome.id
            })
          } else {
            return null
          }
        })

      }
    }

    onMounted(() => {
      changeMenu()
    }

    )
    watch(() => props.selectedMenu, () => {
      changeMenu()
    })

    const handleWithdrawPayout = () => {
      isLoading.value = true
      const isCombo = props.item.conditionIds.length > 1
      withdrawPayout(props.item.betId, isCombo).then(() =>
        isLoading.value = false
      ).catch(() => {
        isLoading.value = false
      })
    }
    return {

      market,
      createdDate,
      showDetails,
      resolveStatus,
      resolveDateGame,
      handleWithdrawPayout,
      isLoading,
      resolveGameIcons,
      isShareModal,
      SportStatus
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

.stadion_bg {
  border-radius: 12px;
  border: 1px solid var(--outline, #424245);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 1px 8px 0px rgba(23, 17, 32, 0.15);
  backdrop-filter: blur(10px);
}

.cut-text {
  width: 90%;
  max-width: 100px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  @screen sm {
    max-width: 330px;
  }
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
