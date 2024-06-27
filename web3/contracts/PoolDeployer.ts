import { utils } from 'web3'
import useNftPool from './NftPool'
import { useWeb3 } from '~/composables/useWeb3'
import poolDeployer from '~/data/web3/abi/PoolDeployer.json'
import nftFactory from '~/data/web3/abi/NftFactory.json'
import nftPool from '~/data/web3/abi/NftPool.json'

export default function usePoolDeployer() {
  const {
    web3Global,
    executeMultiReadableMethod
  } = useWeb3()

  const { allRoundsData } = useNftPool()

  async function poolCountCall() {
    const contractCallContext = [
      {
        reference: 'multi',
        contractAddress: web3Global.chain.smartContracts.contracts.PoolDeployer.address,
        abi: poolDeployer,
        calls: [
          {
            reference: 'poolCount',
            methodName: 'poolCount',
            methodParameters: []
          }
        ]
      }
    ]
    const { results } = await executeMultiReadableMethod(
      contractCallContext
    )
    return Number(results.multi.callsReturnContext[0].returnValues[0].hex)
  }

  async function allPoolsCall(poolCount: number) {
    const calls = [...new Array(poolCount)].map((_, index) => ({
      reference: 'allPools',
      methodName: 'allPools',
      methodParameters: [index]
    }))

    const contractCallContext = [
      {
        reference: 'multi',
        contractAddress:
        web3Global.chain.smartContracts.contracts.PoolDeployer.address,
        abi: poolDeployer,
        calls
      }
    ]
    const { results } = await executeMultiReadableMethod(
      contractCallContext
    )
    return results.multi.callsReturnContext.map((call: unknown) => call.returnValues[0])
  }

  async function poolContractInfoCall(addresses: string[]) {
    const calls = addresses.map(address => ({
      reference: address,
      contractAddress: address,
      abi: nftPool,
      calls: [
        {
          reference: 'name',
          methodName: 'name',
          methodParameters: []
        },
        {
          reference: '_factory',
          methodName: '_factory',
          methodParameters: []
        },
        {
          reference: 'typeNFT',
          methodName: 'typeNFT',
          methodParameters: []
        },
        {
          reference: 'whiteListedEnabled',
          methodName: 'whiteListedEnabled',
          methodParameters: []
        },
        {
          reference: 'paused',
          methodName: 'paused',
          methodParameters: []
        },
        {
          reference: 'rewardRequired',
          methodName: 'rewardRequired',
          methodParameters: []
        },
        {
          reference: 'roundCount',
          methodName: 'roundCount',
          methodParameters: []
        },
        {
          reference: 'totalSupply',
          methodName: 'totalSupply',
          methodParameters: []
        },
        {
          reference: 'stakingToken',
          methodName: 'stakingToken',
          methodParameters: []
        }
      ]
    }))

    const { results } = await executeMultiReadableMethod(calls)

    const response = []
    addresses.forEach((address) => {
      const context = results[address].callsReturnContext
      response[address] = {
        name: context[0].returnValues[0],
        _factory: context[1].returnValues[0],
        typeNFT: Number(context[2].returnValues[0].hex),
        whiteListedEnabled: context[3].returnValues[0],
        paused: context[4].returnValues[0],
        rewardRequired: Number(context[5].returnValues[0].hex),
        roundCount: Number(context[6].returnValues[0].hex),

        totalSupply: utils.fromWei(
          context[7].returnValues[0].hex,
          'ether'
        ),
        stakingToken: context[8].returnValues[0]
      }
    })
    return response
  }

  async function factoryUris(
    factories: { _factory: string; address: string; typeNFT: string }[]
  ) {
    const calls = factories.map(factory => ({
      reference: factory.address,
      contractAddress: factory._factory,
      abi: nftFactory,
      calls: [
        {
          reference: 'uri',
          methodName: 'uri',
          methodParameters: [factory.typeNFT]
        }
      ]
    }))
    const { results } = await executeMultiReadableMethod(calls)
    const response = []
    factories.forEach(({ address }) => {
      response[address] =
        results[address].callsReturnContext[0].returnValues[0]
    })
    return response
  }

  async function roundRate(address: string, roundCount: number) {
    const allRounds = allRoundsData(
      address,
      roundCount
    )
    const contractCallContext: unknown[] = [
      {
        reference: 'multi',
        contractAddress: address,
        abi: nftPool,
        calls: [
          {
            reference: 'allRoundsData',
            methodName: allRounds.function_name,
            methodParameters: [roundCount]
          }
        ]
      }
    ]
    const { results } = await executeMultiReadableMethod(contractCallContext)

    return Number(results.multi.callsReturnContext[0].returnValues[0].hex)
  }

  return {
    poolCountCall,
    allPoolsCall,
    poolContractInfoCall,
    roundRate,
    factoryUris
  }
}
