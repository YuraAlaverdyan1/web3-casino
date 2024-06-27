import { utils } from 'web3'
import { useWeb3 } from '~/composables/useWeb3'
import nftPool from '~/data/web3/abi/NftPool.json'
import { useWalletConnect } from '~/composables/useWalletConnect'

export interface PoolAttribute {
  trait_type: string;
  value: string;
}

export interface PoolBlockchainUserData {
  balance?: number;
  earned?: number;
  whiteListed?: boolean;
}

export interface Pool {
  name: string;
  address: string;
  paused: boolean;
  isWhitelist: boolean;
  rewardRate: string;
  rewardRequired: number;
  roundCount: number;
  stakingToken: string;
  totalSupply: number;
  typeNFT: number;
  dailyEmission: number;
  rate: number;
  metadata: {
    image: string;
    animation_url: string;
    external_url: string;
    description: string;
    attributes: PoolAttribute[];
  };
}

export default function useNftPool() {
  const {
    web3Global,
    executeMultiReadableMethod,
    toWei,
    executeTransaction
  } = useWeb3()

  const { account } = useWalletConnect()

  function earnedData(address: string) {
    return {
      chain: web3Global.chain.chainId,
      address,
      function_name: 'earned',
      abi: nftPool,
      params: {
        account: account.value.address
      }
    }
  }

  function whiteListedData(address: string) {
    return {
      chain: web3Global.chain.chainId,
      address,
      function_name: 'whiteListed',
      abi: nftPool,
      params: {
        address: account.value.address
      }
    }
  }

  function balancesData(address: string) {
    return {
      chain: web3Global.chain.chainId,
      address,
      function_name: 'balances',
      abi: nftPool,
      params: {
        '': account.value.address
      }
    }
  }

  function allRoundsData(address: string, roundCount: number) {
    return {
      chain: web3Global.chain.chainId,
      address,
      function_name: 'allRounds',
      abi: nftPool,
      params: {
        '': roundCount
      }
    }
  }

  async function stake(address: string, amount: number) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: address,
      functionName: 'stake',
      abi: nftPool,
      params: [toWei(amount)]
    })

    return response
  }

  async function withdraw(address: string, amount: number) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: address,
      functionName: 'withdraw',
      abi: nftPool,
      params: [toWei(amount)]
    })
    return response
  }

  async function claimNFT(address: string) {
    const response = await executeTransaction({
      account: account.value.address,
      contractAddress: address,
      functionName: 'claimNFT',
      abi: nftPool,
      params: ['0x00']
    })
    return response
  }

  async function baseUserPoolInfo(
    pool: Pool
  ): Promise<Record<'balance' | 'earned' | 'whiteListed', unknown>> {
    const balancesDataValue = balancesData(
      pool.address
    )
    const earnedDataValue = earnedData(
      pool.address
    )

    const whiteListedDataValue = whiteListedData(
      pool.address
    )
    const calls = [
      {
        reference: 'balancesData',
        methodName: balancesDataValue.function_name,
        methodParameters: [account.value.address]
      },
      {
        reference: 'earnedData',
        methodName: earnedDataValue.function_name,
        methodParameters: [account.value.address]
      }
    ]
    if (pool.isWhitelist) {
      calls.push({
        reference: 'whiteListed',
        methodName: whiteListedDataValue.function_name,
        methodParameters: [account.value.address]
      })
    }

    const contractCallContext: unknown[] = [
      {
        reference: 'multi',
        contractAddress: pool.address,
        abi: nftPool,
        calls
      }
    ]

    const { results } = await executeMultiReadableMethod(contractCallContext)

    return {
      balance: format(
        results.multi.callsReturnContext[0].returnValues[0].hex
      ),
      earned: Number(results.multi.callsReturnContext[1].returnValues[0].hex),
      whiteListed: results.multi?.callsReturnContext[2]?.returnValues[0]
    }
  }

  function format(value: string): number {
    return Number(utils.fromWei(value, 'ether'))
  }

  return {
    stake,
    withdraw,
    claimNFT,
    baseUserPoolInfo,
    allRoundsData,
    balancesData,
    whiteListedData,
    earnedData
  }
}
