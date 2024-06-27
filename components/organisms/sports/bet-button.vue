<template>
  <div
    :class="[active ? 'bg-[#60F]' : 'bg-[#171120]', isFullHeight ? 'h-[40px] md:h-[32px]' : 'h-[32px]', isFullWidth ? 'flex items-center gap-[30px] min-w-[70px] md:min-w-[93px] w-full hover:scale-[1.02]' : 'min-w-[80px] md:w-[93px] hover:scale-[1.05]']"
    class="w-full rounded-[4px] flex justify-between items-center h-[32px] px-[12px] cursor-pointer scale-100 transition-all"
    @click="addHandleBet(item)"
  >
    <div class="text-[14px] font-[400] min-w-fit">
      {{ item.selectionName }}
    </div>
    <p class="text-[14px] font-[700]">
      {{ resolveOdds }}
    </p>
  </div>
</template>

<script>

import { ref, watch, computed } from 'vue'
import { useAzuro } from '../../../composables/useAzuro'
import { decToFrac, decToUs } from '../../../utils/helpers'
export default {

  props: {
    item: {
      type: Object,
      required: true
    },
    event: {
      type: Object,
      required: true
    },
    isFullWidth: {
      type: Boolean,
      required: true
    },
    isFullHeight: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const { addBet, betslips, oddsFormat } = useAzuro()
    const active = ref(false)
    watch(() => betslips.value, () => {
      if (betslips.value.find(e => e.bet.id === props.item.id)) {
        active.value = true
      } else {
        active.value = false
      }
    }, { deep: true, immediate: true })
    const addHandleBet = (bet) => {
      addBet(bet, props.event)
    }

    const resolveOdds = computed(() => {
      if (oddsFormat.value === 'eu') {
        return Number(props.item.currentOdds).toFixed(2)
      } else if (oddsFormat.value === 'uk') {
        return decToFrac(props.item.currentOdds)
      } else {
        return decToUs(props.item.currentOdds)
      }
    })
    return {
      addHandleBet,
      active,
      resolveOdds
    }
  }
}
</script>
