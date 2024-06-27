<template>
  <div class="flex flex-col-reverse md:flex-row-reverse gap-8 text-white">
    <div class="transition-all duration-500 basis-1/2">
      <div class="flex justify-between mb-[22px] items-center">
        <div class="text-[24px] font-[700]">
          Buy Ticket
        </div>
        <Tooltip v-if="tooltip" style="min-height: 125px;">
          When buying ticket, the amount willl be withdrawn from your wallet in the selected currency.
        </Tooltip>
        <input type="image" src="/images/lottery/buy-tickets-modal/info.png" @click="tooltip = !tooltip">
      </div>
      <!-- BUY TICKET -->
      <div class="hidden md:block">
        <div class="flex  gap-4">
          <div class="basis-2/4 px-[16px] py-[12px] rounded-xl border border-[#424245]">
            <div class="text-[12px]">
              Token
            </div>
            <div class="flex mt-[3px]">
              <div class="mr-2">
                <img alt="token icon" :src="`/tokens/${tokenSymbol}.svg`">
              </div>
              <div class="uppercase">
                {{ tokenSymbol }}
              </div>
            </div>
          </div>
          <div class="basis-2/4 px-[16px] py-[12px] rounded-xl border border-[#424245]">
            <div class="text-[12px]">
              Lottery Type
            </div>
            <div class="font-semibold mt-[3px]">
              {{ ticketsModal.lottery }}
            </div>
          </div>
        </div>
        <!-- Tickets counter DESKTOP -->
        <LotteryTicketCounter
          :tickets-quantity="tickets.length"
          @remove-ticket="ticketsCount > 0 ? ticketsCount-- : ''"
          @add-ticket="ticketsCount++"
          @max-tickets="ticketsCount = maxTickets"
        />
        <!-- End tickets counter -->

        <!-- Package -->
        <div class=" mt-6 ">
          <div class="justify-between pb-2">
            <div class="font-semibold">
              Package
            </div>
            <div class="text-[14px] font-[400]">
              Buy more to get more discount for up to %20
            </div>
          </div>
          <div class="flex gap-2">
            <button class="w-full h-12 " :class="(tickets.length >= 5 && tickets.length < 10) ? '' : 'opacity-50'">
              <div class="bg-[#9E68FF] rounded-t-xl text-sm">
                Save 5%
              </div>
              <div class="bg-[#38333F] rounded-b-xl">
                5
              </div>
            </button>
            <button class="w-full h-12 " :class="(tickets.length >= 10 && tickets.length < 20) ? '' : 'opacity-50'">
              <div class="bg-[#9E68FF] rounded-t-xl text-sm">
                Save 10%
              </div>
              <div class="bg-[#38333F] rounded-b-xl">
                10
              </div>
            </button>
            <button class="w-full h-12 " :class="(tickets.length >= 20) ? '' : 'opacity-50'">
              <div class="bg-[#9E68FF] rounded-t-xl text-sm">
                Save 20%
              </div>
              <div class="bg-[#38333F] rounded-b-xl">
                20
              </div>
            </button>
          </div>
        </div>
        <!-- End Package -->
      </div>

      <!-- END BUY TICKETS -->
      <div class=" mt-6 hidden">
        <div class="justify-between pb-2">
          <div class="font-semibold">
            Subscribe
          </div>
          <div class="py-2">
            Join the draw for the next round
          </div>
          <div class="text-[#FFDC7E] text-sm">
            You have subscribed for {{ activeSubscribe }} weeks
          </div>
        </div>
        <div class="flex gap-2">
          <button
            :class="activeSubscribe === 1 ? 'bg-[#FF6600] ' : 'bg-[#38333F]'"
            class=" rounded-xl w-full h-12 subBtn "
            @click="activeSubscribe = 1"
          >
            1
          </button>
          <button
            :class="activeSubscribe === 2 ? 'bg-[#FF6600] ' : 'bg-[#38333F]'"
            class=" rounded-xl w-full h-12 subBtn "
            @click="activeSubscribe = 2"
          >
            2
          </button>
          <button
            :class="activeSubscribe === 3 ? 'bg-[#FF6600] ' : 'bg-[#38333F]'"
            class=" rounded-xl w-full h-12 subBtn "
            @click="activeSubscribe = 3"
          >
            3
          </button>
          <button
            :class="activeSubscribe === 4 ? 'bg-[#FF6600] ' : 'bg-[#38333F]'"
            class=" rounded-xl w-full h-12 subBtn "
            @click="activeSubscribe = 4"
          >
            4
          </button>
          <button class="bg-[#38333F] rounded-xl w-full h-12 subBtn ">
            Select >
          </button>
        </div>
      </div>

      <div class="flex md:hidden justify-between items-center">
        <div>
          <div class="font-semibold text-lg">
            Subscribe
          </div>
          <div>
            Join the draw for multiple rounds
          </div>
        </div>
        <div>
          <o-switch v-model="active" />
        </div>
      </div>

      <div class="mt-6">
        <div class="title">
          Total
        </div>
        <div>
          <div class="default-text w-full flex justify-between px-4">
            <div>
              Amount
            </div>
            <div>
              {{ tickets.length }} {{ tokenSymbol.toUpperCase() }}
            </div>
          </div>
          <div class="default-text w-full flex justify-between px-4">
            <div>Subscription</div>
            <div>{{ discount }}</div>
          </div>
          <div class="default-text w-full flex justify-between px-4">
            <div>Bulk Discount</div>
            <div>{{ resolveDiscount }} {{ tokenSymbol.toUpperCase() }}</div>
          </div>
        </div>
      </div>
      <div>
        <div class="default-text flex gap-1 total items-center pl-4 my-2">
          <img alt="token icon" :src="`/tokens/${tokenSymbol}.svg`">
          {{ tickets.length - resolveDiscount }}
          {{ tokenSymbol.toUpperCase() }}
        </div>
      </div>
      <div class="default-text mt-2">
        Available: <span class="">{{ available }}</span>
      </div>
      <div class="flex justify-between gap-4 mt-4">
        <NuxtLink
          target="_blank"
          to="https://www.coinstore.com/#/spot/RDTUSDT"
          class="coinBtn w-1/2 h-10 text-base flex items-center justify-center"
        >
          Go to Coinstore
        </NuxtLink>
        <button class="w-1/2 h-10 text-base buyTokensBtn" @click="showBuyModal = true">
          Buy Tokens
        </button>
      </div>
      <button
        :class="!buyModalLoading ? 'buyTicketBtn' : 'bg-[#9747FF] rounded-[12px]'"
        class="w-full mt-4 h-14 text-base relative"
        @click="$emit('buy', sortedData)"
      >
        Buy Ticket
        <span v-if="buyModalLoading" class="loader absolute right-[38%]" />
      </button>
      <div v-if="succesfullyBought" class="text-sm mt-2" style="color: #FFDC7E;">
        You have succesfully bought 4 tickets.
      </div>
    </div>
    <div class="overflow-hidden transition-all basis-1/2">
      <div class="block md:hidden">
        <div class="flex  gap-4">
          <div class="basis-2/4 p-4 rounded-xl border-2 border-[#424245]">
            <div class="text-sm">
              Token
            </div>
            <div class="flex">
              <div class="mr-2">
                <img alt="token icon" :src="`/tokens/${tokenSymbol}.svg`">
              </div>
              <div class="uppercase">
                {{ tokenSymbol }}
              </div>
            </div>
          </div>
          <div class="basis-2/4 p-4 rounded-xl border-2 border-[#424245]">
            <div class="text-sm">
              Lottery Type
            </div>
            <div class="font-semibold">
              {{ subtitle }}
            </div>
          </div>
        </div>
        <!-- Tickets counter MOBILE -->
        <LotteryTicketCounter
          :tickets-quantity="tickets.length"
          @remove-ticket="ticketsCount > 0 ? ticketsCount-- : ''"
          @add-ticket="ticketsCount++"
          @max-tickets="ticketsCount = maxTickets"
        />
        <!-- End tickets counter -->

        <!-- Package -->
        <div class=" mt-6 ">
          <div class="justify-between pb-2">
            <div class="font-semibold text-lg pb-2">
              Package
            </div>
            <div>Buy more to get more discount for up to %20</div>
          </div>
          <div class="flex gap-2">
            <button class="w-full h-12 " :class="(tickets.length >= 5 && tickets.length < 10) ? '' : 'opacity-50'">
              <div class="bg-[#9E68FF] rounded-t-xl text-sm">
                Save 5% {{ tickets.length }}
              </div>
              <div class="bg-[#38333F] rounded-b-xl">
                5
              </div>
            </button>
            <button class="w-full h-12 " :class="(tickets.length >= 10 && tickets.length < 20) ? '' : 'opacity-50'">
              <div class="bg-[#9E68FF] rounded-t-xl text-sm">
                Save 10%
              </div>
              <div class="bg-[#38333F] rounded-b-xl">
                10
              </div>
            </button>
            <button class="w-full h-12 " :class="(tickets.length >= 20) ? '' : 'opacity-50'">
              <div class="bg-[#9E68FF] rounded-t-xl text-sm">
                Save 20%
              </div>
              <div class="bg-[#38333F] rounded-b-xl">
                20
              </div>
            </button>
          </div>
        </div>
        <!-- End Package -->
      </div>

      <div
        ref="scrollContainer"
        class="tickets flex max-h-[577px] overflow-y-auto flex-col gap-4 mt-[16px] md:mt-[0px]"
      >
        <LotteryTicket
          v-for="(ticket, index) of sortedData"
          :key="index"
          :ticket-index="index"
          :ticket="ticket.ticket"
          :numbers="ticket.choosenNumbers"
          :active-ticket="activeTicket === index"
          @delete="(e) => del(e)"
          @random="(e) => randomTicket(e)"
          @set-active-ticket="(e) => activateTicket(e)"
          @choose-number="(e) => chooseNumber(e)"
        />
      </div>
      <button class="addBtn w-full mt-4 p-3" @click="addTicket">
        Add Ticket
      </button>
      <LotteryLatestDrawsPagination
        :data="tickets"
        :filter="10"
        :last="Math.ceil(tickets.length / 10)"
        @filter-elements="(e) => filterElements(e)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref, watch, computed } from 'vue'
import { useLottery } from '../../../composables/useLottery'
import { useMenu } from '~/composables/useMenu'
export default {
  props: {
    amount: {
      type: Number,
      requried: false,
      default: 0
    },
    tokenSymbol: {
      type: String,
      required: false,
      default: 'usdt'
    },
    token: {
      type: String,
      required: false,
      default: 'usdt'
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    },
    discount: {
      type: Number,
      required: false,
      default: 0
    },
    total: {
      type: Number,
      required: false,
      default: 0
    },
    available: {
      type: Number,
      required: false,
      default: 0
    },
    tickets: {
      type: Array as PropType<any>,
      default: () => []
    }
  },
  emits: ['delete', 'refresh', 'add', 'chooseNumber', 'filterElements', 'buy'],
  setup(props, { emit }) {
    const tooltip = ref(false)
    const ticketsCount = ref<number>(0)
    const maxTickets = ref<number>(10)
    const menuActiveItem = ref<number>(0)
    const activeTicket = ref<number>(-1)
    const sortedData = ref(props.tickets.slice(0, 9))
    const position = ref<number>(0)
    const activeSubscribe = ref<number>(2)
    const active = ref(false)
    const scrollContainer = ref()
    const { showBuyModal } = useMenu()
    const { ticketsModal, buyModalLoading, succesfullyBought } = useLottery()

    const scrollToBottom = () => {
      const container = scrollContainer.value
      container.scrollTop = container.scrollHeight
    }

    const activateTicket = (el) => {
      activeTicket.value = el
    }

    const filterElements = (el) => {
      sortedData.value = el.data
      position.value = el.position
    }

    const chooseNumber = (el) => {
      emit('chooseNumber', { el, ticket: activeTicket.value })
      activeTicket.value = -1
    }

    const del = (el) => {
      sortedData.value.splice(el, 1)
      ticketsCount.value--
      emit('delete', el)
    }

    const resolveDiscount = computed(() => {
      if (props.tickets.length >= 5 && props.tickets.length < 10) {
        return Math.round(props.tickets.length * 0.05)
      } else if (props.tickets.length >= 10 && props.tickets.length < 20) {
        return Math.round(props.tickets.length * 0.1)
      } else if (props.tickets.length >= 20) {
        return Math.round(props.tickets.length * 0.2)
      }
      return 0
    })

    const addTicket = () => {
      emit('add', ticketsCount.value + 1)
      ticketsCount.value++
      position.value === 0 ? sortedData.value = props.tickets.slice(0, 10) : sortedData.value = props.tickets.slice(position.value * 10, position.value * 10 + 10)
      setTimeout(() => {
        scrollToBottom()
      })
    }

    const randomTicket = (e) => {
      for (let u = 0; u < 6; u++) {
        activateTicket(e)
        chooseNumber({ activeNumber: u, chooseNumber: Math.floor(Math.random() * 10) })
      }
    }

    const randomTickets = () => {
      for (let i = 0; i < props.tickets.length; i++) {
        for (let u = 0; u < 6; u++) {
          activateTicket(i)
          chooseNumber({ activeNumber: u, chooseNumber: Math.floor(Math.random() * 10) })
        }
      }
    }

    watch(() => ticketsCount.value, () => {
      emit('add', ticketsCount.value)
      position.value === 0 ? sortedData.value = props.tickets.slice(0, 10) : sortedData.value = props.tickets.slice(position.value * 10, position.value * 10 + 10)
    })

    return {
      ticketsCount,
      maxTickets,
      activeTicket,
      tooltip,
      scrollContainer,
      menuActiveItem,
      sortedData,
      filterElements,
      randomTickets,
      randomTicket,
      activateTicket,
      chooseNumber,
      del,
      addTicket,
      active,
      activeSubscribe,
      resolveDiscount,
      showBuyModal,
      buyModalLoading,
      succesfullyBought,
      ticketsModal
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-switch__check) {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #1C1B1F;
}

:deep(.pagination-btn:hover) {
  border-color: #9747FF;
}

:deep(.o-switch__check--checked) {
  background: #6600FF;
}

.subBtn {
  transition-duration: .1s;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid #FF6600;
  }
}

.title {
  @apply text-xl font-semibold;
}

.randomBtn {
  transition-duration: .1s;

  path {
    transition-duration: .1s;
    fill: #9E68FF;
  }
}

.randomBtn:hover {
  path {
    fill: white
  }
}

.btnCounter {
  background-color: #38333F;
  border: 1px solid #38333F;
  transition-duration: .1s;

  &:hover {
    border: 1px solid white;

  }
}

.btnMaxCounter {
  background-color: #FF6600;
  border: 1px solid #FF6600;
  transition-duration: .1s;

  &:hover {
    background-color: white;
    color: #FF6600;
    border: 1px solid #FF6600;

  }
}

.coinBtn {
  background-color: transparent;
  border: 1px solid #9E68FF;
  border-radius: 12px;
  padding: 5px;
  color: white;
  font-size: 20px;
  font-weight: 500;
  transition: 0.4s;

  &:hover {
    background-color: white;
    color: #9E68FF;
  }
}

.addBtn {
  background-color: #9747FF;
  border-radius: 12px;
  padding: 5px;
  color: white;
  font-size: 20px;
  font-weight: 500;
  transition: 0.4s;

  &:hover {
    background-color: white;
    color: #9747FF;
  }
}

.buyTicketBtn {
  background-color: #9747FF;
  border-radius: 12px;
  padding: 5px;
  color: white;
  font-size: 20px;
  font-weight: 500;
  transition: 0.4s;

  &:hover {
    background-color: white;
    color: #9747FF;
  }

}

.buyTokensBtn {
  background-color: #FF6600;
  border-radius: 12px;
  padding: 5px;
  color: white;
  font-size: 20px;
  font-weight: 500;
  transition: 0.4s;
  border: 1px solid #FF6600;

  &:hover {
    background-color: white;
    color: #FF6600;
  }
}

.total {
  height: 50px;
  width: 100%;
  border: 1px solid;
  border-radius: 12px;
}

.loader {
  margin-top: 3px;
  width: 20px;
  height: 20px;
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
