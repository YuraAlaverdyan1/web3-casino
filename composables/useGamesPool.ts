import { ref, computed } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useWeb3 } from '~/composables/useWeb3'
import { useLoading } from '~/composables/useLoading'
import { useWalletConnect } from '~/composables/useWalletConnect'
import gamesPools from '~/queries/gamesPool.gql'
import globalBankrollABI from '~/data/web3/abi/GlobalBankroll.json'

export const useGamesPool = createGlobalState(() => {
  const { account } = useWalletConnect()

  const { approve, MAX_APPROVE_VAL, executeTransaction, allowance, getSubgraph, toWei, web3Global, web3Contract, getTokenBalance } = useWeb3()

  const { start, stop } = useLoading()

  const poolsArr = ref([])

  const contractAddress = computed(() => web3Global.chain.smartContracts.contracts.GlobalBankroll.address)

  async function loadGlobalBankroll() {
    const uri = getSubgraph('bankrolles')

    const apolloClient = new ApolloClient({
      uri,
      cache: new InMemoryCache()
    })

    await apolloClient.resetStore()

    try {
      const { data } = await apolloClient.query({
        query: gamesPools
      })
      poolsArr.value = data.tokens
    } catch (err) {
      console.log(err, 'error')
    }
  }

  loadGlobalBankroll()

  async function deposit(amount: number, address: string) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: contractAddress.value,
      functionName: 'deposit',
      abi: globalBankrollABI,
      params: [address, toWei(amount)]
    })
    return response
  }

  async function withdraw(amount: number, address: string) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: contractAddress.value,
      functionName: 'withdraw',
      abi: globalBankrollABI,
      params: [address, toWei(amount)]
    })
    return response
  }

  async function getReward(address: string) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: contractAddress.value,
      functionName: 'getReward',
      abi: globalBankrollABI,
      params: [address]
    })
    return response
  }

  const userEarned = async (address) => {
    const contract = web3Contract(globalBankrollABI, contractAddress.value)

    const result = await contract.read.earned([account.value.address, address])
    return result
  }
  const userBalance = async (address) => {
    const contract = web3Contract(globalBankrollABI, contractAddress.value)

    const result = await contract.read.getUserBalance([account.value.address, address])

    return result
  }
  const userMaxBalance = async (address) => {
    const walletBalance = await getTokenBalance(
      account.value.address,
      address
    )
    return walletBalance
  }
  const handleGetReward = async (pool) => {
    try {
      start('')
      await getReward(pool)
    } catch (err) {
      console.error(err)
    } finally {
      stop()
    }
  }

  const handleDeposit = async (pool, amount) => {
    if (amount <= 0) {
      return
    }
    try {
      start('')
      const value = await allowance(
        pool,
        contractAddress.value
      )
      if (value < amount) {
        await approve(
          pool,
          contractAddress.value,
          MAX_APPROVE_VAL
        )
      }

      await deposit(amount, pool)
    } catch (err) {
      console.error(err)
    } finally {
      stop()
    }
  }

  const handleWithdraw = async (pool, amount) => {
    start('')
    if (amount <= 0) {
      return
    }
    try {
      start('')
      const value = await allowance(
        pool,
        contractAddress.value
      )
      if (value < amount) {
        await approve(
          pool,
          contractAddress.value,
          MAX_APPROVE_VAL
        )
      }
      await withdraw(amount, pool)
    } catch (err) {
      console.log(err, 'error')
    } finally {
      stop()
    }
  }

  return {
    handleDeposit,
    poolsArr,
    handleWithdraw,
    userEarned,
    userBalance,
    userMaxBalance,
    handleGetReward,
    loadGlobalBankroll
  }
})
