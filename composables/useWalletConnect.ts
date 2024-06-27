import { createGlobalState } from '@vueuse/core'
import * as Sentry from '@sentry/vue'
import { ref, toRaw, watch } from 'vue'
import axios from 'axios'
import { bsc, goerli, sepolia, polygon, polygonMumbai } from 'viem/chains'

import {
  fetchBalance,
  getAccount,
  getContract,
  getNetwork,
  prepareWriteContract,
  waitForTransaction,
  watchAccount,
  watchNetwork,
  writeContract,
  disconnect
} from '@wagmi/core'
import makeBlockie from 'ethereum-blockies-base64'
import { createWeb3Modal, defaultWagmiConfig } from '@ridotto-io/w3-wagmi/vue'
import { AccountController } from '@ridotto-io/w3-core'
import { useRoute } from 'vue-router'
import { useGameStatus } from './useGameStatus'
import { useAuth } from '~/store/useAuth'
import { routeSupported } from '~/web3/model/networks.model'
import ridottoOriginals from '~/data/ridotto-originals.json'

export const useWalletConnect = createGlobalState(() => {
  const {
    setUserId,
    setNonce,
    userDetails,
    setJwtToken,
    setUserDetails,
    setAuth,
    nonce
  } = useAuth()
  const account = ref<any>({})
  const chain = ref<any>({})
  const web3Modal = ref<any>({})
  const { gameStatus } = useGameStatus()
  const route = useRoute()
  const unsupportedChains = ref<number[]>([])
  const referralCode = ref<string>()

  // 1. Define constants
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig()
  const appEnvConfig = config.public.appEnvConfig
  const projectId = config.public.walletConnectProjectId

  // setup wallet connect
  // 2. Create wagmiConfig
  const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  let rawChains

  if (appEnvConfig === 'testing') {
    rawChains = [bsc, goerli, sepolia, polygon, polygonMumbai]
  } else if (appEnvConfig === 'staging') {
    rawChains = [bsc, goerli, sepolia, polygon, polygonMumbai]
  } else if (appEnvConfig === 'production') {
    rawChains = [bsc, polygon]
  } else {
    rawChains = [bsc, polygon]
  }

  const supportedNetworks = (unsupportedNet) => {
    return rawChains.filter((e) => {
      return unsupportedNet.map(item => item !== e.id).find(e => e === false) !== false
    }).map(e => e.id)
  }

  let chains = [...rawChains]
  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

  web3Modal.value = createWeb3Modal({ wagmiConfig, projectId, chains })
  watch(() => route, (v: any) => {
    if (route) {
      if (v.path.includes('games')) {
        const game = v.path.split('/').filter(e => e !== '').reverse()[0]
        const gameSupportedChains = ridottoOriginals.games.find(e => e.link === game).supportedNetworks
        web3Modal.value.syncNewRequestedNetworks(supportedNetworks(gameSupportedChains))
        unsupportedChains.value = supportedNetworks(gameSupportedChains)
      } else if (routeSupported[v.name]) {
        web3Modal.value.initPromise.then(() => {
          web3Modal.value.syncNewRequestedNetworks(supportedNetworks(routeSupported[v.name].networks))
          unsupportedChains.value = supportedNetworks(routeSupported[v.name].networks)
        }).catch((error) => {
          console.error('Initialization error:', error)
        })
      }
      const game = ridottoOriginals.games.find(elm => elm.formattedName === v.name?.toString().split('-').at(-1))
      if (game) {
        chains = rawChains.filter(raw => Object.keys(game.contracts[appEnvConfig].network).includes(raw.id.toString()))
      }
    }
  }, { deep: true, immediate: true })

  const addNewToken = async (address) => {
    const { ethereum } = window
    try {
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address,
            symbol: `RDT`,
            decimals: 18
          }
        }
      })
    } catch (err) {
      console.log(err, 'error')
    }
  }

  async function getBalance(token: any, address: any = undefined) {
    return await fetchBalance({
      address: address || account.value.address,
      token
    })
  }

  async function transactionContract({
    args,
    abi,
    address,
    functionName,
    account,
    value
  }: any) {
    const { request } = await prepareWriteContract({
      abi,
      address,
      functionName,
      args,
      account,
      value
    })
    gameStatus.value = { text: 'Waiting for wallet confirmation', color: 'yellow' }
    const { hash } = await writeContract(request)
    if (hash) {
      gameStatus.value = { text: 'Wallet confirmation successful', color: 'green' }
      gameStatus.value = { text: 'Waiting for blockchain confirmation', color: 'yellow' }
    }
    await waitForTransaction({
      hash
    })
    return hash
  }

  const getNonce = (address) => {
    if (!address) {
      return
    }

    localStorage.setItem('signatureId', '')
    localStorage.setItem('jwtToken', '')
    setUserId(`${address}`)
    const extraParams = referralCode.value ? `&referenceCode=${referralCode.value}` : ''
    axios.get(`${config.public.apiBase}auth/getNonce?address=${address}${extraParams}`).then(function (response) {
      if (response.data.result.nonce) {
        setNonce(response.data.result.signingMessage)
        localStorage.setItem('account', `${address}`)
      }
    })
  }

  watchAccount((value) => {
    account.value = value
    const isAuthLocal = localStorage.getItem('isAuth')
    const jwtToken = localStorage.getItem('jwtToken')
    const localAccount = localStorage.getItem('account')

    if (`${isAuthLocal}` === 'false' || !isAuthLocal) {
      disconnect()
      localStorage.clear()
      localStorage.setItem('isAuth', 'in-progress')
    }

    if (!toRaw(value.isConnected) || `${isAuthLocal}` === 'false') {
      setUserDetails({})
      setAuth(false)
      localStorage.setItem('isAuth', 'none')
    } else if (jwtToken !== null && Object.keys(userDetails.value).length === 0) {
      setJwtToken(jwtToken)
      axios.get(`${config.public.apiBase}auth/details`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        }
      ).then(function (userInfo) {
        setUserDetails(userInfo.data.result)
        AccountController.setUserName(userInfo.data.result.userName)
        AccountController.setProfileImage(makeBlockie(`${userInfo.data.result.address}`))
        setAuth(true)
      }).catch((e) => {
        if (e.response.data.statusCode === 401) {
          getNonce(value.address)
        }
      })
    }
    if ((toRaw(value.isConnected) && localAccount !== value.address) || (toRaw(value.isConnected) && `${isAuthLocal}` === 'none')) {
      localStorage.setItem('account', `${value.address}`)
      setUserId(`${value.address}`)
      const extraParams = referralCode.value ? `&referenceCode=${referralCode.value}` : ''
      axios.get(`${config.public.apiBase}auth/getNonce?address=${value.address}${extraParams}`).then(function (response) {
        if (response.data.result.nonce) {
          setNonce(response.data.result.signingMessage)
          localStorage.setItem('account', `${value.address}`)
        }
      })
    }
    if ((!nonce.value && isAuthLocal !== 'true') || (value.address && isAuthLocal === 'none')) {
      getNonce(value.address)
    }
  })

  account.value = getAccount()

  Sentry.setUser({ address: account.value.address, email: account.value.address })

  watchAccount((value) => {
    account.value = value
    Sentry.setUser({ address: value.address, email: value.address })
  })
  account.value = getAccount()

  watchNetwork((value) => {
    chain.value = value.chain
  })

  chain.value = getNetwork().chain

  watch(() => chain.value, () => {
    if (userDetails.value.address) {
      AccountController.setProfileImage(makeBlockie(`${userDetails.value.address}`))
    }
  })

  watch(() => account.value, () => {
    if (account.value.isDisconnected) {
      setAuth(false)
    }
  })

  watch(() => referralCode.value, () => {
    const localReferralCode = localStorage.getItem('referralCode')
    if (!localReferralCode && referralCode.value) {
      localStorage.setItem('referralCode', referralCode.value)
    } else if (localReferralCode && !referralCode.value) {
      referralCode.value = localReferralCode
    }
  }, { immediate: true })

  return {
    account,
    chain,
    getBalance,
    transactionContract,
    getContract,
    getNonce,
    web3Modal,
    unsupportedChains,
    addNewToken,
    referralCode
  }
})
