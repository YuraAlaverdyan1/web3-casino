import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const usePlinko = createGlobalState(() => {
  const ballsInGame = ref(0)
  const rows = ref(16)
  const multipliers = ref<number[]>([])
  const rule = ref<string>('hard')

  const incrementGamesRunning = (maxBalls) => {
    if (maxBalls > ballsInGame.value) {
      ballsInGame.value++
    }
  }

  const setRows = (row) => {
    rows.value = row
  }

  const addMultiplier = (multiplier) => {
    multipliers.value.push(multiplier)
  }

  const decrementGamesRunning = () => {
    if (ballsInGame.value > 0) {
      ballsInGame.value--
    }
  }

  const setRule = (newRule) => {
    rule.value = newRule
  }

  return {
    ballsInGame,
    rows,
    rule,
    multipliers,
    setRows,
    setRule,
    incrementGamesRunning,
    addMultiplier,
    decrementGamesRunning
  }
})
