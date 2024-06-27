<template>
  <ModalsBaseModal :active="active" :buy-tickets="true">
    <div>
      <div class="absolute top-4 flex w-full px-4 justify-between">
        <div class="text-xl text-white">
          Rewards
        </div>
        <div>
          <input type="image" src="/images/lottery/buy-tickets-modal/close.png" @click="close">
        </div>
      </div>
      <div class="mt-16 px-4 flex flex-col items-center">
        <img src="/images/lottery/special-lotteries/verify-logo.png">
        <LotteryArrows class="self-end mr-28" @next="next" @prev="prev" />
        <div class="lotteries flex gap-7 max-w-[890px]">
          <o-carousel
            v-model="activeItem"
            :arrow="false"
            :indicator="false"
            :items-to-show="itemsToShow"
            :repeat="false"
            :has-drag="true"
            class="mt-6"
          >
            <o-carousel-item v-for="(item, index) of rewards" :key="index" class="raw-card-wrapper">
              <div class="flex flex-col gap-5 relative raw-card">
                <div class="flex justify-between">
                  <div class="default-text">
                    Round No.
                  </div>
                  <div class="text-white">
                    #{{ item.round }}
                  </div>
                </div>
                <div class="flex justify-between">
                  <div class="default-text">
                    {{ item.wonMatch }} - you won
                  </div>
                  <div class="text-rd-new-won">
                    {{ item.won }}
                  </div>
                </div>
                <div class="flex justify-between">
                  <div class="default-text">
                    Draw Date
                  </div>
                  <div class="text-white">
                    {{ item.date }}
                  </div>
                </div>
                <div class="flex justify-between">
                  <div class="default-text">
                    Lottery Type
                  </div>
                  <div class="text-white">
                    {{ item.type }}
                  </div>
                </div>
                <div class="raw-card--light" :style="`border-bottom: 8px solid ${item.color};`">
                  <div class="text-start text-xl font-semibold">
                    Lucky Number
                  </div>
                  <div class="numbers mt-5 mb-10">
                    <div class="flex justify-between items-center  h-full gap-1">
                      <div v-for="(number, i) of item.lucky" :key="i">
                        <img :src="`/images/lottery/balls/${number}.png`">
                      </div>
                    </div>
                  </div>
                  <div class="text-start text-xl font-semibold">
                    Your Number
                  </div>
                  <div class="numbers mt-4">
                    <div class=" flex justify-between items-center  h-full gap-1">
                      <div v-for="(number, i) of item.myNumbers" :key="i" class="text-xl text-left">
                        {{ number }}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  :style="`background: ${item.color}; color: ${item.textColor ? item.textColor: 'white'};`"
                  class="details hover:opacity-75 w-full my-2 p-2 rounded-lg flex justify-center items-center gap-2"
                >
                  Claim Rewards
                </button>
              </div>
            </o-carousel-item>
          </o-carousel>
        </div>
      </div>
    </div>
  </ModalsBaseModal>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import rewards from '~/data/rewards.json'
import { BreakPoint } from '~/model/break-points'

export default {
    props: {
        active: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    emits: ['close'],
    setup(_props, { emit }) {
      const breakpoints = useBreakpoints(BreakPoint)
      const activeItem = ref(0)

      const close = () => {
        emit('close')
      }

        const next = () => {
            if (activeItem.value < Math.floor(rewards.length / 2)) {
                activeItem.value += 2
            } else {
                activeItem.value += 1
            }
        }

        const prev = () => {
            if (activeItem.value > 0) {
                activeItem.value -= 2
            }
        }
        const itemsToShow = computed(() => {
            if (breakpoints.between('sm', 'md').value) {
                return 1
            } else if (breakpoints.smallerOrEqual('sm').value) {
                return 1
            }
            return 2
        })

        return {
            close,
            rewards,
            next,
            prev,
            itemsToShow,
            activeItem
        }
    }
}
</script>

<style lang="scss" scoped></style>
