<template>
  <div class="part-1">
    <div class="carousel relative">
      <o-carousel
        v-model="active"
        :arrow="false"
        :indicator="false"
        :items-to-show="1"
        :repeat="false"
        :has-drag="true"
      >
        <o-carousel-item v-for="(item, index) of data" :key="index" class="relative">
          <div
            :style="`background: linear-gradient(359deg, rgba(23, 17, 32, 0.00) 18.18%, #171120 103.75%, #23242F 103.75%), url('/images/lottery/banners/lottery_${index + 1}.webp') lightgray 50% / cover no-repeat`"
            class="banner-bg w-full sm:h-[661px] bg-center bg-no-repeat bg-cover overflow-hidden rounded-[12px] md:px-[64px] flex items-center justify-center"
          >
            <div
              style="background: rgba(23, 17, 32, 0.60)"
              class="w-full max-w-[696px] h-[300px] md:h-[403px] p-[24px] flex flex-col gap-[8px] items-center"
            >
              <p class="text-[16px] md:text-[20px] font-[700]">
                Next Draw in:
              </p>
              <div class="px-[20px] py-[10px] rounded-[12px] bg-[#F60] w-[221px] flex items-center justify-center">
                <vue-countdown v-slot="{ hours, minutes, seconds }" :time="2 * 24 * 60 * 60 * 1000">
                  <p class="text-[18px] md:text-[24px] font-[700]">
                    {{ String(hours).padStart(2, '0') }}h : {{ String(minutes).padStart(2, '0') }}m : {{
                      String(seconds).padStart(2, '0') }}s
                  </p>
                </vue-countdown>
              </div>
              <p class="text-[24px] md:text-[48px] font-[700] mt-[2px] md:-mt-[10px] text-center">
                RIDOTTO MONTHLY LOTTERY
              </p>
              <p class="text-[44px] ss:text-[75px] sm:text-[96px] font-[700] text-[#B9FF6E] -mt-[7px] ss:-mt-[27px]">
                130.500 RDT
              </p>
              <div
                class="hidden sm:block px-[48px] py-[16px] rounded-[12px] bg-[#60F] -mt-[18px] scale-100 hover:scale-[1.03] transition-all cursor-pointer"
                @click="ticketsModal = { active: true, lottery: '10K DAILY' }"
              >
                <p class="text-[28px] font-[700]">
                  Buy Tickets
                </p>
              </div>
            </div>
          </div>
        </o-carousel-item>
      </o-carousel>
      <div v-if="sm" class="details flex flex-col md:gap-8 gap-2">
        <div
          class="arrow-left -rotate-90 border-[1px] border-[#F5F5F7] rounded-[8px] h-[40px] w-[40px] flex items-center justify-center scale-100 hover:scale-[1.03] transition-all cursor-pointer"
          @click="active !== 0 ? active-- : active = data.length - 1"
        >
          <img alt="arrow" src="/betting/arrow.svg" class="selected-none">
        </div>
        <div
          class="arrow-right rotate-90 border-[1px] border-[#F5F5F7] rounded-[8px] h-[40px] w-[40px] flex items-center justify-center scale-100 hover:scale-[1.03] transition-all cursor-pointer"
          @click="active < data.length - 1 ? active++ : active = 0"
        >
          <img alt="arrow" src="/betting/arrow.svg" class="selected-none">
        </div>
      </div>
      <div v-if="sm" class="indicators">
        <button
          v-for="(indicator, index) of data"
          :key="index"
          class="scale-100 hover:scale-[1.03] transition-all cursor-pointer"
          :class="index === active ? 'active-indicator' : 'disabled-indicator'"
          @click="active = index"
        />
      </div>
      <div
        class="sm:hidden w-full flex items-center justify-center h-[40px] px-[48px] py-[16px] rounded-[12px] bg-[#60F] mt-[16px] scale-100 hover:scale-[1.03] transition-all cursor-pointer"
        @click="ticketsModal.active = true"
      >
        <p class="text-[14px] font-[700]">
          Buy Tickets
        </p>
      </div>
      <div
        class="sm:hidden w-full flex items-center justify-center gap-[8px] h-[40px] px-[48px] py-[16px] rounded-[12px] border border-[#E6E6E6] mt-[16px] scale-100 hover:scale-[1.03] transition-all cursor-pointer"
        @click="ticketsModal.active = true"
      >
        <p class="text-[14px] font-[700] text-[#D7C1FE]">
          Go to Lotteries
        </p>
        <img alt="arrow" src="/images/lottery/wishlist/arrow_right.svg" class="mt-[2px]">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { PropType, computed, ref } from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { BreakPoint } from '~/model/break-points'
import { useMenu } from '~/composables/useMenu'
import { useLottery } from '~/composables/useLottery'

export default {
  components: { VueCountdown },
  props: {
    smallDetails1: {
      type: Boolean,
      required: false,
      default: false
    },

    smallDetails2: {
      type: Boolean,
      required: false,
      default: false
    },
    details2Btn: {
      type: Boolean,
      required: false,
      default: false
    },
    data: {
      type: Object as PropType<any>,
      default: () => ({})
    },
    details2Title: {
      type: String,
      required: false,
      default: ''
    },
    details2SubTitle: {
      type: String,
      required: false,
      default: ''
    },
    details2BtnText: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['openModal', 'buyTicket'],
  setup() {
    const { menu } = useMenu()
    const active = ref(0)
    const breakpoints = useBreakpoints(BreakPoint)
    const { ticketsModal } = useLottery()

    const isSmall = computed(() => {
      return breakpoints.smallerOrEqual('sm').value
    })

    const sm = computed(() => breakpoints.sm.value)

    return {
      menu,
      active,
      isSmall,
      sm,
      breakpoints,
      ticketsModal
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-bg {
  background: linear-gradient(359deg, rgba(23, 17, 32, 0.00) 18.18%, #171120 103.75%, #23242F 103.75%);
}

.btn {
  border-radius: 12px;
  padding: 5px;
  color: white;
  font-size: 20px;
  font-weight: 500;
  transition: 0.4s;

  &:hover {
    background-color: #b484fa !important;
    box-shadow: -1px 1px 10px 3px #b484fa;
  }
}

.details {
  width: 90%;
  position: absolute;
  top: 50%;
  left: 10%;
}

.title {
  @screen lg {
    font-size: 2.7rem;
  }

  font-size: 2rem;
  line-height: 1.1;
}

.subtitle {
  @screen md {
    font-size: 16px;
  }

  font-size: 14px;
  width: 80%;
  color: #c5c6d3;
}

.active-indicator,
.disabled-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.active-indicator {
  background: #9e68ff;
}

.disabled-indicator {
  background: grey;
}

.indicators {
  width: 100%;
  bottom: -20px;

  @media (max-width: 768px) {
    bottom: 110px;
  }

  @apply flex justify-center gap-2 absolute;
}

.part-1 {
  margin-top: 40px;
}

.carousel {
  @apply relative flex flex-col justify-center items-start;
}

.arrow-left,
.arrow-right {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}

.arrow-left {
  left: -10%;
}

.arrow-right {
  right: 10px;
}

.closed-menu-arrow {
  right: -13%;
}

@media (max-width: 600px) {

  :deep(.o-car),
  :deep(.o-car__scene),
  :deep(.o-car__items) {
    height: 300px !important;
  }
}
</style>
