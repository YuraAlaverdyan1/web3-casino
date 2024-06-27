<template>
  <div
    class="fixed top-0 left-0 flex justify-center items-center w-full h-full transition-all px-[24px] md:px-[0px]"
    :class="showBuyModal ? 'z-[100001] scale-100 opacity-100' : '-z-[100] scale-0 opacity-0'"
  >
    <div class="w-full h-full absolute left-0 top-0" @click.stop.prevent="showBuyModal = false" />
    <div
      class="bg-[#251F2D] border-[1px] border-[#424245] rounded-[12px] p-[24px] w-full max-w-[424px] relative z-[100050]"
    >
      <img
        src="/images/nav/close.svg"
        class="w-[24px] h-[24px] absolute right-[24px] top-[24px] scale-100 hover:scale-[1.05] cursor-pointer transition-all"
        @click.stop.prevent="showBuyModal = false"
      >
      <p class="text-[20px] font-[700]">
        Buy RDT
      </p>
      <p class="text-[14px] font-[400] mt-[16px]">
        Currently available on Uniswap, PancakeSwap and Coinstore- $RDT is also coming to other Blockchains and
        centralized exchanges.
      </p>
      <p class="text-[16px] font-[400] mt-[40px]">
        Exchanges
      </p>
      <div class="flex flex-col gap-[8px] mt-[8px]">
        <NuxtLink
          v-for="(item, index) of buyTokensData"
          :key="index"
          target="_blank"
          rel="noopener noreferrer"
          :to="item.link"
          class="px-[12px] py-[16px] rounded-[12px] border-[1px] border-[#424245] flex items-center gap-[8px] capitalize scale-[1] hover:scale-[1.02] transition-all cursor-pointer duration-300"
        >
          <img :src="item.image" width="40px">
          <p class="text-[16px] font-[700]">
            {{ item.name }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMenu } from '../../../composables/useMenu'
import buyTokensData from '~/data/buy-tokens.json'
export default {
  setup() {
    const { showBuyModal } = useMenu()
    return {
      showBuyModal,
      buyTokensData
    }
  }
}
</script>
