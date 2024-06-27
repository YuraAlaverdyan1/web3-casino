import { computed } from 'vue'
import masterCroupier from '~/data/web3/abi/MasterCroupier.json'
import { useWeb3 } from '~/composables/useWeb3'
import { useWalletConnect } from '~/composables/useWalletConnect'
import erc20 from '~/data/web3/abi/erc20.json'
import pancakePair from '~/data/web3/abi/PancakePair.json'

const BSCINFO = {
  BLOCK_PEER_YEAR: 365 * 24 * 60 * 60 / 3
}

export default function useMasterCroupier() {
  const {
    web3Global,
    executeMultiReadableMethod,
    toWei,
    executeTransaction,
    web3Contract
  } = useWeb3()
  const { account } = useWalletConnect()
  const masterCopierAddress = computed(() => web3Global.chain.smartContracts.contracts.MasterCroupier.address)

  const getPoolApr = (stakingTokenPrice, rewardTokenPrice, totalStaked, tokenPerBlock, poolInfo, totalAllocPoint) => {
    const poolShare = Number(poolInfo) / Number(totalAllocPoint)
    const totalRewardPricePerYear = Number(rewardTokenPrice) * Number(tokenPerBlock) * Number(poolShare) * BSCINFO.BLOCK_PEER_YEAR
    const totalStakingTokenInPool = Number(stakingTokenPrice) * Number(totalStaked)

    const apr = (totalRewardPricePerYear / totalStakingTokenInPool) * 100
    return apr
  }

  const calculateLPAPY = async (pid: string, LP_TOKEN_ADDRESS: string) => {
    const LPContract = web3Contract(pancakePair, LP_TOKEN_ADDRESS)
    const masterCroupierContract = web3Contract(masterCroupier, masterCopierAddress.value)

    const rewardPerBlock = await masterCroupierContract.read.tokenPerBlock()

    const totalAllocPoint = await masterCroupierContract.read.totalAllocPoint()

    const LPTVL = await LPContract.read.balanceOf([masterCopierAddress.value])
    const poolInfo = await masterCroupierContract.read.poolInfo([pid])
    const share = poolInfo[1]

    // LP POOL
    // GET PRICE
    const totalLpSupply = await LPContract.read.totalSupply()
    const reserves = await LPContract.read.getReserves()
    const rdtPriceinBNB = (Number(reserves[0]) / Number(reserves[1]))

    const lpPrice = 2 * (Math.sqrt(Number(reserves[0]) * Number(reserves[1])) * Math.sqrt(Number(rdtPriceinBNB) * 1)) / Number(totalLpSupply)

    return getPoolApr(lpPrice, rdtPriceinBNB, LPTVL, rewardPerBlock, share, totalAllocPoint)
  }

  const calculateGobAPY = async (pid: string) => {
    const RDTContract = web3Contract(erc20, web3Global.chain.smartContracts.RDTToken)
    const masterCroupierContract = web3Contract(masterCroupier, masterCopierAddress.value)

    const rewardPerBlock = await masterCroupierContract.read.tokenPerBlock()

    const totalAllocPoint = await masterCroupierContract.read.totalAllocPoint()

    const RDTBALANCE = await RDTContract.read.balanceOf([masterCopierAddress.value])
    const RDTREWARD = await masterCroupierContract.read.rewardBal()
    const RDTTVL = RDTBALANCE - RDTREWARD

    const poolInfo = await masterCroupierContract.read.poolInfo([pid])
    const share = poolInfo[1]

    return getPoolApr(1, 1, RDTTVL, rewardPerBlock, share, totalAllocPoint)
  }

  const userInfoCall = async (pid: string) => {
    const contractCallContext: unknown[] = [
      {
        reference: 'multi',
        contractAddress: masterCopierAddress.value,
        abi: masterCroupier,
        calls: [
          {
            reference: 'userInfo',
            methodName: 'userInfo',
            methodParameters: [pid, account.value.address]
          },
          {
            reference: 'pendingToken',
            methodName: 'pendingToken',
            methodParameters: [pid, account.value.address]
          }
        ]
      }
    ]
    const { results } = await executeMultiReadableMethod(contractCallContext)
    return results.multi.callsReturnContext
  }

  async function enterStaking(amount: number) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: masterCopierAddress.value,
      functionName: 'enterStaking',
      abi: masterCroupier,
      params: [toWei(amount)]
    })
    return response
  }

  async function leaveStaking(amount: number) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: masterCopierAddress.value,
      functionName: 'leaveStaking',
      abi: masterCroupier,
      params: [amount ? toWei(amount) : amount]
    })
    return response
  }

  async function deposit(amount: number, pid: string) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: masterCopierAddress.value,
      functionName: 'deposit',
      abi: masterCroupier,
      params: [pid, toWei(amount)]
    })
    return response
  }

  async function withdraw(amount: number, pid: string) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: masterCopierAddress.value,
      functionName: 'withdraw',
      abi: masterCroupier,
      params: [pid, amount ? toWei(amount) : amount]
    })
    return response
  }

  async function poolBaseCall() {
    const contractCallContext = [
      {
        reference: 'multi',
        contractAddress: masterCopierAddress.value,
        abi: masterCroupier,
        calls: [
          {
            reference: 'poolCount',
            methodName: 'poolCount',
            methodParameters: []
          },
          {
            reference: 'getToken',
            methodName: 'getToken',
            methodParameters: []
          },
          {
            reference: 'govToken',
            methodName: 'govToken',
            methodParameters: []
          }
        ]
      }
    ]
    const { results } = await executeMultiReadableMethod(
      contractCallContext
    )

    return {
      count: Number(results.multi.callsReturnContext[0].returnValues[0].hex),
      stakingToken: results.multi.callsReturnContext[1].returnValues[0],
      govToken: results.multi.callsReturnContext[2].returnValues[0]
    }
  }

  async function poolInfoCall(poolCount: number) {
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

  return {
    enterStaking,
    leaveStaking,
    withdraw,
    poolBaseCall,
    poolInfoCall,
    deposit,
    userInfoCall,
    calculateGobAPY,
    calculateLPAPY
  }
}
