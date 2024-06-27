<template>
  <div class="flex justify-between items-center" style="background: #2c2634; border-radius: 8px; padding: 15px">
    <div :style="titleStyle" class="text-[13px] sm:text-[16px] capitalize">
      {{ title === 'supportedNetworks' ? 'Supported Networks' : title }}
    </div>
    <div :style="descriptionStyle">
      <a
        v-if="title === 'contracts'"
        target="_blank"
        rel="noopener noreferrer"
        :href="`${currentChain?.chainId && gamesInfo[config.public.appEnvConfig].network[hexToDecimal(currentChain?.chainId)] ? currentChain.verifyOnBlockchain : 'https://bscscan.com'}/address/${resolveGameDescription.currentDescription.contract}`"
      >
        <p class="hidden sm:inline">
          {{ resolveGameDescription.laptopFirst }}...{{ resolveGameDescription.laptopLast }}
        </p>
        <p class="sm:hidden">
          {{ resolveGameDescription.mobileFirst }}...{{ resolveGameDescription.mobileLast }}
        </p>
      </a>
      <template v-else-if="title === 'supportedNetworks'">
        <div class="flex items-center gap-[10px]">
          <a
            v-for="(item, index) of chainsArr.availableChains"
            :key="index"
            target="_blank"
            rel="noopener noreferrer"
            :href="`${item.verifyOnBlockchain}/address/${chainsArr.chainLinks[index].contract}`"
          >

            <img alt="logo" :src="item.networkIcon">
          </a>
          <p class="text-[13px] sm:text-[16px] text-right capitalize">
            {{ chainName }}
          </p>
        </div>
      </template>
      <template v-else>
        <p class="text-[13px] sm:text-[16px] text-right">
          {{ description }}
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { useWeb3 } from '~/composables/useWeb3'
import chainsData from '~/data/web3/chains.json'
import { formators } from '~/utils/web3/formators'
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    titleStyle: {
      type: String,
      required: true
    },
    descriptionStyle: {
      type: String,
      required: true
    },
    gamesInfo: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { chain } = useWalletConnect()
    const chainUrl = ref(null)
    const { currentChain } = useWeb3()
    const { hexToDecimal } = formators()
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()
    const chainName = computed(() => {
      if (currentChain.value) {
        if (props.title === 'supportedNetworks' && props.description.find(el => el === hexToDecimal(currentChain.value.chainId))) {
          return currentChain.value.code
        }
      }
      return 'BSC'
    })

    const chainsArr = computed(() => {
      if (props.title === 'supportedNetworks') {
        // eslint-disable-next-line array-callback-return
        const availableChains = chainsData.filter(el => props.description.map((item) => {
          if (item === hexToDecimal(el.chainId)) {
            return true
          }
        }).find(el => el === true))

        const chainLinks = availableChains.map(el => props.gamesInfo[config.public.appEnvConfig].network[hexToDecimal(el.chainId)])
        return { chainLinks, availableChains }
      }
      return null
    }

    )

    onMounted(() => {
      if (chain.value) {
        chainUrl.value = chainsData.find(elm => hexToDecimal(elm.chainId) === chain.value.id).verifyOnBlockchain
      }
      if (!chainUrl.value) {
        chainUrl.value = chainsData[3].verifyOnBlockchain
      }
    })

    const resolveGameDescription = computed(() => {
      let currentDescription
      const currentChainLocal = currentChain.value ? props.gamesInfo[config.public.appEnvConfig].network[hexToDecimal(currentChain.value.chainId)] : ''
      if (currentChainLocal) {
        currentDescription = currentChainLocal
      } else {
        currentDescription = props.gamesInfo[config.public.appEnvConfig].network[56]
      }
      const mobileFirst = currentDescription.contract.split('').slice(0, 3).join('')
      const laptopFirst = currentDescription.contract.split('').slice(0, 5).join('')
      const mobileLast = currentDescription.contract.split('').slice(currentDescription.contract.split('').length - 3, currentDescription.contract.split('').length - 1).join('')
      const laptopLast = currentDescription.contract.split('').slice(currentDescription.contract.split('').length - 7, currentDescription.contract.split('').length - 1).join('')
      return {
        mobileFirst,
        mobileLast,
        laptopFirst,
        laptopLast,
        currentDescription
      }
    })

    return {
      resolveGameDescription,
      chainUrl,
      chain,
      chainName,
      currentChain,
      chainsArr,
      config,
      hexToDecimal
    }
  }
}
</script>

<style lang="scss" scoped>
a:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
