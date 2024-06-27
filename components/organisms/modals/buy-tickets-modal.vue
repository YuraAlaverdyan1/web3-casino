<template>
  <ModalsBaseModal :active="active" :buy-tickets="true" @closed="close">
    <div class="px-[16px] pt-[16px] pb-[50px] md:p-[40px]">
      <div class="top-4 flex w-full justify-between">
        <div class="text-[20px] font-[700] text-white">
          Lottery Ticket
        </div>
        <div
          class="absolute top-[26px] right-[16px] md:right-[26px] md:top-[45px] scale-100 hover:scale-[1.03] transition-all cursor-pointer"
        >
          <img alt="close" src="/images/nav/close.svg" class="w-[16px] h-[16px]" @click="close">
        </div>
      </div>
      <div class="mt-[41px]">
        <LotteryBuy
          :token="'busd'"
          :subtitle="'10K DAILY'"
          :amount="amount"
          :token-symbol="tokenSymbol"
          :tickets="addedTickets"
          class="buy-tickets"
          :is-small="isSmall"
          @add="(e) => addTicket(e)"
          @refresh="(e) => refresh(e)"
          @delete="(e) => del(e)"
          @choose-number="(e) => chooseNumber(e)"
          @buy="(e) => buy(e)"
        />
      </div>
    </div>
  </ModalsBaseModal>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useLottery } from '../../../composables/useLottery'
export default {
  props: {
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    isSmall: {
      type: Boolean,
      requred: false,
      default: false
    }
  },
  emits: ['close'],
  setup(_props, { emit }) {
    const amount = ref<number>(5)
    const tokenSymbol = ref<string>('USDT')
    const addedTickets = ref<Array<any>>([])
    const activeTicket = ref<number>(-1)
    const { buyModalLoading, succesfullyBought } = useLottery()
    const activateTicket = (el) => {
      activeTicket.value = el
    }

    const addTicket = (el) => {
      if (el > addedTickets.value.length) {
        for (let i = 0; i < el - addedTickets.value.length; i++) {
          const Ticket = addedTickets.value.length > 0 ? addedTickets.value[addedTickets.value.length - 1].ticket : ''
          const filtered = Ticket.replace('0', '')
          const last = addedTickets.value.length !== 0 ? `${+filtered + 1}` : '0001'
          let ticket = ''

          for (let j = 0; j < 4 - last.length; j++) {
            ticket += 0
          }

          ticket += last

          const el = {
            ticket,
            choosenNumbers: [1, 2, 3, 4, 5, 6]
          }

          addedTickets.value.push(el)
        }
      } else if (el < addedTickets.value.length) {
        addedTickets.value.pop()
      }
    }

    const chooseNumber = (e) => {
      addedTickets.value[e.ticket].choosenNumbers[e.el.activeNumber] = e.el.chooseNumber
    }

    const buy = (e) => {
      if (e.length) {
        buyModalLoading.value = true
        setTimeout(() => {
          buyModalLoading.value = false
          succesfullyBought.value = true
        }, 1000)
      }
    }

    const refresh = (index) => {
      addedTickets.value[index].choosenNumbers = [1, 2, 3, 4, 5, 6]
    }

    const del = (index) => {
      addedTickets.value.splice(index, 1)
    }

    const close = () => {
      emit('close')
    }

    return {
      amount,
      tokenSymbol,
      addedTickets,
      addTicket,
      del,
      buy,
      refresh,
      activeTicket,
      activateTicket,
      close,
      chooseNumber
    }
  }
}
</script>

<style lang="scss" scoped></style>
