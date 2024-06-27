<template>
  <div
    :class="[
      +max < +valueBet ? 'error-max-container' : '',
      +balance < +valueBet ? 'error-bet-container' : '',
    ]"
  >
    <input
      v-model="valueBet"
      e2e-id="bet-input"
      :disabled="disabled"
      type="number"
      :style="[
        fill ? `background: ${backgroundColor}` : 'background: none',
        fill ? 'border: 1px solid #FF4757;' : `border: 1px solid ${borderColor};`,
      ]"
      maxlength="20"
      class="min-h-[48px] w-full p-4 lg:pr-9 custom-input outline-none"
      :class="+balance < +valueBet || +max < +valueBet ? 'error-bet' : ''"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSound } from '../../../composables/useSound'
import { MiniGames, useMiniGames } from '~/composables/useMiniGames'

export default defineComponent({
  props: {
    borderColor: {
      type: String,
      required: true
    },
    fill: {
      type: Boolean,
      required: true,
      default: false
    },
    backgroundColor: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup(_props) {
    const { valueBet, balance, max, isPlaying, ctaText, currentGame } = useMiniGames()

    const { errorSound } = useSound()
    const route = useRoute()
    const disabled = computed<any>(() => {
      return (
        isPlaying.value ||
        (currentGame.value === MiniGames.VideoPoker && ctaText.value !== 'Bet')
      )
    })

    watch(
      () => route,
      () => {
        valueBet.value = 0
      },
      { deep: true, immediate: true }
    )

    watch(
      () => [max.value, valueBet.value, balance.value],
      () => {
        if (+max.value < +valueBet.value || +balance.value < +valueBet.value) {
          errorSound()
        }
      }
    )

    return {
      valueBet,
      balance,
      max,
      isPlaying,
      ctaText,
      disabled
    }
  }
})
</script>

<style lang="scss" scoped>
input {
  border-radius: 12px;
  color: white;
}

.error-bet {
  border: 1px solid #ff4757;
}

.error-bet-container {
  &::after {
    content: "Insufficient balance";
    position: relative;
    top: 80%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #ff4757;

    @screen lg {
      top: 85%;
    }
  }
}

.error-max-container {
  &::after {
    content: "Max bet exceeded";
    position: relative;
    top: 80%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #ff4757;

    @screen lg {
      top: 85%;
    }
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0;
  /* <-- Apparently some margin are still there even though it's hidden */
}

input[type="number"] {
  -moz-appearance: textfield;
  /* Firefox */
}
</style>
