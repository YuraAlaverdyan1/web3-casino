import ridottoOriginals from '~/data/ridotto-originals.json'
import { formators } from '~/utils/web3/formators'
import { useWeb3 } from '~/composables/useWeb3'

export const resolveGame = (game: string): { name: string; link: string; } | object => {
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig()
  const { hexToDecimal } = formators()
  const { web3Global } = useWeb3()

  if (game.includes('0x')) {
    const item = ridottoOriginals.games.find((elm) => {
      return elm.contracts[config.public.appEnvConfig].network[hexToDecimal(web3Global.chain.chainId).toString()]?.contract.toLowerCase() === game.toLowerCase()
    })

    if (item) {
      return {
        name: item.name,
        link: item.formattedName
      }
    } else {
      return {}
    }
  } else {
    return ridottoOriginals.games.find(obj => game === obj.formattedName)?.contracts[config.public.appEnvConfig].network[hexToDecimal(web3Global.chain.chainId).toString()]?.contract
  }
}
