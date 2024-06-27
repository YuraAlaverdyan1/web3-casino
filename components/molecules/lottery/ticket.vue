<template>
  <div class="ticket-container p-4 pb-[30px]">
    <div class="flex justify-between ">
      <div class="default-text ticket mt-[5px] ml-[7px]">
        Ticket: <span class="text-white text-lg font-medium">{{ ticket }}</span>
      </div>
      <div class="flex items-center gap-2 mr-[10px] mt-[14px]">
        <button class="svg-button" @click="$emit('random', ticketIndex)">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 0V2.22222C14.2878 2.22222 17.7778 5.71111 17.7778 10C17.7778 14.2889 14.2878 17.7778 10 17.7778C5.71222 17.7778 2.22222 14.2889 2.22222 10C2.22222 7.94778 3.03889 6.01555 4.44445 4.57555V7.22222H6.66667V1.11111H0.555552V3.33333H2.54555C0.923333 5.14667 0 7.51 0 10C0 15.5133 4.48555 20 10 20C15.5144 20 20 15.5133 20 10C20 4.48667 15.5144 0 10 0Z"
              fill="#F5F5F7"
            />
          </svg>
        </button>
        <button class="svg-button" @click="$emit('delete', ticketIndex)">
          <svg width="26" height="20" viewBox="0 0 26 20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.8571 15.5L15.8571 11.5L19.8571 15.5L21.3928 13.9643L17.3571 10L21.3214 6.03571L19.7857 4.5L15.8571 8.5L11.8571 4.5L10.3214 6.03571L14.3571 10L10.3214 13.9643L11.8571 15.5ZM0.142822 10L6.17854 1.46429C6.48806 1.03571 6.85711 0.684524 7.28568 0.410714C7.71425 0.136905 8.19044 0 8.71425 0H23.7143C24.3035 0 24.808 0.209821 25.2276 0.629464C25.6473 1.04911 25.8571 1.55357 25.8571 2.14286V17.8571C25.8571 18.4464 25.6473 18.9509 25.2276 19.3705C24.808 19.7902 24.3035 20 23.7143 20H8.71425C8.19044 20 7.71425 19.8631 7.28568 19.5893C6.85711 19.3155 6.48806 18.9643 6.17854 18.5357L0.142822 10ZM2.82139 10L8.32139 17.8571H23.7143V2.14286H8.32139L2.82139 10ZM23.7143 10V2.14286V17.8571V10Z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="flex flex-col mt-[29px] px-[6px]">
      <div class="numbers flex gap-[7px]">
        <StakingBtn
          v-for="(number, index) of numbers"
          :key="index"
          :color="index === activeNumber ? '#9E68FF' : '#413C48'"
          :fill="true"
          class="w-full h-[50px]"
          @click="setActiveNumber(index)"
        >
          {{ number }}
        </StakingBtn>
      </div>
      <div v-if="activeTicket" class="grid grid-cols-5 justify-between gap-2 mt-4">
        <StakingBtn
          v-for="(el, index) of new Array(10)"
          :key="index"
          :color="'#413C48;'"
          :fill="index === activeChooseNumber ? true : false"
          @click="setActiveChooseNumber(index)"
        >
          {{ index }}
        </StakingBtn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'
export default {
  props: {
    ticketIndex: {
      type: Number,
      required: false,
      default: 0
    },
    ticket: {
      type: String,
      required: true,
      default: ''
    },
    numbers: {
      type: Array as PropType<any>,
      default: () => []
    },
    activeTicket: {
      type: Boolean,
      requried: true,
      default: false
    }
  },
  emits: ['random', 'delete', 'setActiveTicket', 'chooseNumber'],
  setup(props, { emit }) {
    const activeNumber = ref(-1)
    const activeChooseNumber = ref(-1)

    const setActiveNumber = (index) => {
      if (activeNumber.value >= 0 && activeNumber.value === index) {
        activeNumber.value = -1
        emit('setActiveTicket', -1)
      } else {
        emit('setActiveTicket', props.ticketIndex)
        activeNumber.value = index
      }
    }

    const setActiveChooseNumber = async (index) => {
      activeChooseNumber.value = index
      await emit('chooseNumber', { activeNumber: activeNumber.value, chooseNumber: activeChooseNumber.value })
      activeChooseNumber.value = -1
      activeNumber.value = -1
    }

    return {
      activeNumber,
      activeChooseNumber,
      setActiveNumber,
      setActiveChooseNumber
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-button {
  transition-duration: .1s;

  path {
    transition-duration: .1s;
    fill: white
  }
}

.svg-button:hover {
  path {
    fill: #9E68FF
  }
}

.ticket-container {
  background: #2C2634;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}

.ticket {
  font-size: 16px;

  span {
    font-size: 18px !important;
  }
}
</style>
