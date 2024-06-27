import { createGlobalState } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useGameStatus } from '../useGameStatus'
import coinflip from '~/data/web3/abi/Coinflip.json'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { PlayableGame } from '~/composables/useMiniGames'
import { useWeb3 } from '~/composables/useWeb3'
import coinFlips from '~/queries/coinFlips.gql'
import { useSound } from '~/composables/useSound'
import { resolveGame } from '~/utils/web3/resolveGame'

export const useCoinflip = createGlobalState(() => {
  const { account } = useWalletConnect()
  const { gameStatus } = useGameStatus()
  const flipSound = new Audio('~/public/sounds/coinflip/coinflip_play.mp3')
  const {
    executeTransaction,
    toWei,
    allowance,
    MAX_APPROVE_VAL,
    approve
  } = useWeb3()
  const side = ref(1)
  const isEndGame = ref(false)
  const playGame = ref(false)
  const disabledSiddSelect = ref(false)
  const { isDisabledSound } = useSound()

  watch(
    () => side.value,
    () => {
      if (!isDisabledSound.value) {
        new Audio('~/public/sounds/coinflip/coinflip_select.wav').play()
      }
    }
  )

  async function flip(options: PlayableGame) {
    if (!isDisabledSound.value) {
      flipSound.play()
    }
    gameStatus.value = {
      text: 'Waiting for wallet confirmation',
      color: 'yellow'
    }
    const { wager, token, numOfBets, valueMultiple } = options

    const contractAddress = computed(
      () =>
        resolveGame('coinflip')

    )
    const value = await allowance(token, contractAddress.value)
    if (value < +wager * valueMultiple) {
      await approve(token, contractAddress.value, MAX_APPROVE_VAL)
    }
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: contractAddress.value,
      functionName: 'flip',
      abi: coinflip,
      params: [toWei(wager), token, side.value, numOfBets]
    })
    gameStatus.value = {
      text: 'Blockchain confirmation successful',
      color: 'green'
    }
    return response
  }

  function changeSide(newValue: number) {
    if (!disabledSiddSelect.value) {
      disabledSiddSelect.value = true
      side.value = newValue
      setTimeout(() => {
        disabledSiddSelect.value = false
      }, 400)
    }
  }

  // GLOBAL Interface for Minigames
  function getAbi() {
    return coinflip
  }

  function getGql() {
    return coinFlips
  }

  function processResults(results) {
    return results.map(e => (e === BigInt(side.value) ? 1 : 0))
  }

  async function play(options) {
    return await flip(options)
  }

  return {
    side,
    changeSide,
    isEndGame,
    playGame,
    getAbi,
    getGql,
    processResults,
    play
  }
})
