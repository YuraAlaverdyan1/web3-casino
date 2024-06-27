<template>
  <div class="w-full">
    <p class="text-[14px] font-[400] pb-[5px]">
      Bet Amount
    </p>
    <div class="flex items-center justify-between gap-[4px] lg:gap-0">
      <token-select
        :text="selectedToken?.symbol"
        :image="selectedToken?.symbol"
        :items="tokens"
        :token="selectedToken?.token"
        :check="false"
        item-styles="color: white"
        :disabled="isPlaying"
        @select="(e) => selectToken(e)"
      />
      <div class="relative w-full lg:w-auto min-w-[106px]">
        <bet-input
          :border-color="value < minBet ? '#FF4757' : '#9747FF'"
          class="buy-select-input"
          :fill="false"
        />
      </div>
      <button
        :disabled="isPlaying"
        class="bg-[#251F2D] hover:opacity-75 rounded-[6px] w-full max-w-[300px] lg:max-w-[48px] h-[48px] btnCounter text-[12px] font-[700]"
        @mouseover="hoverSound()"
        @click="[handleOption('1/2'), clickSound()]"
      >
        1/2
      </button>
      <button
        :disabled="isPlaying"
        class="bg-[#251F2D] hover:opacity-75 rounded-[6px] w-full max-w-[300px] lg:max-w-[48px] h-[48px] btnCounter text-[12px] font-[700]"
        @mouseover="hoverSound()"
        @click="[handleOption('2x'), clickSound()]"
      >
        2x
      </button>
    </div>
    <div class="flex items-center justify-between mt-[8px] gap-[4px]">
      <button
        v-for="(option, index) in options"
        :key="index"
        :disabled="isPlaying"
        class="bg-[#251F2D] hover:opacity-75 rounded-[6px] w-full min-w-[58px] lg:max-w-[67px] h-[36px] btnCounter text-[12px] font-[700]"
        @click="[handleOption(option), clickSound()]"
        @mouseover="hoverSound()"
      >
        {{ option }}
      </button>
      <button
        :disabled="isPlaying"
        class="rounded-[6px] btnMaxCounter w-full min-w-[67px] h-[36px] flex-grow"
        @click="handleMax"
        @mouseover="hoverSound()"
      >
        Max
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import TokenSelect from '~/components/atoms/games/token-select.vue'
import BetInput from '~/components/atoms/games/bet-input.vue'
import { useMiniGames } from '~/composables/useMiniGames'
import { useSound } from '~/composables/useSound'

export default {
  components: {
    TokenSelect,
    BetInput
  },
  props: {
    options: {
      type: Array,
      required: true,
      default: () => ['1/2', '2x', '10']
    },
    tokens: {
      type: Array,
      required: true,
      default: () => []
    },
    balance: {
      type: Number,
      required: false,
      default: 0
    },
    max: {
      type: Number,
      required: false,
      default: 0
    },
    minBet: {
      type: Number,
      required: false,
      default: 0
    }
  },
  setup(props) {
    const { valueBet, selectedToken, isPlaying } = useMiniGames()
    const value = ref(0)
    const { hoverSound, clickSound } = useSound()
    const selectToken = (e) => {
      selectedToken.value = e
    }
    watch(
      () => valueBet.value,
      () => {
        value.value = valueBet.value
      }
    )

    function handleOption(e) {
      const max = props.balance > props.max ? props.max : props.balance

      if (e === '1/2' && value.value > 0) {
        if (`${value.value / 2}`.split('.')[0] !== '0') {
          value.value = value.value / 2
        } else if (`${value.value / 2}`.split('.')[1].split('').length <= 7) {
          value.value = +`0.${`${value.value / 2}`
            .split('.')[1]
            .split('')
            .slice(
              0,
              `${value.value / 2}`
                .split('.')[1]
                .split('')
                .findIndex(e => e !== '0') + 2
            )
            .join('')}`
        }
      } else if (e === '2x' && value.value !== 0) {
        value.value = value.value * 2 > max ? max : value.value * 2
      } else if (`${e}`.split('.')[1] && `${e}`.split('.')[1].length > 0) {
        value.value =
          (+value.value + e).toFixed(Number(`${e}`.split('.')[1].length)) > max
            ? max
            : (+value.value + e).toFixed(Number(`${e}`.split('.')[1].length))
      } else {
        value.value =
          Number((+value.value + e).toFixed(0)) > Number(max)
            ? max
            : (+value.value + e).toFixed(0)
      }

      valueBet.value = value.value
    }
    function handleMax() {
      clickSound()
      value.value = props.balance > props.max ? props.max : props.balance
      valueBet.value = value.value
    }

    return {
      selectedToken,
      handleOption,
      value,
      handleMax,
      selectToken,
      isPlaying,
      hoverSound,
      clickSound
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(input) {
  height: 45px !important;
  font-weight: bold;
}

.btnMaxCounter {
  background-color: #9747ff;
  border: 1px solid #9747ff;
  transition-duration: 0.1s;

  &:hover {
    background-color: white;
    color: #38333f;
    border: 1px solid #38333f;
  }
}

.buy-select-input {
  @screen lg {
    width: 146px !important;
  }

  border-radius: 12px;
  height: 48px;
  width: 100%;
}
</style>
