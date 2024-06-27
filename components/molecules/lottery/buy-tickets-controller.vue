<template>
  <div>
    <!-- BUY TICKET -->
    <div class="flex text-white gap-4">
      <div class="basis-2/4 p-2 rounded-xl border-2 border-[#424245]">
        <div class="text-sm">
          Token
        </div>
        <div class="flex">
          <div class="mr-2">
            <img :src="`/tokens/busd.png`">
          </div>
          <div>BUSD</div>
        </div>
      </div>
      <div class="basis-2/4 p-2 rounded-xl border-2 border-[#424245]">
        <div class="text-sm">
          Lottery Type
        </div>
        <div class="font-semibold">
          10K DAILY
        </div>
      </div>
    </div>
    <!-- Tickets counter -->
    <div class="text-white mt-6 text-xs">
      <div class="flex justify-between pb-2">
        <div>Amount</div>
        <div>5 USDT</div>
      </div>
      <div class="flex gap-2">
        <button
          class="bg-[#38333F] rounded-xl w-full h-12 "
          @click="ticketsCount > 0 ? ticketsCount-- : ''"
        >
          -
        </button>
        <button class="border-2 border-[#9E68FF] border- rounded-xl w-full h-12">
          {{ ticketsCount
          }}
        </button>
        <button
          class="bg-[#38333F] rounded-xl w-full h-12 "
          @click="ticketsCount < maxTickets ? ticketsCount++ : ''"
        >
          +
        </button>
        <button class="bg-[#FF6600] rounded-xl w-full h-12 " @click="ticketsCount = maxTickets">
          Max
        </button>
      </div>
    </div>
    <!-- End tickets counter -->

    <!-- Package -->
    <div class="text-white mt-6 ">
      <div class="justify-between pb-2">
        <div class="font-semibold">
          Package
        </div>
        <div>Buy more to get more discount for up to %20</div>
      </div>
      <div class="flex gap-2">
        <button class="w-full h-12 ">
          <div class="bg-[#9E68FF] rounded-t-xl text-sm">
            Save 5%
          </div>
          <div class="bg-[#38333F] rounded-b-xl">
            5
          </div>
        </button>
        <button class="w-full h-12 ">
          <div class="bg-[#9E68FF] rounded-t-xl text-sm">
            Save 10%
          </div>
          <div class="bg-[#38333F] rounded-b-xl">
            10
          </div>
        </button>
        <button class="w-full h-12 ">
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
</template>

<script lang="ts">
import { PropType, ref, watch } from 'vue'
export default {
  props: {
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    tokenSymbol: {
      type: String,
      required: true,
      default: ''
    },
    tickets: {
      type: Array as PropType<any>,
      default: () => []
    }
  },
  emits: ['delete', 'refresh', 'add', 'chooseNumber', 'filterElements'],
  setup(props, { emit }) {
    const ticketsCount = ref<number>(0)
    const maxTickets = ref<number>(10)
    const menuActiveItem = ref<number>(0)
    const activeTicket = ref<number>(-1)
    const sortedData = ref(props.tickets.slice(0, 9))
    const position = ref<number>(0)

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
      emit('delete', el)
    }

    const addTicket = () => {
      emit('add', ticketsCount.value + 1)
      ticketsCount.value++
      position.value === 0 ? sortedData.value = props.tickets.slice(0, 10) : sortedData.value = props.tickets.slice(position.value * 10, position.value * 10 + 10)
    }

    watch(() => ticketsCount.value, () => {
      emit('add', ticketsCount.value)
      position.value === 0 ? sortedData.value = props.tickets.slice(0, 10) : sortedData.value = props.tickets.slice(position.value * 10, position.value * 10 + 10)
    })

    return {
      ticketsCount,
      maxTickets,
      activeTicket,
      menuActiveItem,
      sortedData,
      filterElements,
      activateTicket,
      chooseNumber,
      del,
      addTicket
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-switch__check) {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #1C1B1F;
}

:deep(.o-switch__check--checked) {
  background: #1FC0F0;
}

.title {
  @apply text-white text-xl font-semibold;
}

.total {
  height: 50px;
  width: 100%;
  border: 1px solid;
  border-radius: 12px;
}</style>
