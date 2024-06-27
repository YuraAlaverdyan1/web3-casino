import { createGlobalState } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useWeb3 } from './useWeb3'
import globalBankroll from '~/queries/globalBankroll.gql'
import coinFlips from '~/queries/coinFlips.gql'
import slots from '~/queries/slots.gql'
import slidedices from '~/queries/slidedice.gql'

export const useGlobalBankroll = createGlobalState(() => {
  const globalBets = ref([])
  const globalGameBets = ref([])
  const route = useRoute()
  const {
    format,
    currentChain,
    getSubgraph
  } = useWeb3()

  async function loadGlobalBankroll() {
    const uri = getSubgraph('bankrolles')

    const apolloClient = new ApolloClient({
      uri,
      cache: new InMemoryCache()
    })

    await apolloClient.resetStore()

    try {
      const { data } = await apolloClient.query({
        query: globalBankroll
      })

      globalBets.value = data.rewards.map((item) => {
        return {
          ...item,
          amount: format(item.amount)
        }
      })
    } catch (err) {
      console.log(err, 'error')
    }
  }

  async function loadGameBankroll() {
    const uriDice = getSubgraph('slidedice', true)

    const apolloClientDice = new ApolloClient({
      uri: uriDice,
      cache: new InMemoryCache()
    })

    await apolloClientDice.resetStore()

    /*  */
    const uriCoinflip = getSubgraph('coinflip', true)

    const apolloClientCoinflip = new ApolloClient({
      uri: uriCoinflip,
      cache: new InMemoryCache()
    })

    await apolloClientCoinflip.resetStore()
    /*  */
    const uriArcade = getSubgraph('arcade', true)

    const apolloClientArcade = new ApolloClient({
      uri: uriArcade,
      cache: new InMemoryCache()
    })

    await apolloClientArcade.resetStore()
    /*  */

    try {
      const rolls = await apolloClientDice.query({
        query: slidedices
      })
      const flips = await apolloClientCoinflip.query({
        query: coinFlips
      })
      const pulls = await apolloClientArcade.query({
        query: slots
      })

      const allData = [...rolls.data.rolls, ...flips.data.coinFlips, ...pulls.data.pulls].map((item) => {
        return {
          ...item,
          amount: format(item.wager) * item.numOfBets
        }
      })

      globalGameBets.value = allData as any
    } catch (err) {
      console.log(err, 'error')
    }
  }

  watch(() => [currentChain.value, route], () => {
    if (!currentChain.value) {
      return
    }
    loadGlobalBankroll()
    loadGameBankroll()
  }, { immediate: true, deep: true })

  onMounted(() => {
    loadGlobalBankroll()
    loadGameBankroll()
  })

  setInterval(() => {
    loadGlobalBankroll()
    loadGameBankroll()
  }, 5000)

  return {
    loadGlobalBankroll,
    globalBets,
    globalGameBets
  }
})
