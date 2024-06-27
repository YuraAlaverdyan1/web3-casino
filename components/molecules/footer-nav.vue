<template>
  <div class="flex justify-between sm:flex-row flex-col gap-6 items-center">
    <div class="flex sm:flex-row flex-col items-center gap-4">
      <div class="h-[40px] px-[16px] flex justify-center items-center w-full gap-[8px] bg-[#1b2329] sm:bg-[#27262a] rounded-[12px] scale-100 hover:scale-[1.05] transition-all cursor-pointer min-w-[130px]" @click="showBuyModal = !showBuyModal">
        <img src="/svgs/rdt.svg" class="w-[20px] h-[20px]">
        <p class="text-[14px] font-[700]">
          Buy RDT Token
        </p>
      </div>
      <input type="image" :src="isSmall ? '/images/footer/small-add-btn.png' : '/images/footer/add-rdt.png'" class="btn" @click="addRdtToken">
    </div>
  </div>
</template>

<script lang="ts">
import { useWeb3 } from '~/composables/useWeb3'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { formators } from '~/utils/web3/formators'
import socialIcons from '~/data/social-icons.json'
import { useMenu } from '~/composables/useMenu'
export default {
    props: {
        isSmall: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup() {
        const { currentChain } = useWeb3()
        const { hexToDecimal } = formators()
        const { addNewToken } = useWalletConnect()
        const { showBuyModal } = useMenu()

        const buyRdtToken = () => {
          if ([1, 5].includes(hexToDecimal(currentChain.value.chainId))) {
            window.open('https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x4740735aa98dc8aa232bd049f8f0210458e7fca3')
          } else if ([56, 97].includes(hexToDecimal(currentChain.value.chainId))) {
            window.open('https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0xe9c64384deb0c2bf06d991a8d708c77eb545e3d5')
          } else {
            window.open('https://www.coinstore.com/#/spot/RDTUSDT')
          }
        }

        const addRdtToken = () => {
          if (hexToDecimal(currentChain.value.chainId) === 1) {
            addNewToken('0x4740735AA98Dc8aa232BD049f8F0210458E7fCa3')
          } else if (hexToDecimal(currentChain.value.chainId) === 56) {
            addNewToken('0xe9c64384dEb0C2bF06D991A8D708c77eb545E3d5')
          }
        }

        return {
            socialIcons,
            buyRdtToken,
            addRdtToken,
            showBuyModal
        }
    }
}
</script>

<style lang="scss" scoped>
.btn, .icon {
  transition: 0.2s;
  &:hover {
    opacity: 0.8;
  }
}
.icon > img {
    min-width: 110%;
    max-width: 110%;
}
</style>
