import { createGlobalState } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { aggregateOutcomesByMarkets } from '@azuro-org/toolkit'
import { encodeAbiParameters, parseAbiParameters, parseUnits } from 'viem'
import { useRoute } from 'vue-router'
import { ModalController } from '@ridotto-io/w3-core'
import { useLoading } from './useLoading'
import gamesGql from '~/queries/games.gql'
import userBets from '~/queries/userBets.gql'
import sportEvent from '~/queries/sportEvent.gql'
import { useWalletConnect } from '~/composables/useWalletConnect'
import azuroProxyFrontAbi from '~/data/web3/abi/AzuroProxyFront.json'
import azuroAbi from '~/data/web3/abi/Azuro.json'
import { useWeb3 } from '~/composables/useWeb3'
import chains from '~/data/web3/chains.json'

export enum Sports {
  TopEvents = 'top-events',
  Betslip = 'betslip',
  ESports='E-Sports',
  Sports = 'Sports',
  Football = 'football',
  Cricket = 'cricket',
  Basketball = 'basketball',
  Tennis = 'tennis',
  Baseball = 'baseball',
  MMA = 'mma',
  Boxing = 'boxing',
  RugbyUnion = 'rugby-union',
  AmericanFootball = 'american-football',
  IceHockey = 'ice-hockey',
  RugbyLeague = 'rugby-league',
  Home = 'home',
  MyBets = 'my-bets',
}

export enum SportMarkets {
  MatchWinner = 'Match Winner',
  FightWinner = 'Fight Winner',
  PointsHandicap = 'Points Handicap'
}

export enum SportStatus {
  Unredeemed = 'Unredeemed',
  Won = 'Won',
  Lost = 'Lost',
  Accepted = 'Accepted',
  Settled = 'Settled'
}

export enum ESports {
  CS2 = 'cs2',
  LOL = 'lol',
  Dota = 'dota-2',
  TopESports = 'top-e-sports',
  Tournaments = 'tournaments',
}

export enum TimeIntervals {
  All = 'All',
  Today = 'Today',
  Tomorrow = 'Tomorrow',
  OneHour = '1h',
  ThreeHour = '3h',
  SixHour = '6h',
}

export const useAzuro = createGlobalState(() => {
  const {
    executeTransaction,
    allowance,
    MAX_APPROVE_VAL,
    approve,
    web3Global
  } = useWeb3()
  const { account } = useWalletConnect()
  const isLoading = ref(false)
  const isLoadingMybets = ref(false)
  const { loading } = useLoading()
  const allGames = ref([])
  const filteredGames = ref([])
  const allLeagues = ref([])
  const myBetsArr = ref([])
  const isMyBets = ref(false)
  const wager = ref(1)
  const wagerError = ref(false)
  const isDisabled = ref('')
  const route = useRoute()
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig()
  const polygonNetwork = chains.find(e => e.code === 'POLYGON').azuroLink
  const timeFilter = ref('All')
  const unredeemedBets = ref([])
  const redeemAllLoading = ref(false)
  const oddsFormat = ref('eu')

  const chain = computed(() => chains.find(e => e.chainId === web3Global.chain.chainId))

  const betslips = ref([])
  const isSingle = ref(true)

  watch(() => web3Global.chain, () => {
    betslips.value = []
  }, { deep: true, immediate: true })

  const filteredLeagues = () => {
    allLeagues.value = allGames.value.reduce((acc, cur) => {
      const sportName = acc.find(e => e.sport === cur.sport.name)
      if (!sportName) {
        return [...acc, { sport: cur.sport.name, leagues: [{ league: cur.league.name, leagueSlug: cur.league.slug, country: cur.league.country.name, countrySlug: cur.league.country.slug }] }]
      } else if (!acc.find(e => e.leagues.find(e => e.league === cur.league.name))) {
        sportName.leagues = [...sportName.leagues, { league: cur.league.name, leagueSlug: cur.league.slug, country: cur.league.country.name, countrySlug: cur.league.country.slug }]
      }
      return acc
    }, [])
  }

  watch(() => allGames.value, () => {
    if (!allLeagues.value.length) {
      filteredLeagues()
    }
  })

  const isSportsPage = computed(() => {
    if (route.path.includes('/sports/')) {
      return true
    }
    return false
  })

  const getGames = async () => {
    loading.value.loading = true
    const apolloClient = new ApolloClient({
      uri: chain.value.azuroLink || polygonNetwork,
      cache: new InMemoryCache()
    })

    await apolloClient.resetStore()
    try {
      const { data } = await apolloClient
        .query({
          query: gamesGql,
          variables: {
            size: 100,
            where: {
              startsAt_gt: Math.floor(Date.now() / 1000)
            }
          }
        })

      if (data) {
        allGames.value = data.games
        filteredGames.value = data.games
        loading.value.loading = false
      }
    } catch (err) {
      loading.value.loading = false
    }
  }

  const useSportEvent = async (id) => {
    const apolloClient = new ApolloClient({
      uri: chain.value.azuroLink || polygonNetwork,
      cache: new InMemoryCache()
    })

    await apolloClient.resetStore()
    const { data } = await apolloClient
      .query({
        query: sportEvent,
        variables: {
          id
        }
      })

    let game
    let markets
    if (data?.game) {
      const { sport, league, participants, startsAt, conditions } = data.game

      game = { sport, league, participants, startsAt }
      markets = !data
        ? null
        : aggregateOutcomesByMarkets({
          lpAddress: chain.value.smartContracts.contracts.LPAddress ? chain.value.smartContracts.contracts.LPAddress.address : config.public.azuroLP,
          conditions
        })

      return {
        game,
        markets
      }
    }
  }

  const addBet = (bet, event) => {
    if (betslips.value.findIndex(e => e.game.gameId === event.gameId) !== -1) {
      betslips.value[betslips.value.findIndex(e => e.game.gameId === event.gameId)] = { bet, game: event, wager: 1, isError: false }
    } else {
      betslips.value = [...betslips.value, { bet, game: event, wager: 1, isError: false }]
    }
  }

  const placeBet = async (bets) => {
    isLoading.value = true

    if (isSingle.value) {
      const value = await allowance(chain.value.priceCalculation.usdt, chain.value.smartContracts.contracts.LPAddress.address)
      if ((value * 1000000000000) < bets.reduce((acc, cur) => +acc + +cur.wager, 0)) {
        await approve(chain.value.priceCalculation.usdt, chain.value.smartContracts.contracts.LPAddress.address, MAX_APPROVE_VAL)
      }

      const betsArr = bets.map((item) => {
        const deadline = Math.floor(Date.now() / 1000) + 2000
        const { conditionId, outcomeId, currentOdds } = item.bet
        const slippage = 5 // 5%
        const minOdds = 1 + (currentOdds - 1) * (100 - slippage) / 100
        const oddsDecimals = 12 // in current version of protocol odds has 12 decimals

        const rawMinOdds = parseUnits(minOdds.toFixed(oddsDecimals), oddsDecimals)
        const data = encodeAbiParameters(
          parseAbiParameters('uint256, uint64'),
          [
            BigInt(conditionId),
            BigInt(outcomeId)
          ]
        )

        const amount = item.wager * 1000000

        return {
          core: chain.value.smartContracts.contracts.CoreAddress.address,
          amount,
          expiresAt: deadline,
          extraData: {
            affiliate: config.public.azuroAffiliate.toLowerCase(),
            data,
            minOdds: rawMinOdds
          }
        }
      }

      )

      try {
        await executeTransaction({
          account: account.value.address,
          contractAddress: chain.value.smartContracts.contracts.ProxyFront.address,
          functionName: 'bet',
          abi: azuroProxyFrontAbi,
          params: [
            chain.value.smartContracts.contracts.LPAddress.address,
            [...betsArr]
          ]
        }).then(() => {
          betslips.value = []
          isLoading.value = false
        }
        )
      } catch (e) {
        isLoading.value = false
        console.log(e)
      } finally {
        isLoading.value = false
      }
    } else {
      isLoading.value = true
      const betsArr = bets.map((item) => {
        return { conditionId: item.bet.conditionId, outcomeId: item.bet.outcomeId }
      })

      const data = encodeAbiParameters(
        parseAbiParameters('(uint256, uint64)[]'),
        [
          betsArr.map(({ conditionId, outcomeId }) => {
            return [
              BigInt(conditionId),
              BigInt(outcomeId)
            ]
          })
        ]
      )

      const deadline = Math.floor(Date.now() / 1000) + 2000
      const value = allowance(chain.value.priceCalculation.usdt, chain.value.smartContracts.contracts.LPAddress.address)
      if ((value * 1000000000000) < +wager.value) {
        approve(chain.value.priceCalculation.usdt, chain.value.smartContracts.contracts.LPAddress.address, MAX_APPROVE_VAL)
      }

      const amount = +wager.value * 1000000
      const currentOdds = +bets[0].bet.currentOdds

      const slippage = 5 // 5%
      const minOdds = 1 + (currentOdds - 1) * (100 - slippage) / 100
      const oddsDecimals = 12 // in current version of protocol odds has 12 decimals

      const rawMinOdds = parseUnits(minOdds.toFixed(oddsDecimals), oddsDecimals)

      executeTransaction({
        account: account.value.address,
        contractAddress: chain.value.smartContracts.contracts.LPAddress.address,
        functionName: 'bet',
        abi: azuroAbi,
        params: [
          chain.value.smartContracts.contracts.CoreExpress.address, amount, deadline,
          {
            affiliate: config.public.azuroAffiliate.toLowerCase(),
            data,
            minOdds: rawMinOdds
          }
        ]
      }).then(() => {
        betslips.value = []
        isLoading.value = false
      }
      ).catch(() => {
        isLoading.value = false
      })
    }
  }

  watch(() => [isMyBets.value, account.value.address], async () => {
    if (account.value.address) {
      await getMyBets()
      const myBetsTimeout = setTimeout(async () => {
        if (!isMyBets.value) {
          clearInterval(myBetsTimeout)
        }
        await getMyBets()
      }, 5000)
    }
  })

  const getMyBets = async () => {
    if (!myBetsArr.value.length) {
      isLoadingMybets.value = true
    }
    const apolloClient = new ApolloClient({
      uri: chain.value.azuroLink,
      cache: new InMemoryCache()
    })

    await apolloClient.resetStore()

    try {
      const { data } = await apolloClient
        .query({
          query: userBets,
          variables: {
            where: {
              actor: account.value.address.toLowerCase()
            }
          }
        })

      if (data) {
        isLoadingMybets.value = false
        myBetsArr.value = data.bets
      }
    } catch (err) {
      isLoadingMybets.value = false
    }

    try {
      const { data } = await apolloClient
        .query({
          query: userBets,
          variables: {
            where: {
              actor: account.value.address.toLowerCase(),
              isRedeemed: false,
              result: 'Won'
            }
          }
        })

      if (data) {
        isLoadingMybets.value = false
        unredeemedBets.value = data.bets
      }
    } catch (err) {
      isLoadingMybets.value = false
    }
  }

  const withdrawPayout = async (id, isCombo = false) => {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: chain.value.smartContracts.contracts.LPAddress.address,
      functionName: 'withdrawPayout',
      abi: azuroAbi,
      params: [isCombo ? chain.value.smartContracts.contracts.CoreExpress.address : chain.value.smartContracts.contracts.CoreAddress.address, id]
    })

    return response
  }

  const withdrawAllPayout = async () => {
    const data = [
      unredeemedBets.value.map(({ core, betId }) => ({
        core: core.id,
        tokenId: betId,
        isNative: false
      }))
    ]
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: chain.value.smartContracts.contracts.ProxyFront.address,
      functionName: 'withdrawPayouts',
      abi: azuroProxyFrontAbi,
      params: data
    })

    return response
  }

  const handlePlaceBet = () => {
    if (account.value.address && !isDisabled.value) {
      if (isSingle.value) {
        isDisabled.value = ''
        const wrongBets = betslips.value.filter(el => el.wager <= 0)

        if (!wrongBets.length) {
          isDisabled.value = ''
          placeBet(betslips.value)
        } else {
          betslips.value = betslips.value.map((el) => {
            if (el.wager <= 0) {
              return {
                ...el, isError: true
              }
            } else {
              return el
            }
          }
          )
          isDisabled.value = 'Wager cannot be 0'
        }
      } else if (wager.value <= 0) {
        wagerError.value = true
        isDisabled.value = 'Wager cannot be 0'
      } else if (betslips.value.length < 2) {
        isDisabled.value = 'More than 2 bets are required'
      } else {
        isDisabled.value = ''
        placeBet(betslips.value)
      }
    } else if (isDisabled.value.includes('Please change your network')) {
      ModalController.open({ view: 'Networks' })
    } else {
      isDisabled.value = 'Connect your Wallet to Play'
    }
  }

  onMounted(() => {
    getGames()
  })

  watch(() => chain.value, () => {
    getGames()
    getMyBets()
  })

  watch(() => timeFilter.value, () => {
    const today = new Date()
    const tomorrow = new Date(today)
    if (timeFilter.value === TimeIntervals.Today) {
      today.setHours(23, 59, 0, 0)
      allGames.value = filteredGames.value.filter(e => Number(e?.startsAt) <= today.getTime() / 1000)
    } else if (timeFilter.value === TimeIntervals.Tomorrow) {
      today.setHours(23, 59, 0, 0)
      tomorrow.setHours(23, 59, 0, 0)
      tomorrow.setDate(tomorrow.getDate() + 1)
      allGames.value = filteredGames.value.filter(e => today.getTime() / 1000 < Number(e?.startsAt) && Number(e?.startsAt) < tomorrow.getTime() / 1000)
    } else if (timeFilter.value === TimeIntervals.OneHour) {
      today.setHours(today.getHours() + 1)
      allGames.value = filteredGames.value.filter(e => Number(e?.startsAt) <= today.getTime() / 1000)
    } else if (timeFilter.value === TimeIntervals.ThreeHour) {
      today.setHours(today.getHours() + 3)
      allGames.value = filteredGames.value.filter(e => Number(e?.startsAt) <= today.getTime() / 1000)
    } else if (timeFilter.value === TimeIntervals.SixHour) {
      today.setHours(today.getHours() + 6)
      allGames.value = filteredGames.value.filter(e => Number(e?.startsAt) <= today.getTime() / 1000)
    } else {
      return allGames.value = filteredGames.value
    }
  })

  return {
    addBet,
    allGames,
    useSportEvent,
    betslips,
    getMyBets,
    placeBet,
    wager,
    isSingle,
    isMyBets,
    myBetsArr,
    withdrawPayout,
    isLoading,
    allLeagues,
    chain,
    isLoadingMybets,
    wagerError,
    handlePlaceBet,
    isDisabled,
    isSportsPage,
    unredeemedBets,
    redeemAllLoading,
    withdrawAllPayout,
    timeFilter,
    oddsFormat
  }
})
