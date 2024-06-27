import { createGlobalState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useGameStatus } from '../useGameStatus'
import { useSound } from '../useSound'
import wheelABI from '~/data/web3/abi/Wheel.json'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { PlayableGame } from '~/composables/useMiniGames'
import { useWeb3 } from '~/composables/useWeb3'
import wheelsGraphql from '~/queries/wheels.gql'
import { resolveGame } from '~/utils/web3/resolveGame'

export const useWheel = createGlobalState(() => {
  const { account } = useWalletConnect()
  const { gameStatus } = useGameStatus()
  const flipSound = new Audio('/sounds/wheel/wheel_play.mp3')
  const {
    executeTransaction,
    toWei,
    allowance,
    MAX_APPROVE_VAL,
    approve,
    web3Contract
  } = useWeb3()
  const isEndGame = ref(false)
  const playGame = ref(false)
  const { isDisabledSound } = useSound()
  const contractAddress = computed(() => resolveGame('wheel'))

  const spin = async (options: PlayableGame) => {
    if (!isDisabledSound.value) {
      flipSound.play()
    }
    gameStatus.value = {
      text: 'Waiting for wallet confirmation',
      color: 'yellow'
    }
    const { wager, token, numOfBets } = options

    const value = await allowance(token, contractAddress.value)
    if (value < +wager * numOfBets) {
      await approve(token, contractAddress.value, MAX_APPROVE_VAL)
    }

    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: contractAddress.value,
      functionName: 'spin',
      abi: getAbi(),
      params: [token, toWei(wager), numOfBets]
    })

    gameStatus.value = {
      text: 'Blockchain confirmation successful',
      color: 'green'
    }
    return response
  }

  const getMultipleNumber = async (index: number): Promise<number> => {
    const contract = web3Contract(wheelABI, contractAddress.value)
    const multiplier = await contract.read.multiplierArray([index])
    return Number(multiplier)
  }

  const getAbi = () => {
    return wheelABI
  }

  const getGql = () => {
    return wheelsGraphql
  }

  const play = async (options: PlayableGame) => {
    return await spin(options)
  }

  return {
    isEndGame,
    playGame,
    getAbi,
    getGql,
    play,
    getMultipleNumber
  }
})
