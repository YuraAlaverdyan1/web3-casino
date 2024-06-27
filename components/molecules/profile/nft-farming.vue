<template>
  <div class="w-full px-[24px] md:px-[0px]">
    <p class="text-[18px] font-[700]">
      Nft Farming
    </p>
    <div class="flex justify-between md:items-center mt-[16px] flex-col sm:flex-row">
      <div
        data-aos="fade-right"
        data-aos-once="true"
        data-aos-delay="200"
        class="flex items-center gap-[16px] mb-[16px] md:mb-[0px]"
      >
        <p class="text-[16px] font-[700]">
          Farmed only
        </p>
        <custom-check :is-active="activeCheck" @click="activeCheck = !activeCheck" />
      </div>
    </div>
    <div
      class="mt-[14px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] xl:gap-[24px] items-center justify-center"
    >
      <div
        v-for="(item, index) of pools"
        :key="index"
        class="w-fit mx-auto"
        data-aos="fade-up"
        data-aos-once="true"
        :data-aos-delay="index * 100"
      >
        <staking-n-f-t-card class="mx-auto" :item="item" :pool-blockchain-user="poolBlockchainUser" :show-only-active="activeCheck" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, onMounted } from 'vue'
import CustomCheck from '~/components/atoms/custom-check.vue'
import StakingNFTCard from '~/components/atoms/staking-nft-card.vue'
import profileData from '~/data/profile.json'
import { useStaking } from '~/composables/useStaking'
import { useWeb3 } from '~/composables/useWeb3'
export default {
  setup() {
    const activeCheck = ref(false)
    const activeButton = ref(0)
    const { loadNFTs, pools, loadPoolUser, poolBlockchainUser } = useStaking()
    const { web3Global } = useWeb3()

    onMounted(() => {
      pools.value = []
      loadNFTs()
    })

    watch(() => [web3Global.walletConnected, web3Global.chain], () => {
      pools.value = []
      loadNFTs()
    })

    watch(() => pools.value, () => {
      loadPoolUser()
    })

    return {
      activeCheck,
      profileData,
      activeButton,
      pools,
      poolBlockchainUser
    }
  },
  components: { CustomCheck, StakingNFTCard }
}
</script>
