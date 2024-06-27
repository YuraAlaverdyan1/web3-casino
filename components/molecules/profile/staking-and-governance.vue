<template>
  <div class="w-full px-[24px] md:px-[0px]">
    <p class="text-[18px] font-[700]">
      Staking and Governance
    </p>
    <div class="flex items-center gap-[16px] mt-[16px]">
      <p class="text-[16px] font-[700]">
        Staked only
      </p>
      <custom-check :is-active="activeCheck" @click="activeCheck = !activeCheck" />
    </div>
    <div
      class="mt-[14px] flex flex-col sm:flex-row items-center sm:items-start justify-center md:justify-start"
      :class="!activeCheck ? 'gap-[16px] xl:gap-[24px]' : 'gap-[16px] xl:gap-[24px]'"
    >
      <div
        v-for="(item, index) of pools"
        :key="index"
        data-aos="fade-up"
        data-aos-once="true"
        :data-aos-delay="((index + 1) * 100) + 500"
      >
        <staking-card :item="item" :pool-blockchain-user="poolBlockchainUser[index]" :show-only-active="activeCheck" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue'
import CustomCheck from '~/components/atoms/custom-check.vue'
import StakingCard from '~/components/atoms/staking-card.vue'
import profileData from '~/data/profile.json'
import { useStaking } from '~/composables/useStaking'
import { useWeb3 } from '~/composables/useWeb3'

export default {
  setup() {
    const activeCheck = ref(false)
    const { pools, loadStakingPools, poolBlockchainUser, loadStakingPoolUser } = useStaking()
    const { web3Global } = useWeb3()

    onMounted(async () => {
      pools.value = []
      await loadStakingPools()
    })

    watch(() => [web3Global.walletConnected, web3Global.chain], async () => {
      pools.value = []
      await loadStakingPools()
    })

    watch(() => pools.value, () => {
      loadStakingPoolUser()
    })

    return {
      activeCheck,
      profileData,
      pools,
      poolBlockchainUser
    }
  },
  components: { CustomCheck, StakingCard }
}
</script>
