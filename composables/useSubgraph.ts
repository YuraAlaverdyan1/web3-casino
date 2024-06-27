import { createGlobalState } from '@vueuse/core'
import { fetchToken } from '@wagmi/core'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useWeb3 } from './useWeb3'
import bankrollTokens from '~/queries/bankrollTokens.gql'

export const useSubgraph = createGlobalState(
  () => {
    const { getSubgraph } = useWeb3()

    async function getAvailableTokens() {
      const uri = getSubgraph('bankrolles')

      const apolloClient = new ApolloClient({
        uri,
        cache: new InMemoryCache()
      })

      await apolloClient.resetStore()

      const { data } = await apolloClient.query({
        query: bankrollTokens
      })

      const tokens = await Promise.all(data.tokens.map(async (item: any) => {
        const token = await fetchToken({
          address: item.address
        })

        return {
          token: item.address,
          symbol: token.symbol
        }
      }))

      return tokens
    }

    return { getAvailableTokens }
  }
)
