import routeNetwork from '~/data/web3/networks-route.json'

export interface NetworkRoutingItem {
  networks: number[];
}

export interface NetworkRouting {
  [route: string]: NetworkRoutingItem;
}

export const routeSupported: NetworkRouting = routeNetwork
