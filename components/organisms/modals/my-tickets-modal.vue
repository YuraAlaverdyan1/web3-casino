<template>
  <ModalsBaseModal
    :active="active"
    :buy-tickets="true"
    classes="max-w-[466px] h-fit max-h-[90vh] p-[24px] overflow-hidden"
    @closed="close"
  >
    <div class=" h-full">
      <div class="flex w-full justify-between border-b-[1px] border-[#424245] pb-[12px]">
        <div class="text-xl text-white">
          Round {{ String(myTicketsModal.round).padStart(3, '0') }}
        </div>
        <div class="scale-100 hover:scale-[1.03] transition-all cursor-pointer">
          <img alt="close" src="/images/nav/close.svg" class="w-[16px] h-[16px]" @click="close">
        </div>
      </div>
      <div
        class="mt-[24px] flex flex-col items-center w-full bg-[#2C2634] rounded-[12px] p-[16px] max-h-[60vh] overflow-y-auto overflow-x-hidden"
      >
        <div v-for="(numbers, i2) of mytickets[0].tickets" :key="`${i2}`" class=" m-1 w-full">
          <div class="text-start text-xl font-normal mt-4">
            #00
          </div>
          <div class="numbers mt-4">
            <div :class="`flex justify-between items-center  h-full gap-1 bg-[#9E68FF] rounded-xl px-4`">
              <div v-for="(number, i3) of numbers" :key="`${i2}-${i3}`" class="text-xl text-left">
                {{ number }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalsBaseModal>
</template>

<script lang="ts">
import {
  computed,
  ref
} from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useLottery } from '../../../composables/useLottery'
import mytickets from '~/data/my-tickets.json'
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
    const activeItem = ref(0)
    const { myTicketsModal } = useLottery()
    const breakpoints = useBreakpoints(BreakPoint)

    const close = () => {
      emit('close')
    }

    const next = () => {
      if (activeItem.value < Math.floor(mytickets.length / 2)) {
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
      if (breakpoints.sm.value || breakpoints.md.value) {
        return 1
      } else if (breakpoints.smaller('sm').value) {
        return 1
      }
      return 2
    })
    return {
      close,
      next,
      prev,
      itemsToShow,
      activeItem,
      mytickets,
      myTicketsModal
    }
  }
}
</script>

<style lang="scss" scoped></style>
