import { createGlobalState } from '@vueuse/core'
import { ref, watch } from 'vue'

export const useGameStatus = createGlobalState(
  () => {
    const gameStatus = ref<string | { text: string, color: string }>('')

    watch(() => gameStatus.value, () => {
      if (gameStatus.value.color === 'red') {
        setTimeout(() => {
          gameStatus.value = ''
        }, 3000)
      } else if (gameStatus.value.color === 'green') {
        setTimeout(() => {
          gameStatus.value = ''
        }, 2000)
      }
    })
    return { gameStatus }
  }
)
