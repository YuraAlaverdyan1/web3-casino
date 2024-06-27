import { createGlobalState } from '@vueuse/core'
import { computed } from 'vue'
import { useGameStatus } from '../useGameStatus'
import { useSound } from '../useSound'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { PlayableGame } from '~/composables/useMiniGames'
import { useWeb3 } from '~/composables/useWeb3'
import slidedices from '~/queries/slidedice.gql'
import slidediceABI from '~/data/web3/abi/slidedice.json'
import { resolveGame } from '~/utils/web3/resolveGame'

export const useSlidedice = createGlobalState(
  () => {
    const dicePlay = new Audio('~/public/sounds/slidedice/dice_play.wav')
    const { account } = useWalletConnect()
    const { gameStatus } = useGameStatus()
    const { isDisabledSound } = useSound()
    const {
      executeTransaction,
      toWei,
      allowance,
      MAX_APPROVE_VAL,
      approve

    } = useWeb3()

    async function roll(options: PlayableGame) {
      if (!isDisabledSound.value) {
        dicePlay.play()
      }
      gameStatus.value = { text: 'Waiting for wallet confirmation', color: 'yellow' }
      const { wager, token, numOfBets, isOver, multiplier, valueMultiple } = options
      const multiplierValue = Math.round(multiplier * 10000)
      const activeContractAddress = computed(() => resolveGame('slidedice'))

      const value = await allowance(
        token,
        activeContractAddress.value
      )
      if (value < +wager * valueMultiple) {
        await approve(
          token,
          activeContractAddress.value,
          MAX_APPROVE_VAL
        )
      }
      const response = await executeTransaction({
        account: account.value.address,
        contractAddress: activeContractAddress.value,
        functionName: 'roll',
        abi: slidediceABI,
        params: [toWei(wager), token, multiplierValue, isOver, numOfBets]
      })
      gameStatus.value = { text: 'Blockchain confirmation successful', color: 'green' }
      return response
    }

    // GLOBAL Interface for Minigames

    async function play(options: PlayableGame) {
      return await roll(options)
    }

    function getAbi() {
      return slidediceABI
    }

    function getGql() {
      return slidedices
    }

    return {
      play,
      getAbi,
      getGql
    }
  }
)
