<template>
  <div class="w-full">
    <bankroll-games-pool v-if="config.public.isHideBankroll !== 'true'" />
    <staking-and-governance />
  </div>
</template>

<script lang="ts">
import BankrollGamesPool from '~/components/molecules/profile/bankroll-games-pool.vue'
import StakingAndGovernance from '~/components/molecules/profile/staking-and-governance.vue'
export default {
    components: { StakingAndGovernance, BankrollGamesPool },
    setup() {
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()
    return {
      config
    }
  }

}
</script>
