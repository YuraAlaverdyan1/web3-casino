import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useToTheMoon = createGlobalState(() => {
  const fuelCount = ref<number>(2)

  const addFuel = () => {
    if (fuelCount.value < 8) {
      fuelCount.value++
    }
  }

  const setFuelCount = (count:number) => {
    fuelCount.value = count - 1
  }

  // GLOBAL Interface for Minigames
  function play() {
    return addFuel()
  }

  return {
    fuelCount,
    setFuelCount,
    play
  }
})
