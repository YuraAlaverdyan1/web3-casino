<template>
  <div class="plinko-info">
    <div class="default-text text-xl font-medium">
      Rows
    </div>
    <div class="flex justify-between gap-2">
      <div class="default-text">
        8
      </div>
      <input
        v-model="selectedRows"
        :disabled="ballsInGameCount"
        type="range"
        min="8"
        max="16"
        class="w-full range"
      >
      <div class="default-text">
        16
      </div>
    </div>
    <div class="default-text text-xl font-medium">
      Risk
    </div>
    <div class="bttns">
      <staking-btn
        v-for="(btn, index) of bttns"
        :key="index"
        :fill="true"
        :color="activeBtnColor(btn)"
        hover-color="#9747FF"
        click-style="background: rgba(37, 31, 45, 0.4);"
        class="w-full"
        @click="setRule(btn)"
      >
        {{ btn }}
      </staking-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import stakingBtn from '~/components/atoms/staking-btn.vue'
import { usePlinko } from '~/composables/games/usePlinko'

const { setRows, setRule, rows, rule, ballsInGame } = usePlinko()

const selectedRows = ref(rows.value)

const ballsInGameCount = computed(() => {
  return ballsInGame.value
})

const activeBtnColor = (btn) => {
  return btn !== rule.value ? '#251F2D' : '#9747FF'
}

const bttns = [
  'Low',
  'Medium',
  'High'
]

watch(() => selectedRows.value, () => {
  setRows(selectedRows.value)
})

</script>

<style lang="scss" scoped>
.range {
  accent-color: #9747FF;
}

.range::-webkit-slider-runnable-track {
  border-radius: 12px;
}

.plinko-info {
  background: #201A29;
  border-radius: 12px;
  @apply flex flex-col gap-2 p-4;
}

.bttns {
  background: #2C2634;
  border-radius: 12px;
  border: 1px solid #424245;
  padding: 5px;
  button {
    height: 50px;
  }
  @apply flex items-center justify-between gap-2;
}
</style>
