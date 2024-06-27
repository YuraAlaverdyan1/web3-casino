<template>
  <div
    class="absolute top-[100px] -left-[280px] flex justify-center items-center w-full h-full transition-all px-[24px] md:px-[0px]"
    :class="claimed ? 'z-[100] scale-100 opacity-100' : '-z-[100] scale-0 opacity-0'"
  >
    <div class="w-full h-full absolute left-0 top-0" @click.stop.prevent="setClaimed(false)" />
    <div class="bg-[#251F2D] border-[1px] border-[#0A0A0A] rounded-[12px] p-[24px] w-full max-w-[468px] relative z-[10]">
      <img
        src="/images/nav/close.svg"
        class="w-[24px] h-[24px] absolute right-[24px] top-[24px] scale-100 hover:scale-[1.05] cursor-pointer transition-all"
        @click.stop.prevent="setClaimed(false)"
      >
      <div class="flex gap-2">
        <img
          src="/svgs/diamond.svg"
          class="w-[24px]"
        >
        Congratulations
      </div>

      <p class="text-[14px] mt-4 font-light">
        You have succesfully claimed daily rewards of {{ currentClaimable.amount }} CAT.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { useDailyReward } from '~/composables/useDailyReward'

export default {
  setup() {
    const {
      claimed,
      setClaimed,
      currentClaimable
    } = useDailyReward()

    return {
      claimed,
      setClaimed,
      currentClaimable
    }
  }
}
</script>
