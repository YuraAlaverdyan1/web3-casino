<template>
  <div class="tile">
    <div class="h-[32px] flex items-center justify-between px-[12px] bg-[#38333F] rounded-t-[11px]">
      <div class="flex items-center gap-[4px] w-full">
        <img alt="bet icon" :src="resolveIcons.icon" class="w-[18px] h-[18px]">
        <div class="w-full">
          <div class="text-[14px] flex items-center w-full">
            <span class="cut-text">{{ item.game.participants[0].name }}</span>
            <span>&nbsp;-&nbsp;</span>
            <span class="cut-text">{{ item.game.participants[1].name }}</span>
          </div>
        </div>
      </div>
      <img
        alt="close icon"
        src="/betting/close-small.svg"
        class="cursor-pointer scale-100 hover:scale-[1.05] transition-all"
        @click="removeBet(item.game.gameId)"
      >
    </div>
    <div class="px-[12px] py-[4px] flex flex-col gap-[4px]">
      <p class="text-[12px] font-[400]">
        {{ item.bet.marketName }}
      </p>
      <div class="flex justify-between items-center">
        <p class="text-[14px] font-[700]">
          {{ item.bet.selectionName }}
        </p>
        <p class="text-[14px] font-[700] text-[#9E68FF]">
          {{ Number(item.bet.currentOdds).toFixed(2) }}
        </p>
      </div>
    </div>
    <div
      class="flex justify-between items-center px-[12px] transition-all overflow-hidden duration-300"
      :class="isSingle ? 'max-h-[70px] pb-[8px]' : 'max-h-[0px] pb-[0px]'"
    >
      <div
        class="flex px-[16px] py-[8px] gap-[8px] border-[1px]  max-w-[162px] rounded-[12px] overflow-hidden"
        :class="item.isError ? 'border-[#ED5565]':'border-[#424245]'"
      >
        <img alt="usdt icon" src="/tokens/usdt.svg">
        <input v-model="inputBet" class="bg-transparent border-0 outline-none">
      </div>
      <div class="flex flex-col justify-between">
        <p class="text-[14px] font-[400]">
          Possible Win
        </p>
        <p class="text-[14px] font-[700] text-[#B9FF6E] text-right">
          {{ Number(inputBet * item.bet.currentOdds).toFixed(2) }} USDT
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useAzuro } from '../../../composables/useAzuro'
import { resolveGameIcons } from '../../../utils/helpers'
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    isSingle: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const inputBet = ref(props.item.wager)
    const { betslips, wager } = useAzuro()

    watch(() => inputBet.value, () => {
      const bet = betslips.value[betslips.value.findIndex(e => e.game.gameId === props.item.game.gameId)]
      bet.wager = inputBet.value
      bet.isError = false
    })
    const resolveIcons = resolveGameIcons(props.item.game.sport.slug)
    const removeBet = (id) => {
      betslips.value = betslips.value.filter(e => e.game.gameId !== id)
    }
    return {
      resolveIcons,
      inputBet,
      removeBet,
      wager
    }
  }
}
</script>

<style scoped>
.tile {
  border-radius: 12px;
  border: 1px solid #424245;
  background: #251F2D;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.cut-text {
  max-width: 50%;
  width:fit-content;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
