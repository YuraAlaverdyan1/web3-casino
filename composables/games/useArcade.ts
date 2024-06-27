import { ref, computed } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { PlayableGame } from '../useMiniGames'
import { useWalletConnect } from '../useWalletConnect'
import { useWeb3 } from '../useWeb3'
import { useSound } from '../useSound'
import slotsABI from '~/data/web3/abi/Slots.json'
import slots from '~/queries/slots.gql'
import { resolveGame } from '~/utils/web3/resolveGame'

export const multipliers = [
  5, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  10, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 100
]

export const useArcade = createGlobalState(() => {
  const {
    executeTransaction,
    toWei,
    allowance,
    MAX_APPROVE_VAL,
    approve
  } = useWeb3()
  const gameElements = ref(15)
  const gameTime = ref(3000)
  const gameImage1 = '/games/arcade/packman-icon.webp'
  const gameImage2 = '/games/arcade/gameboy-icon.webp'
  const gameImage3 = '/games/arcade/disket-icon.webp'
  const gameImage4 = '/games/arcade/joystick-icon.webp'
  const gameImage5 = '/games/arcade/rubik-icon.webp'
  const gameImage6 = '/games/arcade/gadget-icon.webp'
  const playSound = new Audio('~/public/sounds/arcade/arcade_play.mp3')
  const { isDisabledSound } = useSound()
  const activecontractAddress = computed(() => resolveGame('arcade'))

  const winTable = ref([
    { winText: '100x', winImages: [gameImage1, gameImage1, gameImage1] },
    { winText: '45x', winImages: [gameImage2, gameImage2, gameImage2] },
    { winText: '20x', winImages: [gameImage3, gameImage3, gameImage3], additionaImage: [gameImage1] },
    { winText: '12x', winImages: [gameImage4, gameImage4, gameImage4], additionaImage: [gameImage1] },
    { winText: '10x', winImages: [gameImage5, gameImage5, gameImage5], additionaImage: [gameImage1] },
    { winText: '5x', winImages: [gameImage6, gameImage6, gameImage6] },
    { winText: '3x', winImages: [gameImage6, gameImage6] },
    { winText: '2x', winImages: [gameImage6] }

  ])

  async function pull(options: PlayableGame) {
    if (!isDisabledSound.value) {
      playSound.play()
    }
    const { account } = useWalletConnect()

    const { wager, token, numOfBets } = options
    const value = await allowance(
      token,
      activecontractAddress.value
    )
    if (value < +wager) {
      await approve(
        token,
        activecontractAddress.value,
        MAX_APPROVE_VAL
      )
    }
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: activecontractAddress.value,
      functionName: 'pull',
      abi: slotsABI,
      params: [toWei(wager), token, numOfBets]
    })
    return response
  }

  // GLOBAL Interface for Minigames
  async function play(options: PlayableGame) {
    return await pull(options)
  }

  function getAbi() {
    return slotsABI
  }

  function getGql() {
    return slots
  }

  return {
    gameImage1,
    gameImage2,
    gameImage3,
    gameImage4,
    gameImage5,
    gameImage6,
    winTable: winTable.value,
    gameElements,
    gameTime,
    multipliers,
    play,
    getAbi,
    getGql
  }
})
