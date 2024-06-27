<template>
  <div class="container relative mx-auto">
    <div class="detail justify-center">
      <div class="w-full flex justify-between pb-2 gap-4 default-text">
        <span>Round No.</span>
        <div class="bg-[#38333F] flex gap-1 rounded-lg py-px px-2">
          #{{ round }}
          <img src="/images/lottery/icons/round.svg" alt="round icon">
        </div>
      </div>
    </div>
    <div class="detail py-[2px]">
      <div class="default-text">
        Draw Date
      </div>
      <div class="text-white">
        {{ date }}
      </div>
    </div>
    <div class="detail py-[2px]">
      <div class="default-text">
        Jackpot Size
      </div>
      <StakingBtn :color="color.textColor" :fill="false" class="flex items-center px-4">
        {{ jackpot }} <img class="pl-2" :src="`/tokens/${token}.svg`">
      </StakingBtn>
    </div>
    <div class="detail py-[2px]">
      <div class="default-text">
        Owner
      </div>
      <div class="text-white flex gap-1">
        0xe2....2f
        <img alt="user icon" src="/images/lottery/icons/user.svg">
      </div>
    </div>
    <div class="detail py-[2px]">
      <div class="default-text">
        Your Tickets
      </div>
      <div class="flex gap-2 items-center text-[#FFDC7E]" @click="myTicketsModal = { active: true, round }">
        View Tickets
        <img alt="ticket icon" src="/images/lottery/icons/ticket.svg">
      </div>
    </div>
    <div class="numbers h-36 mt-1" :style="`border-bottom: 8px solid ${color.lineColor};`">
      <div class="text-start text-xl font-semibold pl-4 pt-4 flex gap-2 items-center" :style="`color: white`">
        Lucky Number
        <img alt="info icon" src="/images/lottery/icons/info.svg">
      </div>
      <div class=" flex justify-center items-center mt-8 h-[40px] px-4 gap-1">
        <div v-for="(number, i) of numbers" :key="i">
          <img :src="`/images/lottery/balls/${number}.png`">
        </div>
      </div>
    </div>
    <button
      v-if="details === 'hidden' && !small"
      class="details w-full my-2 flex justify-center items-center gap-2"
      @click="$emit('show')"
    >
      Details <img src="/images/profile/user-info/purple-arrow.png" class="arrow">
    </button>
  </div>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { useLottery } from '../../../composables/useLottery'
export default {
  props: {
    index: {
      type: Number,
      required: true,
      default: 0
    },
    active: {
      type: Number,
      required: false,
      default: 0
    },
    round: {
      type: String,
      required: true,
      default: '0'
    },
    date: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: String,
      required: true,
      default: ''
    },
    jackpot: {
      type: String,
      required: true,
      default: ''
    },
    numbers: {
      type: Array as PropType<string[]>,
      required: true,
      default: () => []
    },
    token: {
      type: String,
      required: true,
      default: 'busd'
    },
    last: {
      type: Number,
      required: false,
      default: 0
    },
    details: {
      type: String,
      required: false,
      default: ''
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['prev', 'next', 'show'],
  setup(props) {
    const { myTicketsModal } = useLottery()
    const color = computed(() => {
      if (props.index % 3 === 0) {
        return {
          lineColor: '#6600FF',
          textColor: '#9E68FF'
        }
      } else if (props.index % 3 === 1) {
        return {
          lineColor: '#99FF00',
          textColor: '#B9FF6E'
        }
      }
      return {
        lineColor: '#FF6600',
        textColor: '#FFDC7E'
      }
    })
    return {
      color,
      myTicketsModal
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #2C2634;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 15px;
  min-height: 250px;
  transition-duration: .3s;

  &:hover {
    cursor: pointer;
    background-color: #3c3645;
  }
}

.details {
  color: #9E68FF;
}

.detail {
  @apply flex justify-between items-center my-4;
}

.numbers {
  height: 50px;
  background: #38333F;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3);
  border-radius: 12px;

  >div>div {
    flex: 1;

    >img {
      margin: auto;
    }
  }
}

.arrow {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .numbers-container {
    gap: 7px !important;
  }
}
</style>
