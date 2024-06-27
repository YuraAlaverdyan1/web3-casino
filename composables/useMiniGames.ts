/* eslint-disable no-unused-vars */
import { utils } from 'web3'
import axios from 'axios'
import { ref, watch, computed, onMounted, reactive } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useWeb3 } from './useWeb3'
import { useGameStatus } from './useGameStatus'
import { useSound } from './useSound'
import { useSubgraph } from './useSubgraph'
import { useWalletConnect } from './useWalletConnect'
import { useLoading } from './useLoading'
import { useSlidedice } from './games/useSlidedice'
import { useChiFouMi } from './games/useChiFouMi'
import { useVideoPoker } from './games/useVideoPoker'
import { useCoinflip } from '~/composables/games/useCoinflip'
import { useWheel } from '~/composables/games/useWheel'
import { useMine } from '~/composables/games/useMine'
import { useArcade } from '~/composables/games/useArcade'
import { useToTheMoon } from '~/composables/games/useToTheMoon'
import gamesDetails from '~/data/ridotto-originals.json'
import failAudio from '~/public/sounds/fail.wav'
import { useAuth } from '~/store/useAuth'
import hands from '~/data/hands.json'
import { resolveGame } from '~/utils/web3/resolveGame'

export interface PlayableGame {
  wager: number
  token: string
  numOfBets?: number
  isOver?: boolean
  multiplier?: number
  valueMultiple?: number
}

export enum MiniGames {
  Coinflip = 'coinflip',
  Slidedice = 'slidedice',
  Pirates = 'pirates',
  Plinko = 'plinko',
  Wheel = 'wheel',
  Arcade = 'arcade',
  ChiFouMi = 'chi-fou-mi',
  VideoPoker = 'video-poker',
  Slide = 'slide',
  ToTheMoon = 'to-the-moon',
  Mine = 'mine'
}

export const useMiniGames = createGlobalState(() => {
  const { jwtToken } = useAuth()
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig()
  const route = useRoute()
  const currentGame = ref<MiniGames | undefined>(undefined)
  const currentGameDetails = ref<any>(null)
  const claimNow = ref(false)
  const liveBets = ref([])
  const lastResults = ref<any>([])
  const lastWon = ref(0)
  const multiplierInput = ref(1.98)
  const rollUnderInput = ref(50)
  const winChanceInput = ref(50)
  const isRevert = ref(false)
  const isPlaying = ref(false)
  const availableTokens = ref<any>([])
  const selectedToken = ref<{ token: string }>({ token: '' })
  const balance = ref(0)
  const max = ref(0)
  const valueBet = ref(0)
  const valueMultipleBet = ref(1)
  const unclaimTokens = ref<string | number>(0)
  const isRolling = ref<boolean>(false)
  const totalWinnings = ref<any>([])
  const gameScore = ref(0)
  const fastResult = ref(false)
  const minBet = ref(0)
  const isDisabledPlayBtn = ref(false)
  const { getAvailableTokens } = useSubgraph()
  const { account } = useWalletConnect()
  const { gameStatus } = useGameStatus()
  const { isDisabledSound } = useSound()
  const { loading } = useLoading()
  const {
    web3Contract,
    currentChain,
    executeTransaction,
    getTokenBalance,
    getSubgraph,
    format
  } = useWeb3()

  // ------------------ Games Composables ------------------
  const coinflipGlobalState = reactive(useCoinflip())
  const arcadeGlobalState = reactive(useArcade())
  const slideGlobalState = reactive(useSlidedice())
  const toTheMoonGlobalState = reactive(useToTheMoon())
  const chiFouMiGlobalState = reactive(useChiFouMi())
  const wheelGlobalState = reactive(useWheel())
  const mineGlobalState = reactive(useMine())
  const videoPokerGlobalState = reactive(useVideoPoker())
  const gameComposables = computed(() => {
    return {
      [MiniGames.Coinflip]: coinflipGlobalState,
      [MiniGames.Arcade]: arcadeGlobalState,
      [MiniGames.Slidedice]: slideGlobalState,
      [MiniGames.ChiFouMi]: chiFouMiGlobalState,
      [MiniGames.Wheel]: wheelGlobalState,
      [MiniGames.Mine]: mineGlobalState,
      [MiniGames.VideoPoker]: videoPokerGlobalState
    }
  })
  // ------------------ End Games Composables ------------------

  // ------------------ Games Definitions ------------------
  function getAbi() {
    if (currentGame.value) {
      return gameComposables.value[currentGame.value].getAbi()
    } else if (!route.path.includes('games')) {
      return coinflipGlobalState.getAbi()
    }

    throw new Error('No ABI found')
  }

  function getSubGraphLivebets() {
    return getSubgraph(currentGame.value, true)
  }

  function getSmartcontractAddress() {
    if (currentGame.value) {
      const contract = resolveGame(currentGame.value)
      if (contract) {
        return contract
      }
      throw new Error(`No smartcontract address found${currentGame.value}`)
    } else {
      return gamesDetails.games[0].contracts[config.public.appEnvConfig].network[56]
    }
  }

  function getQueryLiveBets() {
    if (currentGame.value) {
      return gameComposables.value[currentGame.value].getGql()
    }
    throw new Error('No query found')
  }

  function getDataLiveBets(data) {
    if (Object.keys(data)[0]) {
      return data[Object.keys(data)[0]].map((item) => {
        return {
          ...item,
          wager: format(item.wager),
          payOut: format(item.payOut)
        }
      })
    }
    throw new Error('No data live bets found')
  }

  function finishGame() {
    loadLiveBets()
  }

  const potencialWin = computed(() => {
    switch (currentGame.value) {
      case MiniGames.Wheel:
        return 10
      case MiniGames.Coinflip:
        return 1.95
      case MiniGames.Slidedice:
        return multiplierInput.value
      case MiniGames.ChiFouMi:
        return 1.98
      case MiniGames.VideoPoker:
        return 1
      case MiniGames.Arcade:
        return 100
      default:
        return 1
    }
  })

  const ctaText = computed(() => {
    if (claimNow.value) {
      return 'Claim'
    }

    switch (currentGame.value) {
      case MiniGames.Wheel:
        return 'Spin the Wheel'
      case MiniGames.Coinflip:
        return 'Flip Coin'
      case MiniGames.Slidedice:
        return 'Roll Now'
      case MiniGames.ChiFouMi:
        return 'Shoot'
      case MiniGames.Arcade:
        return 'Insert Coin'
      case MiniGames.Pirates:
        return 'Spin'
      case MiniGames.VideoPoker:
        if ((videoPokerGlobalState.status === 'Redraw Cards' || videoPokerGlobalState.status === 'Cash Out') && !videoPokerGlobalState.selectedHand.includes(false)) {
          videoPokerGlobalState.status = 'Cash Out'
          return 'Cash Out'
        }
        return videoPokerGlobalState.status || 'Bet'
      case MiniGames.Slide:
        return 'Roll the Slide'
      case MiniGames.ToTheMoon:
        return 'Booster Fuel'
      case MiniGames.Mine:
        return 'Reveal'
      default:
        return 'Play'
    }
  })

  // ------------------ End Games Definitions ------------------

  async function currentReqIds(abi, address) {
    const contract = web3Contract(abi, address)
    return await contract.read.currentReqIds([account.value.address])
  }

  async function viewResult(abi, address) {
    const contract = web3Contract(abi, address)
    if (currentGame.value === MiniGames.Mine) {
      return await contract.read.Mines_GetState([account.value.address])
    } else if (currentGame.value === MiniGames.VideoPoker) {
      return await contract.read.viewResult([account.value.address])
    } else {
      const reqId = await contract.read.currentReqIds([account.value.address])
      return await contract.read.viewResult([reqId])
    }
  }

  async function currentBalance(abi, address) {
    if (currentGame.value && typeof address === 'string') {
      if (currentGame.value === MiniGames.VideoPoker) {
        const result = await videoPokerGlobalState.determineHandPayout()
        if (result) {
          return Number(result[0]) * valueBet.value
        }
        return 0
      }
      if (currentGame.value === MiniGames.Mine) {
        return 0
      }
      const contract = web3Contract(abi, address)
      const reqId = await contract.read.currentReqIds([account.value.address])
      if (reqId > 0) {
        const balance = await contract.read.viewResult([reqId])
        if (currentGame.value !== MiniGames.Coinflip) {
          return Number(utils.fromWei(balance[2], 'ether'))
        } else {
          return Number(utils.fromWei(balance[3], 'ether'))
        }
      }
      return 0
    } else {
      return 0
    }
  }

  async function minWager(tokenAddress: string) {
    if (!tokenAddress || !currentGame.value) {
      return 0
    }
    const contractAddress = getSmartcontractAddress()
    const contract = web3Contract(getAbi(), contractAddress)
    const result = await contract.read.minTokenWagers([tokenAddress])
    return format(result)
  }

  async function kellyWager(
    abi,
    address,
    tokenAddress: string,
    mul?: any
  ) {
    if (currentGame.value) {
      const multiplier = mul ? parseInt(mul) : 0
      const contract = web3Contract(abi, address)

      let result
      if (multiplier) {
        result = await contract.read.kellyWager([tokenAddress, multiplier])
      } else if (currentGame.value === MiniGames.Mine) {
        const maxReveales = await contract.read.Mines_GetMaxReveal()
        result = await contract.read.kellyWager([tokenAddress, maxReveales[mineGlobalState.numMines], mineGlobalState.numMines])
      } else {
        result = await contract.read.kellyWager([tokenAddress])
      }
      if (!result) {
        return 0
      }
      const formatResult = Number(utils.fromWei(result, 'ether'))

      if (`${formatResult}`.split('.')[0] !== '0') {
        return formatResult.toFixed(2)
      } else {
        const startCount = `${formatResult}`
          .split('')
          .findIndex(el => el !== '0' && el !== '.')
        return `${formatResult}`
          .split('')
          .splice(0, startCount + 2)
          .join('')
      }
    } else {
      return 0
    }
  }

  async function claim(abi, address) {
    const reqId = await currentReqIds(abi, address)

    return executeTransaction({
      account: account.value.address,
      contractAddress: address,
      functionName: 'claim',
      abi,
      params: [reqId]
    })
  }

  async function getBalance(tokenAddress: string) {
    if (!tokenAddress) {
      return 0
    }
    const contractAddress = getSmartcontractAddress()

    const tokenBalance = await getTokenBalance(
      account.value.address,
      tokenAddress
    )

    const myBalance = await currentBalance(getAbi(), contractAddress)
    return tokenBalance + myBalance
  }

  async function tokensToClaim() {
    const contractAddress = getSmartcontractAddress()
    const currentGameBalance = await currentBalance(getAbi(), contractAddress)
    unclaimTokens.value = currentGameBalance
    return currentGameBalance
  }

  async function maxBet(tokenAddress: string) {
    if (!tokenAddress) {
      return 0
    }
    const contractAddress = getSmartcontractAddress()
    if (currentGame.value === MiniGames.Slidedice) {
      return await kellyWager(
        getAbi(),
        contractAddress,
        tokenAddress,
        multiplierInput.value * 10000
      )
    }
    return await kellyWager(getAbi(), contractAddress, tokenAddress)
  }

  async function claimTokens() {
    const contractAddress = getSmartcontractAddress()
    await claim(getAbi(), contractAddress)
  }

  async function playTheGame(autoClaim = false) {
    let hash = ''
    if (!currentGame.value) {
      throw new Error('No game selected')
    }
    isPlaying.value = true

    try {
      if (currentGame.value === MiniGames.Coinflip) {
        hash = await coinflipGlobalState.play({
          token: selectedToken.value.token,
          wager: valueBet.value,
          numOfBets: valueMultipleBet.value,
          valueMultiple: valueMultipleBet.value
        })
      } else if (currentGame.value === MiniGames.Slidedice) {
        hash = await slideGlobalState.play({
          token: selectedToken.value.token,
          wager: valueBet.value,
          numOfBets: valueMultipleBet.value,
          isOver: isRevert.value,
          multiplier: multiplierInput.value,
          valueMultiple: valueMultipleBet.value
        })
      } else if (currentGame.value === MiniGames.Arcade) {
        hash = await arcadeGlobalState.play({
          token: selectedToken.value.token,
          wager: valueBet.value,
          numOfBets: valueMultipleBet.value
        })
      } else if (currentGame.value === MiniGames.ToTheMoon) {
        toTheMoonGlobalState.play()
        setTimeout(() => {
          isPlaying.value = false
        }, 4000)
      } else if (currentGame.value === MiniGames.Wheel) {
        hash = await wheelGlobalState.play({
          token: selectedToken.value.token,
          wager: valueBet.value,
          numOfBets: valueMultipleBet.value
        })
      } else if (currentGame.value === MiniGames.ChiFouMi) {
        hash = await chiFouMiGlobalState.play({
          token: selectedToken.value.token,
          wager: valueBet.value,
          numOfBets: valueMultipleBet.value
        })
      } else if (currentGame.value === MiniGames.VideoPoker) {
        hash = await videoPokerGlobalState.replace()
      }
      gameScore.value++
    } catch (e: any) {
      if (currentGame.value === MiniGames.Wheel) {
        isDisabledPlayBtn.value = true
        setTimeout(() => {
          isDisabledPlayBtn.value = false
        }, 4200)
      }

      console.error(e)
      gameStatus.value = { text: 'Wallet Access Denied', color: 'red' }
      isPlaying.value = false
      if (!isDisabledSound.value) {
        new Audio(failAudio).play()
      }
      return
    } finally {
      finishGame()
      axios.post(`${config.public.apiBase}auth/addReferralPoint`, {
        prizeType: 'swap',
        txHash: hash
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken.value}`
        }
      })
    }

    if (!autoClaim) {
      const tokens = await tokensToClaim()
      if (tokens > 0) {
        claimNow.value = true
      }
    }

    // check if you won
    const int = setInterval(async () => {
      if (
        typeof gameStatus.value !== 'string' &&
        gameStatus.value.text === 'Wallet Access Denied'
      ) {
        isPlaying.value = false
        clearInterval(int)
        return
      }
      if (isPlaying.value) {
        unclaimTokens.value = 'waiting'
        gameStatus.value = {
          text: 'Waiting for Random Number',
          color: 'yellow'
        }
      }
      let results

      try {
        results = await viewResult(getAbi(), getSmartcontractAddress())
      } catch (e) {
        unclaimTokens.value = 'waiting'
      }
      if (!results) {
        return
      }
      clearInterval(int)
      let balance
      if (currentGame.value === MiniGames.Coinflip) {
        if (results[1].length > 0 && isPlaying.value) {
          gameStatus.value = { text: 'Random Number Received', color: 'green' }
          const balance = Number(utils.fromWei(results[2], 'ether'))
          setTimeout(() => {
            const lastResArr = coinflipGlobalState.processResults(results[1])
            lastResults.value = [...lastResArr]
            lastWon.value = balance
            finishGame()
            isPlaying.value = false
          }, 700)
          await tokensToClaim()
          if (totalWinnings.value.length < gameScore.value) {
            totalWinnings.value = [...totalWinnings.value, balance]
          }

          if (!autoClaim) {
            const tokens = await tokensToClaim()
            if (tokens > 0) {
              claimNow.value = true
            }
          }
        }
      }
      if (currentGame.value === MiniGames.Arcade) {
        if (results[1].length > 0 && isPlaying.value) {
          gameStatus.value = { text: 'Random Number Received', color: 'green' }
          const balance = Number(utils.fromWei(results[3], 'ether'))
          clearInterval(int)
          lastResults.value = [...results[2].map(e => Math.round(format(e) / valueBet.value))]
          lastWon.value = balance
          finishGame()
          isPlaying.value = false
          await tokensToClaim()
          if (totalWinnings.value.length < gameScore.value) {
            totalWinnings.value = [...totalWinnings.value, balance]
          }
          if (!autoClaim) {
            const tokens = await tokensToClaim()
            if (tokens > 0) {
              claimNow.value = true
            }
          }
        }
      }
      if (currentGame.value === MiniGames.Slidedice) {
        if (results[2].length > 0 && isPlaying.value) {
          gameStatus.value = { text: 'Random Number Received', color: 'green' }
          balance = Number(utils.fromWei(results[3], 'ether'))
          lastResults.value = results[2]
          lastWon.value = balance
          finishGame()
          isPlaying.value = false
          await tokensToClaim()
          if (totalWinnings.value.length < gameScore.value) {
            totalWinnings.value = [...totalWinnings.value, balance]
          }
          if (!autoClaim) {
            const tokens = await tokensToClaim()
            if (tokens > 0) {
              claimNow.value = true
            }
          }
        }
      }
      if (currentGame.value === MiniGames.ChiFouMi) {
        if (results[2].length > 0 && isPlaying.value) {
          gameStatus.value = { text: 'Random Number Received', color: 'green' }
          balance = Number(utils.fromWei(results[3], 'ether'))
          lastResults.value = results[2]
          lastWon.value = balance
          clearInterval(int)
          chiFouMiGlobalState.isEndGame = true
          results[1].forEach((result) => {
            chiFouMiGlobalState.endGameAnimation(hands[result].name, hands[chiFouMiGlobalState.hand][result])
          })
          finishGame()
          isPlaying.value = false
          await tokensToClaim()
          if (totalWinnings.value.length < gameScore.value) {
            totalWinnings.value = [...totalWinnings.value, balance]
          }
        }
      }
      if (currentGame.value === MiniGames.Wheel) {
        if (results[1].length > 0 && isPlaying.value) {
          gameStatus.value = { text: 'Random Number Received', color: 'green' }
          const balance = Number(utils.fromWei(results[2], 'ether'))
          clearInterval(int)
          const proxyNumbers: number[] = []
          results[1].forEach(async (result) => {
            const number = await wheelGlobalState.getMultipleNumber(result)
            proxyNumbers.push(number)
          })
          lastResults.value = proxyNumbers
          lastWon.value = balance
          await tokensToClaim()
          if (totalWinnings.value.length < gameScore.value) {
            setTimeout(() => {
              totalWinnings.value = [...totalWinnings.value, balance]
              finishGame()
            }, 9000)
          }
          if (!autoClaim) {
            const tokens = await tokensToClaim()
            if (tokens > 0) {
              claimNow.value = true
            }
          }
        }
      }
      if (currentGame.value === MiniGames.VideoPoker) {
        if (results.length > 0 && isPlaying.value) {
          videoPokerGlobalState.hand = results
          videoPokerGlobalState.selectedHand = [true, true, true, true, true]
          gameStatus.value = { text: 'Random Number Received', color: 'green' }
          clearInterval(int)
          try {
            const response = await videoPokerGlobalState.determineHandPayout()
            videoPokerGlobalState.multiplier = `${Number(response[0])}x`
            videoPokerGlobalState.setCombination(Number(response[1]))
            const balance = Number(response[0]) * valueBet.value
            unclaimTokens.value = balance
            lastWon.value = balance
            lastResults.value = [balance]
            if (totalWinnings.value.length < gameScore.value) {
              totalWinnings.value = [...totalWinnings.value, balance]
            }
            videoPokerGlobalState.status = balance > 0 ? 'Cash Out' : 'End Game'
            await tokensToClaim()
          } catch (e) {
            console.error(e, 'message')
          }
          setTimeout(() => {
            videoPokerGlobalState.combination = ''
            isPlaying.value = false
            finishGame()
          }, 5000)
        }
      }
    }, 2000)
  }

  async function loadLiveBets() {
    const uri = getSubGraphLivebets()
    const apolloClient = new ApolloClient({
      uri,
      cache: new InMemoryCache()
    })
    await apolloClient.resetStore()
    apolloClient
      .query({
        query: getQueryLiveBets()
      })
      .then((data) => {
        liveBets.value = getDataLiveBets(data?.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function loadAvailableTokens() {
    availableTokens.value = await getAvailableTokens()
    const rdtToken = availableTokens.value.find(
      token => token.symbol === 'RDT'
    )

    if (rdtToken) {
      selectedToken.value = rdtToken
    } else {
      selectedToken.value = availableTokens.value[0]
    }
  }

  onMounted(() => {
    setTimeout(() => {
      if (!currentGame.value || !currentChain.value) {
        return
      }
      loadLiveBets()
      tokensToClaim()
    }, 20)
  })

  watch(
    () => [currentChain.value, currentGame.value],
    () => {
      if (!currentGame.value) {
        return
      }
      setTimeout(() => {
        loadLiveBets()
        if (currentChain.value) {
          tokensToClaim()
        }
      }, 1000)
    }
  )

  setInterval(() => {
    if (!currentGame.value || !currentChain.value) {
      return
    }
    loadLiveBets()
  }, 5000)

  watch(
    () => selectedToken.value.token,
    async (newVal: any) => {
      if (!currentGame.value || !currentChain.value) {
        return
      }
      if (newVal.token) {
        balance.value = await getBalance(newVal.token)
        const maxBetResult = await maxBet(newVal.token)
        max.value = parseInt(maxBetResult)
        minBet.value = await minWager(newVal.token)
      }
    }
  )

  watch(() => {
    if (currentGame.value === MiniGames.Mine) {
      return {
        tokensToClaim: mineGlobalState.tokensToClaim,
        lastWonSize: mineGlobalState.lastWonSize,
        lastResultsSize: mineGlobalState.lastResultsSize,
        totalWinningsRef: mineGlobalState.totalWinningsRef,
        gameScoreRef: mineGlobalState.gameScoreRef
      }
    }
  }, (newValue: any) => {
    if (newValue.tokensToClaim) {
      unclaimTokens.value = newValue.tokensToClaim
    }
    if (newValue.lastWonSize) {
      lastWon.value = newValue.lastWonSize
    }
    if (newValue.lastResultsSize.length) {
      lastResults.value = newValue.lastResultsSize
    }
    if (newValue.totalWinningsRef.length) {
      totalWinnings.value = newValue.totalWinningsRef
    }
    if (newValue.gameScoreRef) {
      gameScore.value = newValue.gameScoreRef
    }
  }, { deep: true })

  watch(
    () => [account.value, currentChain.value],
    async () => {
      if (account.value && currentChain.value) {
        try {
          loading.value.loading = true
          await loadAvailableTokens()
          balance.value = await getBalance(selectedToken.value.token)
          const maxBetResult = await maxBet(selectedToken.value.token)
          max.value = parseInt(maxBetResult)
          minBet.value = await minWager(selectedToken.value.token)
        } catch {
          loading.value.loading = false
        } finally {
          loading.value.loading = false
        }
      }
    }
  )
  watch(
    () => [route, currentChain.value, account.value],
    async () => {
      isPlaying.value = false
      gameStatus.value = ''

      lastResults.value = []
      if (route.path.includes('games/') && currentChain.value) {
        await loadAvailableTokens()
        if (account.value.isConnected && !currentChain.value) {
          loading.value.loading = true
        } else {
          loading.value.loading = false
        }
        if (!account.value.isConnected) {
          loading.value.loading = false
        }
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => [
      multiplierInput.value,
      selectedToken.value,
      currentChain.value,
      route,
      currentGame.value
    ],
    async () => {
      if (currentChain.value) {
        const maxBetResult = await maxBet(selectedToken.value.token)
        max.value = parseInt(maxBetResult)
        minBet.value = await minWager(selectedToken.value.token)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => currentGame.value,
    () => {
      currentGameDetails.value = gamesDetails.games.find(
        game => game.formattedName === currentGame.value
      )
    }
  )

  watch(() => [multiplierInput.value, selectedToken.value.token, currentChain.value, route, currentGame.value], async () => {
    balance.value = await getBalance(selectedToken.value.token)
    const maxBetResult = await maxBet(selectedToken.value.token)
    max.value = parseInt(maxBetResult)
    minBet.value = await minWager(selectedToken.value.token)
  }, { immediate: true, deep: true })

  return {
    potencialWin,
    ctaText,
    lastResults,
    kellyWager,
    claim,
    currentGame,
    tokensToClaim,
    maxBet,
    claimNow,
    claimTokens,
    lastWon,
    playTheGame,
    isPlaying,
    availableTokens,
    liveBets,
    selectedToken,
    balance,
    max,
    valueBet,
    valueMultipleBet,
    multiplierInput,
    rollUnderInput,
    winChanceInput,
    isRevert,
    currentGameDetails,
    unclaimTokens,
    totalWinnings,
    fastResult,
    isRolling,
    minBet,
    getSmartcontractAddress,
    getAbi,
    gameScore,
    isDisabledPlayBtn,
    finishGame
  }
})
