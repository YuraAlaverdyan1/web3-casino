import { createGlobalState, watchDebounced } from '@vueuse/core'
import { ref, reactive } from 'vue'
import { Multicall } from 'ethereum-multicall'
import { formatEther, parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { utils } from 'web3'
import { useRoute } from 'vue-router'
import erc20 from '~/data/web3/abi/erc20.json'
import uniRouter from '~/data/web3/abi/UniRouter.json'
import pancakePair from '~/data/web3/abi/PancakePair.json'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { formators } from '~/utils/web3/formators'
import { chainsSupported } from '~/web3/model/chain.model'
import chains from '~/data/web3/chains.json'
import nftFactoryABI from '~/data/web3/abi/NftFactory.json'
import ridottoOriginals from '~/data/ridotto-originals.json'

const MAX_APPROVE_VAL = '10000000000'

const defaultValue = {
  chain: chainsSupported[0],
  walletConnected: false,
  loaded: false,
  RDTBalance: '0',
  RDTLPBalance: 0,
  RDTPrice: 0,
  RDTLPPrice: 0,
  generalBalance: 0,
  account: '',
  currentSession: null,
  wallet: ''
}

const defaultValueSports = {
  chain: chainsSupported[5],
  walletConnected: false,
  loaded: false,
  RDTBalance: '0',
  RDTLPBalance: 0,
  RDTPrice: 0,
  RDTLPPrice: 0,
  generalBalance: 0,
  account: '',
  currentSession: null,
  wallet: ''
}

export const useWeb3 = createGlobalState(
  () => {
    const route = useRoute()
    let multicall: Multicall = undefined as unknown as Multicall
    const { account, chain, transactionContract, getBalance, getContract } = useWalletConnect()
    const web3Global = reactive(route.path.includes('sports') ? defaultValueSports : defaultValue)
    const currentChain = ref<unknown>(undefined)
    const { hexToDecimal } = formators()
    const slotNFT = ref(0)
    const lotteryNFT = ref(0)
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()
    const appEnvConfig = config.public.appEnvConfig

    watchDebounced(() => chain.value, async (val) => {
      if (!val) {
        return
      }

      const chainFound = chainsSupported.find(Chain => hexToDecimal(Chain.chainId) === chain.value.id)

      if (chainFound) {
        multicall = new Multicall({ nodeUrl: chainFound.node, tryAggregate: true })
        web3Global.chain = chainFound
        web3Global.walletConnected = true
        currentChain.value = chainFound
        web3Global.RDTPrice = await getTokenPrice()
        web3Global.RDTLPPrice = await getLPTokenPrice()
        web3Global.chain = chainFound
        currentChain.value = chainFound
      }
    }, { debounce: 500, immediate: true })

    async function executeMultiReadableMethod(contractCallContext: any) {
      const chainFound = chainsSupported.find(Chain => Chain.code.toLowerCase() === chain.value.network?.toLowerCase())
      if (!chainFound) {
        return
      }
      multicall = new Multicall({ nodeUrl: chainFound.node, tryAggregate: true })
      return await multicall.call(contractCallContext)
    }

    function format(value: any) {
      return Number(utils.fromWei(value, 'ether'))
    }

    async function executeTransaction(options: any) {
      return await transactionContract({
        account: options.account,
        address: options.contractAddress,
        abi: options.abi,
        functionName: options.functionName,
        args: options.params,
        value: options.value ? options.value : '0x00'
      })
    }

    async function getNftSlots(account:string, contractAddtess:string) {
      const contract = web3Contract(nftFactoryABI, contractAddtess)
      slotNFT.value = await contract.read.balanceOf([account, 2])
      lotteryNFT.value = await contract.read.balanceOf([account, 1])
    }

    async function getTokenBalance(address: string, tokenAddress: string) {
      if (!tokenAddress || !address) {
        return '0'
      }
      const balance = await getBalance(tokenAddress, address)

      return Number(formatEther(balance.value))
    }

    function web3Contract(abi: any, address: any) {
      return getContract({ abi, address })
    }

    function getTokenSymbol(tokenAddress: any) {
      if (!tokenAddress) {
        return '0'
      }
      return getContract({ abi: erc20, address: tokenAddress }).read.symbol()
    }

    async function getTokenPrice(tokenAddress = '') {
      const chain = web3Global.chain
      if (chain.code !== 'goerli' && chain.test === true) {
        return 10.5
      } else {
        const router = web3Contract(uniRouter, (chain.priceCalculation as any).pcsRouter)
        const wbnb = web3Contract(erc20, (chain.priceCalculation as any).wbnb)
        const usdt = web3Contract(erc20, (chain.priceCalculation as any).usdt)
        const token = web3Contract(erc20, tokenAddress || chain.smartContracts.RDTToken)

        if (!wbnb) {
          return 0
        }

        try {
          // Get decimals of each token
          const wbnbdecimals = await wbnb.read.decimals()
          const usdtdecimals = await usdt.read.decimals()
          const tokendecimals = await token.read.decimals()

          const decimals = [
            wbnbdecimals,
            usdtdecimals,
            tokendecimals
          ]

          const amount1 = await router.read.getAmountsOut(
            [
              BigNumber(10).pow(Number(decimals[2])).toString(),
              [token.address, wbnb.address]
            ]
          )
          const amount2 = await router.read.getAmountsOut([
            BigNumber(10).pow(Number(decimals[0])).toString(),
            [wbnb.address, usdt.address]
          ]
          )

          const amt = BigNumber(Number(amount1[1])).multipliedBy(Number(amount2[1]))

          return amt.div(BigNumber(10).pow(Number(decimals[0]) + Number(decimals[1]))).toNumber()
        } catch (e) {
          console.log(e)
          return 0
        }
      }
    }

    async function getLPTokenPrice() {
      const chain = web3Global.chain
      if (chain.symbol === 'BNB') {
        try {
          const LPContract = web3Contract(
            pancakePair,
            chain.smartContracts.RDTTokenLP
          )
          const router = web3Contract(uniRouter, (chain.priceCalculation as any).pcsRouter)
          const wbnb = web3Contract(erc20, (chain.priceCalculation as any).wbnb)
          const usdt = web3Contract(erc20, (chain.priceCalculation as any).usdt)

          // Get decimals of each token
          const decimals = [
            await wbnb.read.decimals(),
            await usdt.read.decimals()
          ]

          const priceBNBWei = await router.read.getAmountsOut([
            BigNumber(10).pow(Number(decimals[0])).toString(),
            [wbnb.address, usdt.address]
          ])

          const priceBNB = Number(formatEther(priceBNBWei[1] as bigint))

          const totalLpSupply = await LPContract.read.totalSupply()
          const reserves = await LPContract.read.getReserves()
          const Token0PriceinToken1 = Number(reserves[0]) / Number(reserves[1])

          const lpPrice =
            (2 *
              (Math.sqrt(Number(reserves[0]) * Number(reserves[1])) *
                Math.sqrt(Token0PriceinToken1 * 1))) /
            Number(totalLpSupply)

          return lpPrice * priceBNB
        } catch (e) {
          console.log(e)
          return 0
        }
      }
      return 0
    }

    function toWei(value: any) {
      return parseEther(Number(value).toString())
    }

    async function getTokenDecimals(tokenAddress: any) {
      if (!tokenAddress) {
        return 1
      }
      const contract = web3Contract(erc20, tokenAddress)
      return await contract.read.decimals()
    }

    function convertLotteryNumbers(value: number) {
      return value?.toString().split('').slice(1).reverse().join('')
    }

    async function approve(contractAddress: string, spender: string, amount: string) {
      const response = await executeTransaction({
        account: account.value.address,
        contractAddress,
        functionName: 'approve',
        abi: erc20,
        params: [spender, toWei(amount)]
      })
      return response
    }

    async function allowance(address: string, spender: string) {
      if (!account.value.address) {
        return
      }

      const contract = web3Contract(erc20, address)
      const response = await contract.read.allowance([account.value.address, spender])
      return response ? format(response) : response
    }

    const getSubgraph = (endpoint: string, isGame: boolean = false) => {
      let chain
      if (currentChain.value) {
        chain = currentChain.value
      } else if (route.path.includes('sports')) {
        chain = chains[5]
      } else {
        chain = chains[0]
      }
      if (isGame) {
        return ridottoOriginals.games.find(item => item.formattedName === endpoint)?.contracts[appEnvConfig].network[hexToDecimal(chain.chainId).toString()]?.subgraph
      } else {
        const key = hexToDecimal(chain.chainId).toString()
        return ridottoOriginals[endpoint][0][appEnvConfig][key]
      }
    }

    return {
      web3Global,
      executeMultiReadableMethod,
      executeTransaction,
      format,
      getTokenPrice,
      getTokenBalance,
      getTokenSymbol,
      web3Contract,
      toWei,
      getTokenDecimals,
      convertLotteryNumbers,
      currentChain,
      MAX_APPROVE_VAL,
      approve,
      allowance,
      slotNFT,
      lotteryNFT,
      getNftSlots,
      getSubgraph
    } as any
  })
