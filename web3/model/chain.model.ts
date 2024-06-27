import chains from '~/data/web3/chains.json'

// tmp types, trick for bypass type moralis
export type ChainsIdType = '0x38' | '0x61'

export interface SmartContract {
  address: string;
}

export interface Chain {
  code: string;
  name: string;
  verifyOnBlockchain?: string;
  mainnet?: string;
  priceCalculation?: unknown;
  publicRPC: string;
  symbol: string;
  chainId: string;
  node: string;
  multicall: string;
  test?: boolean;
  smartContracts: {
    RDTToken: string;
    RDTTokenLP: string;
    contracts: Record<string, SmartContract>;
  };
}
let chainsToExport: Chain[] = []

chainsToExport = chains
// chainsToExport = chains.filter(chain => !chain.test)
export const chainsSupported: Chain[] = chainsToExport

export const getMainnetChain = (chain: Chain): Chain => {
  if (chain.test === true) {
    return chainsSupported.find(c => c.code === chain.mainnet) as Chain
  }
  return chain
}
