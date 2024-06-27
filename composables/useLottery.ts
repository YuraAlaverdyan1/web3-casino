import { createGlobalState } from '@vueuse/core'
import { ref, watch } from 'vue'

export enum Lottery {
  Lottery = 'Lottery'
}

export const useLottery = createGlobalState(() => {
  const ticketsModal = ref({
    active: false,
    lottery: ''
  })
  const myTicketsModal = ref({
    active: false,
    round: ''
  })
  const buyModalLoading = ref(false)
  const succesfullyBought = ref(false)

  watch(() => ticketsModal.value.active, () => {
    if (!ticketsModal.value.active) {
      succesfullyBought.value = false
    }
  })
  return {
    ticketsModal,
    buyModalLoading,
    succesfullyBought,
    myTicketsModal
  }
})
