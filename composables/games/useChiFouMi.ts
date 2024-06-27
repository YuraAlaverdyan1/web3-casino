import { createGlobalState } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
import { useGameStatus } from '../useGameStatus'
import { useSound } from '../useSound'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { PlayableGame } from '~/composables/useMiniGames'
import { useWeb3 } from '~/composables/useWeb3'
import chiFouMiABI from '~/data/web3/abi/ChiFouMi.json'
import chiFouMiGql from '~/queries/chiFouMi.gql'
import hands from '~/data/hands.json'
import { chiFouMiAnimation, chiFouMiLoopedAnimation } from '~/utils/helpers'
import { resolveGame } from '~/utils/web3/resolveGame'

export const useChiFouMi = createGlobalState(() => {
  const hand = ref(0)
  const first = ref(true)
  let timeline
  // eslint-disable-next-line no-undef
  const { $gsap: gsap } = useNuxtApp()
  const playingSound = new Audio('~/public/sounds/chi-fou-mi/chifoumi_play.mp3')
  const winSound:HTMLAudioElement = new Audio('~/public/sounds/chi-fou-mi/chifoumi_win.mp3')
  const loseSound:HTMLAudioElement = new Audio('~/public/sounds/chi-fou-mi/chifoumi_lose.mp3')
  const resultSound:HTMLAudioElement = new Audio('~/public/sounds/chi-fou-mi/chifoumi_result.mp3')
  const actionSounds:HTMLAudioElement[] = [new Audio('~/public/sounds/chi-fou-mi/chifoumi_select_rock.mp3'), new Audio('~/public/sounds/chi-fou-mi/chifoumi_select_paper.wav'), new Audio('~/public/sounds/chi-fou-mi/chifoumi_select_scissors.wav')]
  const selectHand = (newHand: number) => {
    hand.value = newHand
  }
  const { account } = useWalletConnect()
  const { gameStatus } = useGameStatus()
  const {
    executeTransaction,
    toWei,
    allowance,
    MAX_APPROVE_VAL,
    approve
  } = useWeb3()
  const isEndGame = ref(false)
  const playGame = ref(false)
  const { isDisabledSound } = useSound()
  const contractAddress = computed(() => resolveGame('chi-fou-mi'))

  const getAbi = () => {
    return chiFouMiABI
  }

  const getGql = () => {
    return chiFouMiGql
  }

  const chifoumiPlay = async (options: PlayableGame) => {
    if (!isDisabledSound.value) {
      playingSound.play()
    }
    gameStatus.value = {
      text: 'Waiting for wallet confirmation',
      color: 'yellow'
    }
    const { wager, token, numOfBets } = options

    let response
    try {
      const value = await allowance(token, contractAddress.value)
      if (value < +wager) {
        await approve(token, contractAddress.value, MAX_APPROVE_VAL)
      }
      response = await executeTransaction({
        account: account.value.address,
        contractAddress: contractAddress.value,
        functionName: 'play',
        abi: chiFouMiABI,
        params: [toWei(wager), token, hand.value, numOfBets]
      })
      timeline = gsap.timeline()
      chiFouMiLoopedAnimation(gsap, timeline)
    } catch (err) {
      console.error(err)
      throw new Error(err.message)
    }
    gameStatus.value = {
      text: 'Blockchain confirmation successful',
      color: 'green'
    }
    return response
  }

  const play = async (options: PlayableGame) => {
    return await chifoumiPlay(options)
  }

  const endGameAnimation = (secondHand, status) => {
    chiFouMiAnimation(gsap, secondHand, status, timeline)
  }

  const getSecondHandIndex = (status: string):number => {
    return +Object.keys(hands[hand.value]).find(key => hands[hand.value][key] === status)!
  }

  watch(
    () => hand.value,
    () => {
      if (!isDisabledSound.value) {
        actionSounds[hand.value]?.play()
      }
    }
  )

  return {
    isEndGame,
    playGame,
    getAbi,
    getGql,
    play,
    selectHand,
    hand,
    first,
    winSound,
    loseSound,
    resultSound,
    getSecondHandIndex,
    endGameAnimation
  }
})
