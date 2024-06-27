<template>
  <div class="cw-container lg:text-right text-center flex justify-center">
    <w3m-button
      id="connect-button"
      :key="isUnsupported"
      :unsupported="isUnsupported"
      avatar-src="https://ridotto.io/images/team/profil/mohammed.svg"
    />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useWalletConnect } from '~/composables/useWalletConnect'

export default {
    setup() {
        const { chain, unsupportedChains } = useWalletConnect()

        const isUnsupported = computed(() => {
            return unsupportedChains.value.includes(chain.value?.id) || chain.value?.unsupported
        })

        return {
            isUnsupported
        }
    }
}
</script>

<style lang="scss" scoped>
.connect-wallet {
    border-radius: 12px;
    width: 180px;
    height: 50px;
    font-size: 20px;
    font-weight: 600;
}

@media (max-width: 1216px) {
    .cw-container {
        @apply w-full;
    }
}
</style>
