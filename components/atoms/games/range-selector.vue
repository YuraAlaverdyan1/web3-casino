<template>
  <div class="w-full bg-[#201a29] mx-[1px] pt-[4px] px-[12px] pb-[4px] rounded-lg">
    <div class="w-full flex justify-between">
      <span class="text-[14px] font-[400] text-[#E6E6E6]">{{ title }}</span><span class="text-[14px] font-[700]">{{
        valueMultipleBet }}</span>
    </div>
    <div>
      <input
        v-model="valueMultipleBet"
        class="range w-full"
        type="range"
        name="slider"
        min="1"
        :disabled="valueBet <= 0 || isPlaying"
        :max="100"
      >
    </div>

    <div class="w-full text-rd-green flex justify-between mt-[17px] pr-[25px]">
      <p class="text-[12px] text-[400]">
        {{ leftText }}
      </p>
      <p class="text-[12px] text-[400]">
        {{ selectedToken.symbol }} {{ (potencialWin * valueBet * valueMultipleBet).toFixed(2) }}
      </p>
    </div>
    <div v-if="autoClaim">
      <div class="w-full flex justify-between items-center mt-2 relative tooltip-main select-none">
        <div class="tooltip absolute bottom-[100%] left-0 bg-[#2C2634] rounded-[8px]">
          <p>
            Enabling Auto-Claim reduces
            transaction counts, allowing your rewards to
            be automatically claimed in the next round or utilized
            in a subsequent bet. Any remaining balance is promptly
            returned. If preferred, you can disable this feature to
            manually claim rewards after each round, providing
            flexibility in managing your earnings.
          </p>
        </div>
        <div class="flex flex-col">
          <span class="text-xl">Auto-Claim</span>
          <span class="font-light text-[#E6E6E6]">Rewards auto-claimed on next play</span>
        </div>
        <span> <o-switch v-model="autoClaimSwitch" :disabled="isPlaying" /></span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSound } from '../../../composables/useSound'
import { useMiniGames } from '~/composables/useMiniGames'
import { useWeb3 } from '~/composables/useWeb3'
import { resolveGame } from '~/utils/web3/resolveGame'

export default {
  props: {
    title: {
      type: String,
      default: 'Multiple Bets'
    },
    leftText: {
      type: String,
      default: 'Potential Win'
    },
    max: {
      type: Number,
      default: 100
    },
    autoClaim: {
      type: Boolean,
      default: true
    }
  },
  events: ['onAutoclaim'],
  setup(_props, { emit }) {
    const { allowance } = useWeb3()
    const autoClaimSwitch = ref(true)
    const { selectedToken, valueBet, potencialWin, valueMultipleBet, balance, unclaimTokens, isPlaying, currentGame } = useMiniGames()
    const allowanceValue = ref(0)
    const { increaseSound, decreaseSound, switchSound } = useSound()
    const route = useRoute()
    watch(() => autoClaimSwitch.value, () => {
      emit('onAutoclaim', autoClaimSwitch.value)
    }, { immediate: true })

    watch(() => autoClaimSwitch.value, () => {
      switchSound()
    })
    watch(() => route, () => {
      valueMultipleBet.value = 1
    }, { deep: true, immediate: true })

    watch(() => valueBet.value, () => {
      const maxValue = Math.trunc((balance.value + unclaimTokens.value) / valueBet.value) > 100 && Math.trunc(balance.value / valueBet.value) > 100 ? 100 : Math.trunc((balance.value + unclaimTokens.value) / valueBet.value) < Math.trunc(balance.value / valueBet.value) ? Math.trunc((balance.value + unclaimTokens.value) / valueBet.value) : Math.trunc(balance.value / valueBet.value)
      if (valueMultipleBet.value > maxValue) {
        valueMultipleBet.value = maxValue
      }
    })

    watch(() => valueMultipleBet.value, (newValue, oldValue) => {
      if (newValue > oldValue) {
        increaseSound()
      } else {
        decreaseSound()
      }
    })

    watch(() => selectedToken.value, async () => {
      const contractAddress = resolveGame(currentGame.value)
      const value = await allowance(
        selectedToken.value.token,
        contractAddress
      )
      if (value) {
        allowanceValue.value = value
      }
    })

    return {
      valueMultipleBet,
      autoClaimSwitch,
      potencialWin,
      valueBet,
      selectedToken,
      balance,
      unclaimTokens,
      allowanceValue,
      isPlaying
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip {
  max-height: 0px;
  padding: 0px 10px;
  overflow: hidden;
  transition: all .3s;
}

.tooltip-main:hover .tooltip {
  max-height: 500px;
  overflow: hidden;
  padding: 10px;
  transition: all .3s 500ms;
}

.range {
  background: #000;
  height: 4px;
  outline: none;
  cursor: pointer;
  accent-color: #6600ff;
}
</style>
