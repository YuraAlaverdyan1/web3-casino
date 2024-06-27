<template>
  <div>
    <div class="flex justify-between default-text text-sm mt-4">
      <div>amount</div>
      <div>{{ amount }} {{ tokenSymbol }}</div>
    </div>
    <div class="flex gap-1">
      <StakingBtn :color="'#38333F'" :fill="true" class="w-full" @click="ticketsCount > 0 ? ticketsCount-- : ''">
        -
      </StakingBtn>
      <StakingBtn :color="'#38333F'" class="w-full">
        {{ ticketsCount }}
      </StakingBtn>
      <StakingBtn
        :color="'#38333F'"
        :fill="true"
        class="w-full"
        @click="ticketsCount < maxTickets ? ticketsCount++ : ''"
      >
        +
      </StakingBtn>
      <StakingBtn :color="'#FF6600'" :fill="true" :max="true" class="w-full" @click="ticketsCount = maxTickets">
        Max
      </StakingBtn>
    </div>
    <div class="flex gap-3 mt-4">
      <button :class="menuActiveItem === 0 ? 'active-item' : 'disabled-item'" @click="menuActiveItem = 0">
        Manual
      </button>
      <button :class="menuActiveItem === 1 ? 'active-item' : 'disabled-item'" @click="menuActiveItem = 1">
        Auto
      </button>
    </div>
    <div class="tickets flex flex-col gap-4">
      <LotteryTicket
        v-for="(ticket, index) of sortedData"
        :key="index"
        :ticket-index="index"
        :ticket="ticket.ticket"
        :numbers="ticket.choosenNumbers"
        :active-ticket="activeTicket === index"
        @delete="(e) => del(e)"
        @refresh="(e) => $emit('refresh', e)"
        @set-active-ticket="(e) => activateTicket(e)"
        @choose-number="(e) => chooseNumber(e)"
      />
    </div>
    <StakingBtn :color="'#9E68FF'" :fill="true" class="w-full mt-3" @click="addTicket">
      Add Ticket
    </StakingBtn>
    <LotteryLatestDrawsPagination
      :data="tickets"
      :filter="'10'"
      :last="Math.ceil(tickets.length / 10)"
      @filter-elements="(e) => filterElements(e)"
    />
  </div>
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
.active-item,
.disabled-item {
  font-weight: 600;
  font-size: 18px;
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.active-item {
  color: white;
  border-bottom: 1px solid white;
}

.disabled-item {
  color: #696B8C;
  border: none;
}
</style>
