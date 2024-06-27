<template>
  <div class="special-lottery-container scard">
    <div>
      <div :style="`background : ${bgColor}`" :class="`part-1 relative h-[200px]`">
        <div
          v-if="!home"
          class="absolute flex w-full items-center flex-col justify-between px-4 z-10 h-full text-white font-semibold text-3xl"
        >
          <img alt="image" src="/images/lottery/special-lotteries/dailybg.png" class="absolute z-[-1] bottom-0 left-0">
          <div class="w-full title font-bold text-left text-xl flex flex-col gap-4 mt-8">
            {{ title }}<br>
            <div class="flex gap-1 font-bold text-3xl items-center">
              {{ amount }} {{ tokenSymbol.toUpperCase() }}
              <img alt="token icon" :src="`/tokens/${tokenSymbol}.svg`">
            </div>
          </div>
          <div
            class="w-full flex justify-center mb-8 items-center bg-[#F5F5F7] rounded-[12px] scale-100 hover:scale-[1.03] transition-all cursor-pointer gap-[8px]"
            @click="ticketsModal = { active: true, lottery: title }"
          >
            <p class="text-[16px] font-[700] text-[#171120]">
              Buy Tickets
            </p>
            <img alt="buy icon" src="/images/lottery/wishlist/buy-icon.svg">
          </div>
        </div>
      </div>
      <div class="part-2 p-4 flex flex-col gap-4">
        <div class="flex justify-between details-p-1">
          <div class="date">
            {{ date }}
          </div>
        </div>
        <div class="text-white text-lg font-semibold">
          {{ detailsTitle }}
        </div>
        <div class="flex justify-between">
          <div class="flex flex-col gap-1">
            <div class="date">
              Jackpot
            </div>
            <div class="flex items-center gap-2 text-white font-semibold">
              {{ amount }} {{ tokenSymbol.toUpperCase() }} <img alt="token icon" :src="`/tokens/${tokenSymbol}.svg`">
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div class="date">
              Ends in
            </div>
            <div class="text-white font-semibold text-end flex gap-1">
              <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.3075 13.8625L13.32 12.85L9.7425 9.25002V4.72752H8.3925V9.79002L12.3075 13.8625ZM9 18.52C7.77 18.52 6.6075 18.2838 5.5125 17.8113C4.4175 17.3388 3.46125 16.6938 2.64375 15.8763C1.82625 15.0588 1.18125 14.1025 0.70875 13.0075C0.23625 11.9125 0 10.75 0 9.52002C0 8.29002 0.23625 7.12752 0.70875 6.03252C1.18125 4.93752 1.82625 3.98127 2.64375 3.16377C3.46125 2.34627 4.4175 1.70127 5.5125 1.22877C6.6075 0.75627 7.77 0.52002 9 0.52002C10.23 0.52002 11.3925 0.75627 12.4875 1.22877C13.5825 1.70127 14.5388 2.34627 15.3563 3.16377C16.1737 3.98127 16.8188 4.93752 17.2913 6.03252C17.7638 7.12752 18 8.29002 18 9.52002C18 10.75 17.7638 11.9125 17.2913 13.0075C16.8188 14.1025 16.1737 15.0588 15.3563 15.8763C14.5388 16.6938 13.5825 17.3388 12.4875 17.8113C11.3925 18.2838 10.23 18.52 9 18.52ZM9 17.17C11.1 17.17 12.9 16.42 14.4 14.92C15.9 13.42 16.65 11.62 16.65 9.52002C16.65 7.42002 15.9 5.62002 14.4 4.12002C12.9 2.62002 11.1 1.87002 9 1.87002C6.9 1.87002 5.1 2.62002 3.6 4.12002C2.1 5.62002 1.35 7.42002 1.35 9.52002C1.35 11.62 2.1 13.42 3.6 14.92C5.1 16.42 6.9 17.17 9 17.17Z"
                  fill="#F5F5F7"
                />
              </svg>
              {{ endIn }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between scard--light scard__actions divide-x-2 divide-x divide-rd-new-divider">
        <div class="flex flex-col gap-1 items-center basis-1/2 cursor-pointer" @click="handleMyTickets">
          <img alt="ticket icon" src="/svgs/ticket.svg" class="w-6">
          <span>
            My Tickets
          </span>
        </div>
        <div class="flex flex-col gap-1 items-center basis-1/2 cursor-pointer" @click="handleReward">
          <img alt="reward icon" src="/svgs/reward.svg" class="w-6">
          <span>
            Rewards
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useLottery } from '../../../composables/useLottery'

export default {
  props: {
    image: { type: String, required: true, default: '' },
    title: { type: String, required: true, default: '' },
    subtitle: { type: String, required: false, default: '' },
    amount: { type: String, required: true, default: '' },
    tokenSymbol: { type: String, required: true, default: '' },
    date: { type: String, required: true, default: '' },
    endIn: { type: String, required: true, default: '' },
    type: { type: String, required: true, default: 'lottery' },
    home: { type: Boolean, required: false, default: false },
    btnColor: { type: String, required: false, default: 'white' },
    bgColor: { type: String, required: false, default: 'white' }
  },
  setup(props, { emit }) {
    const detailsTitle = computed(() => {
      if (props.home) {
        return props.title
      }
      return 'Daily Lottery'
    })
    const { ticketsModal } = useLottery()

    const detailsSubTitle = computed(() => {
      if (props.home) {
        return props.subtitle
      }
      return 'Drawn Every Day, 24 Hours'
    })

    function handleReward() {
      emit('onReward')
    }

    function handleMyTickets() {
      emit('onMyTickets')
    }

    return {
      detailsTitle,
      detailsSubTitle,
      handleReward,
      handleMyTickets,
      ticketsModal
    }
  }
}
</script>

<style lang="scss" scoped>
.part-1,
.part-2 {
  border-radius: 12px;
}

.part-1:hover {
  .btn {
    filter: invert(1);
  }

  .img-banner {
    transform: scale(1.05);
    height: 51%;
    object-fit: cover;
    z-index: -1;
  }
}

.title {
  transition: transform .3s ease-out;

  @screen ss {
    font-size: 24px;
  }

  font-size: 40px;
}

.special-lottery-container {
  width: 98%;
  overflow: hidden;
  border-radius: 8px;
  transition: 0.2s;

  &:hover {
    background: #261e30;
  }
}

.part-1>img {
  transition: transform .6s;
}

.date {
  font-weight: 500;
  color: #E6E6E6;
}

@media (max-width: 1550px) {
  .btn {
    @screen lg {
      margin: 0 !important;
      height: 40px;
      font-size: 16px;
    }
  }

  .ticket-image {
    height: 28px;
  }
}
</style>
