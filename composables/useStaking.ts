import { computed, ref, reactive } from 'vue'
import { createGlobalState } from '@vueuse/core'
import axios from 'axios'
import { useWeb3 } from '~/composables/useWeb3'
import masterCroupier from '~/data/web3/abi/MasterCroupier.json'
import usePoolDeployer from '~/web3/contracts/PoolDeployer'
import useNftPool from '~/web3/contracts/NftPool'
import useMasterCroupier from '~/web3/contracts/MasterCroupier'
import { useLoading } from '~/composables/useLoading'
import { useWalletConnect } from '~/composables/useWalletConnect'
import chainsData from '~/data/web3/chains.json'

export const useStaking = createGlobalState(() => {
  const { account } = useWalletConnect()
  const { approve, MAX_APPROVE_VAL, allowance, web3Global, executeMultiReadableMethod, format, getTokenBalance, getTokenSymbol } = useWeb3()
  const {
    enterStaking,
    deposit,
    poolBaseCall,
    leaveStaking,
    withdraw,
    userInfoCall,
    calculateGobAPY,
    calculateLPAPY
  } = useMasterCroupier()
  const { start, stop } = useLoading()
  const {
    poolCountCall,
    allPoolsCall,
    poolContractInfoCall,
    roundRate,
    factoryUris
  } = usePoolDeployer()
  const { baseUserPoolInfo, claimNFT, stake, withdraw: withdrawNFT } = useNftPool()

  const poolBlockchain = reactive(
    {}
  )
  const poolBlockchainUser = ref({})
  const pools = ref([])
  const govToken = ref(null)
  const stakingToken = ref(null)

  const masterCopierAddress = computed(() => web3Global.chain.smartContracts.contracts.MasterCroupier.address)

  const loadNFTs = async () => {
    try {
      start('')
      pools.value = []
      const poolCount = await poolCountCall()
      const allPools = await allPoolsCall(poolCount)

      const poolInfoContract = (await poolContractInfoCall(allPools))
      const factoryUrisValue = await factoryUris(
        allPools.map((address: string) => ({
          address,
          _factory: poolInfoContract[address]._factory,
          typeNFT: poolInfoContract[address].typeNFT
        }))
      )

      const metaResponses: any[] = []
      const memo: any = {}
      for (const address of allPools) {
        const uri = factoryUrisValue[address]
        if (uri) {
          if (memo[uri]) {
            metaResponses.push(memo[uri])
          } else {
            const response = await axios.get(uri).catch((err) => {
              console.log('error', err)
            })
            metaResponses.push(response)
            memo[uri] = response
          }
        }
      }

      pools.value = await Promise.all(
        allPools.map(async (address: string, index: number) => {
          const roundRateValue = await roundRate(
            address,
            poolInfoContract[address].roundCount
          )
          const dailyEmission =
            (roundRateValue * 86400) /
            poolInfoContract[address].rewardRequired

          return {
            name: poolInfoContract[address].name,
            address,
            paused: poolInfoContract[address].paused,
            isWhitelist: poolInfoContract[address].whiteListedEnabled,
            rewardRate: poolInfoContract[address].rewardRate,
            rewardRequired: poolInfoContract[address].rewardRequired,
            roundCount: poolInfoContract[address].roundCount,
            stakingToken: poolInfoContract[address].stakingToken,
            totalSupply: poolInfoContract[address].totalSupply,
            typeNFT: poolInfoContract[address].typeNFT,
            dailyEmission,
            rate: roundRate,
            metadata: {
              image: metaResponses[index].data.image,
              animation_url: metaResponses[index].data.animation_url,
              external_url: metaResponses[index].data.external_url,
              description: metaResponses[index].data.description,
              attributes: metaResponses[index].data.attributes
            }
          }
        })
      )
    } catch (err) {
      console.error(err)
    } finally {
      stop()
    }
  }

  const loadPoolUser = async () => {
    poolBlockchainUser.value = {}

    if (web3Global.walletConnected) {
      const blockChainPools = {}
      await Promise.all(
        pools.value.map(async (pool) => {
          const base = await baseUserPoolInfo(pool)
          const objectTokens = chainsData.find(e => Object.values(e.smartContracts).find(e => e === pool.stakingToken)).smartContracts
          const tokenName = Object.keys(objectTokens).find(key => objectTokens[key] === pool.stakingToken)
          const resolveTokenName = (name) => {
            if (name === 'RDTToken') {
              return 'RDT'
            } else if (name === 'RDTTokenLP') {
              return 'Cake Lp'
            }
          }

          const balanceNFT = computed(() => {
            let result = 0
            if (
              !base.earned ||
              !pool.rewardRequired
            ) {
              return 0
            }
            if (base.earned) {
              result = base.earned / pool.rewardRequired
            }

            return result
          })

          const walletBalance = await getTokenBalance(
            account.value.address,
            pool.stakingToken
          )
          blockChainPools[pool.address] = {
            ...blockChainPools[pool.address],
            balance: base.balance,
            earned: base.earned,
            balanceNFT: balanceNFT.value,
            whiteListed: base.whiteListed,
            walletBalance,
            stakingToken: pool.stakingToken,
            tokenName: resolveTokenName(tokenName)
          }
        })
      )
      poolBlockchainUser.value = { ...blockChainPools }
    }
  }

  const loadStakingPoolUser = async () => {
    const blockChainPools = {}
    await Promise.all(
      pools.value.map(async (pool) => {
        const response = await userInfoCall(pool.pid)
        const [amount] = response[0].returnValues
        const [pendingTokens] = response[1].returnValues
        const staked = (await format(amount.hex)) ?? null

        const rewarded = (await format(pendingTokens.hex)) ?? null

        blockChainPools[pool.pid] = {
          ...blockChainPools[pool.pid],
          staked,
          rewarded
        }
      })
    )
    poolBlockchainUser.value = { ...blockChainPools }
  }

  const poolInfoCall = async (poolCount: number) => {
    const calls = [...new Array(poolCount)].map((_, index) => ({
      reference: 'poolInfo',
      methodName: 'poolInfo',
      methodParameters: [index]
    }))

    const contractCallContext = [
      {
        reference: 'multi',
        contractAddress: masterCopierAddress.value,
        abi: masterCroupier,
        calls
      }
    ]

    const { results } = await executeMultiReadableMethod(
      contractCallContext
    )

    return results.multi.callsReturnContext.map(callReturn => ({
      lpToken: callReturn.returnValues[0],
      allocPoint: Number(callReturn.returnValues[1].hex),
      lastRewardBlock: Number(callReturn.returnValues[2].hex),
      acctokenPerShare: Number(callReturn.returnValues[3].hex),
      name: callReturn.returnValues[4]
    }))
  }

  const loadStakingPools = async () => {
    try {
      start('')
      const { count, govToken: gov, stakingToken: staking } = await poolBaseCall()
      govToken.value = gov
      stakingToken.value = staking
      const infoPool = await poolInfoCall(count)
      pools.value = infoPool.map((info, index) => ({
        ...info,
        pid: `${index}`,
        type: index === 0 ? 'governance' : 'normal'
      }))

      stakingToken.value = staking
      govToken.value = gov
      pools.value = await Promise.all(
        pools.value.map(async (pool) => {
          if (pool.type === 'governance') {
            const APY = await calculateGobAPY(pool.pid)
            poolBlockchain[pool.pid] = {
              ...poolBlockchain[pool.pid],
              tokenPrice: web3Global.RDTPrice,
              walletBalance: await getTokenBalance(
                account.value.address,
                pool.lpToken
              ),
              APY
            }
          } else {
            const APY = await calculateLPAPY(pool.pid, pool.lpToken)
            poolBlockchain[pool.pid] = {
              ...poolBlockchain[pool.pid],
              tokenPrice: web3Global.RDTLPPrice,
              walletBalance: await getTokenBalance(
                account.value.address,
                pool.lpToken
              ),
              APY
            }
          }
          pool.tokenSymbol = await getTokenSymbol(pool.lpToken)
          return pool
        })
      )
    } catch (err) {
      console.log(err, 'error')
    } finally {
      stop()
      await loadStakingPoolUser()
    }
  }

  const handleDeposit = async (pool, amount) => {
    if (amount <= 0) {
      return
    }
    try {
      start('')
      if (pool.type === 'governance') {
        const value = await allowance(
          pool.lpToken,
          web3Global.chain.smartContracts.contracts.MasterCroupier.address
        )

        if (value < amount) {
          await approve(
            pool.lpToken,
            web3Global.chain.smartContracts.contracts.MasterCroupier.address,
            MAX_APPROVE_VAL
          )
        }
        await enterStaking(amount)
      } else {
        const value = await allowance(
          pool.lpToken,
          web3Global.chain.smartContracts.contracts.MasterCroupier.address
        )
        if (value < amount) {
          await approve(
            pool.lpToken,
            web3Global.chain.smartContracts.contracts.MasterCroupier.address,
            MAX_APPROVE_VAL
          )
        }
        await deposit(amount, pool.pid)
      }
    } catch (err) {
      console.error(err)
    } finally {
      stop()
    }
  }

  const handleWithdraw = async (pool, amount, claim = false) => {
    try {
      start('')
      if (pool.type === 'governance') {
        if (!claim) {
          const value = await allowance(
            govToken.value,
            web3Global.chain.smartContracts.contracts.MasterCroupier.address
          )

          if (value < amount) {
            await approve(
              govToken.value,
              web3Global.chain.smartContracts.contracts.MasterCroupier
                .address,
              MAX_APPROVE_VAL
            )
          }
        }
        await leaveStaking(claim ? 0 : amount)
      } else {
        await withdraw(claim ? 0 : amount, pool.pid)
      }
    } catch (err) {
      console.log(err, 'error')
    } finally {
      stop()
    }
  }

  const handleStake = async (pool, amount) => {
    if (amount <= 0) {
      return
    }
    start('')
    try {
      const value = await allowance(
        pool.stakingToken,
        pool.address
      )
      if (amount && value < amount) {
        await approve(
          pool.stakingToken,
          pool.address,
          MAX_APPROVE_VAL
        )
      }
      await stake(pool.address, amount ?? 0)
    } catch (err) {
      if (err?.data?.message) {
        console.error(err?.data?.message, 'error')
      } else {
        console.error(err.message, 'error')
      }
    } finally {
      stop()
    }
  }

  const handleUnstakeNFT = async (pool, amount) => {
    if (amount <= 0) {
      return
    }
    try {
      start('')
      await withdrawNFT(pool.address, amount ?? 0)
    } catch (err) {
      console.error(err.message, 'error')
    } finally {
      stop()
    }
  }

  const handleClaimNFT = async (pool) => {
    try {
      start('')
      await claimNFT(pool.address)
    } catch (err) {
      console.error(err.message, 'error')
    } finally {
      stop()
    }
  }

  return {
    poolInfoCall,
    loadNFTs,
    pools,
    loadPoolUser,
    masterCopierAddress,
    poolBlockchainUser,
    loadStakingPools,
    govToken,
    stakingToken,
    handleDeposit,
    handleWithdraw,
    handleStake,
    handleUnstakeNFT,
    handleClaimNFT,
    loadStakingPoolUser,
    poolBlockchain
  }
})
