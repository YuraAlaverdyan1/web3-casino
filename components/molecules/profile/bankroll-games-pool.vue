<template>
  <div v-if="poolsArr.length" class="w-full px-[24px] md:px-[0px] mb-[20px]">
    <p class="text-[18px] font-[700]">
      Bankroll & Games Pool
    </p>
    <div class="flex items-center gap-[16px] mt-[16px]">
      <p class="text-[16px] font-[700]">
        Staked only
      </p>
      <custom-check :is-active="activeCheck" @click="activeCheck = !activeCheck" />
    </div>
    <div
      class="mt-[14px] flex flex-col sm:flex-row items-center sm:items-start justify-center md:justify-start"
      :class="!activeCheck ? 'gap-[16px] xl:gap-[24px]' : 'gap-[0px]'"
    >
      <div
        v-for="(item, index) of poolsArr"
        :key="index"
        data-aos="fade-up"
        data-aos-once="true"
        :data-aos-delay="((index + 1) * 100) + 500"
      >
        <games-pool-card
          :index="index"
          :item="item"
          :pool-blockchain-user="poolBlockchainUser[index]"
          :show-only-active="activeCheck"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue'
import CustomCheck from '~/components/atoms/custom-check.vue'
import profileData from '~/data/profile.json'
import { useStaking } from '~/composables/useStaking'
import { useWeb3 } from '~/composables/useWeb3'
import GamesPoolCard from '~/components/atoms/games-pool-card.vue'
import { useGamesPool } from '~/composables/useGamesPool'

export default {
  setup() {
    const activeCheck = ref(false)
    const { pools, poolBlockchainUser } = useStaking()
    const { web3Global } = useWeb3()
    const { poolsArr, loadGlobalBankroll } = useGamesPool()

    onMounted(async () => {
      poolsArr.value = []
      await loadGlobalBankroll()
    })

    watch(() => [web3Global.walletConnected, web3Global.chain], async () => {
      poolsArr.value = []
      await loadGlobalBankroll()
    })

    watch(() => pools.value, () => {
      loadGlobalBankroll()
    })

    return {
      activeCheck,
      profileData,
      pools,
      poolBlockchainUser,
      poolsArr
    }
  },
  components: { CustomCheck, GamesPoolCard }
}
</script>
