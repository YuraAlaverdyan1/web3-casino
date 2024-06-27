<template>
  <staking-btn
    :fill="true"
    :color="color"
    :hover-color="
      Object.keys(userDetails).length > 0 && !isPlaying ? '#9E68FF' : '#424245'
    "
    :click-style="clickStyle"
    :disabled="isDisabledButton"
    disabled-bg-color="#424245"
    class="bet-btn relative"
  >
    <slot />
    <img
      class="w-[31px] h-[31px] !bg-transparent"
      :src="`/games/icons/${game}${ctaText === 'Cash Out' ? '-claim' : ''}.svg`"
    >
    <div
      v-if="Object.keys(userDetails).length === 0"
      :class="Object.keys(userDetails).length === 0 && 'tooltip'"
      class="absolute -top-[15px] left-[10px] flex justify-center items-center bg-[#2C2634] rounded-[8px] w-[182px] h-[48px]"
    >
      <p class="text-[12px] font-[400] bg-transparent text-[#fff]">
        Connect your Wallet to Play
      </p>
      <div class="bg-[#2C2634] w-[7px] h-[7px] absolute -bottom-[3px] rotate-[45deg]" />
    </div>
  </staking-btn>
</template>

<script>
import { computed } from 'vue'
import { useAuth } from '../../../store/useAuth'
import { useMiniGames } from '../../../composables/useMiniGames'
import { useChiFouMi } from '~/composables/games/useChiFouMi'
export default {
  props: {
    game: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup() {
    const { userDetails } = useAuth()
    const {
      isPlaying,
      currentGame,
      valueBet,
      ctaText,
      isDisabledPlayBtn
    } = useMiniGames()
    const { hand } = useChiFouMi()

    const color = computed(() => {
      if (ctaText.value === 'Cash Out') {
        return '#FF6600'
      }
      return Object.keys(userDetails.value).length > 0 && !isPlaying.value
        ? '#60F'
        : '#424245'
    })

    const clickStyle = computed(
      () =>
        `color: ${
          Object.keys(userDetails.value).length > 0 ? '#FFDC7E' : '#fff'
        }; background: ${Object.keys(userDetails.value).length > 0 ? '#60F' : '#424245'}`
    )
    const isDisabledButton = computed(() => {
      if (valueBet.value <= 0 || isDisabledPlayBtn.value || (currentGame.value === 'chi-fou-mi' && hand.value === -1)) {
        return true
      }
      return false
    })
    return {
      userDetails,
      isPlaying,
      clickStyle,
      isDisabledButton,
      color,
      ctaText,
      isDisabledPlayBtn
    }
  }
}
</script>

<style lang="scss" scoped>
.bet-btn .tooltip {
  transition: all 0.3s;
  opacity: 0;
}

.bet-btn:hover .tooltip {
  transition: all 0.3s;
  opacity: 100;
}
</style>
