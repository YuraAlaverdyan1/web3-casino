import { createGlobalState } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
import { useSound } from '../useSound'
import { useGameStatus } from '../useGameStatus'
import { PlayableGame } from '~/composables/useMiniGames'
import { resolveGame } from '~/utils/web3/resolveGame'
import { useWeb3 } from '~/composables/useWeb3'
import { useWalletConnect } from '~/composables/useWalletConnect'
import videoPokerGQL from '~/queries/videoPoker.gql'
import videoPokerABI from '~/data/web3/abi/VideoPoker.json'
import winCombinations from '~/data/games/video-poker/win-combinations.json'

export const useVideoPoker = createGlobalState(() => {
  const hand = ref<any>([{}, {}, {}, {}, {}])
  const { isDisabledSound } = useSound()
  const { gameStatus } = useGameStatus()
  const {
    executeTransaction,
    allowance,
    toWei,
    MAX_APPROVE_VAL,
    approve,
    web3Contract
  } = useWeb3()
  const { account } = useWalletConnect()
  const status = ref<string>('')
  const selectedHand = ref<boolean[]>([true, true, true, true, true])
  const winSound:HTMLAudioElement = new Audio('~/public/sounds/video-poker/win.wav')
  const loseSound:HTMLAudioElement = new Audio('~/public/sounds/video-poker/lose.wav')
  const resultSound:HTMLAudioElement = new Audio('~/public/sounds/video-poker/result.mp3')
  const playSound:HTMLAudioElement = new Audio('~/public/sounds/video-poker/play.wav')
  const contractAddress = computed(() => resolveGame('video-poker'))
  const combination = ref<string>('')
  const contract = computed(() => web3Contract(getAbi(), contractAddress.value))
  const multiplier = ref()

  const startGame = async (options: PlayableGame) => {
    if (!isDisabledSound.value) {
      playSound.play()
    }
    gameStatus.value = {
      text: 'Waiting for wallet confirmation',
      color: 'yellow'
    }
    const { wager, token } = options

    const value = await allowance(token, contractAddress.value)

    if (value < +wager) {
      await approve(token, contractAddress.value, MAX_APPROVE_VAL)
    }
    try {
      await executeTransaction({
        account: account.value.address,
        contractAddress: contractAddress.value,
        functionName: 'VideoPoker_Start',
        abi: videoPokerABI,
        params: [toWei(wager), token]
      })
      gameStatus.value = {
        text: 'Blockchain confirmation successful',
        color: 'green'
      }
    } catch (error) {
      console.error(error, 'error')
      gameStatus.value = { text: 'Wallet Access Denied', color: 'red' }
    }
  }

  const replaceCards = async (claim) => {
    if (!isDisabledSound.value) {
      playSound.play()
    }
    let response
    try {
      response = await executeTransaction({
        account: account.value.address,
        contractAddress: contractAddress.value,
        functionName: 'VideoPoker_Replace',
        abi: videoPokerABI,
        params: [claim ? [false, false, false, false, false] : selectedHand.value.map(elm => !elm)]
      })
      if (claim) {
        status.value = ''
        gameStatus.value = {
          text: 'Tokens claimed successful',
          color: 'green'
        }
        hand.value = [{}, {}, {}, {}, {}]
      } else {
        gameStatus.value = {
          text: 'Blockchain confirmation successful',
          color: 'green'
        }
        const result = await determineHandPayout()
        setCombination(Number(result[1]))
      }
    } catch (error) {
      console.error(error, 'error')
      gameStatus.value = { text: 'Wallet Access Denied', color: 'red' }
    }

    return response
  }

  const getAbi = () => {
    return videoPokerABI
  }

  const getGql = () => {
    return videoPokerGQL
  }

  const play = async (options) => {
    return await startGame(options)
  }

  const replace = async (claim = false) => {
    return await replaceCards(claim)
  }

  const determineHandPayout = async () => {
    let result
    try {
      if (hand.value[0].number) {
        result = await contract.value.read._determineHandPayout([hand.value])
      }
    } catch (e) {
      console.error(e)
    }
    return result
  }

  const setCombination = (index) => {
    if (!isDisabledSound.value) {
      resultSound.play()
    }
    if (index > 0) {
      if (!isDisabledSound.value) {
        winSound.play()
      }
      combination.value = Object.keys(winCombinations).reverse()[index - 1]
    } else {
      if (!isDisabledSound.value) {
        loseSound.play()
      }
      combination.value = 'No Combination'
    }
  }

  const checkIsGameExists = async () => {
    let result
    try {
      if (account.value.address) {
        result = await contract.value.read.VideoPoker_GetState([account.value.address])
      }
    } catch (e) {
      console.error(e)
    }
    return result
  }

  const getCurrentHand = async () => {
    let currentHand
    try {
      currentHand = await contract.value.read.viewResult([account.value.address])
    } catch (e) {
      console.error(e)
    }
    return currentHand
  }

  const setActiveStep = async (props) => {
    const { selectedToken, valueBet, getSmartcontractAddress, unclaimTokens, lastWon, lastResults, totalWinnings, gameScore, finishGame, playTheGame, autoClaim } = props
    if (!status.value) {
      play({
        token: selectedToken.value.token,
        wager: valueBet.value
      }).then(() => {
        if (
          typeof gameStatus.value !== 'string' &&
              gameStatus.value.text === 'Wallet Access Denied'
        ) {
          return
        }
        const address = getSmartcontractAddress()
        const contract = web3Contract(getAbi(), address)
        let value
        const interv = setInterval(async () => {
          if (
            typeof gameStatus.value !== 'string' &&
                gameStatus.value.text === 'Wallet Access Denied'
          ) {
            clearInterval(interv)
            return
          }
          try {
            unclaimTokens.value = 'waiting'
            value = await contract.read.viewResult([account.value.address])
          } catch (e) {
            gameStatus.value = {
              text: 'Waiting for Random Number',
              color: 'yellow'
            }
          }
          if (value) {
            clearInterval(interv)
            status.value = 'Redraw Cards'
            gameStatus.value = { text: 'Random Number Received', color: 'green' }
            hand.value = value
            const result = await determineHandPayout()
            unclaimTokens.value = Number(result[0]) * valueBet.value
            setCombination(Number(result[1]))
          }
        }, 2000)
      })
    } else if (
      (status.value === 'Cash Out' || status.value === 'End Game')
    ) {
      const result = await determineHandPayout()
      multiplier.value = `${Number(result[0])}x`
      const balance = Number(result[0]) * valueBet.value
      lastWon.value = balance
      unclaimTokens.value = balance
      lastResults.value = [balance]
      if (totalWinnings.value.length < gameScore.value) {
        totalWinnings.value = [...totalWinnings.value, balance]
      }
      if (result) {
        await replace(true)
      }
      finishGame()
    } else {
      playTheGame(autoClaim)
    }
  }

  watch(() => selectedHand.value, () => {
    if (selectedHand.value.includes(false) && status.value === 'Cash Out') {
      status.value = 'Redraw Cards'
    }
  }, { deep: true })

  return {
    hand,
    selectedHand,
    status,
    combination,
    multiplier,
    play,
    getGql,
    getAbi,
    replace,
    determineHandPayout,
    setCombination,
    checkIsGameExists,
    getCurrentHand,
    setActiveStep
  }
})
