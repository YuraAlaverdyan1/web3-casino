<template>
  <game :title-image="'/games/coinflip/title-image.png'">
    <template #roundInfo>
      <round-info
        :ininal-message="`Flip a coin and let fortune decide your fate!`"
        bets="multiBet"
      />
    </template>
    <template #sideText>
      <div class="side-text">
        {{ sideText }}
      </div>
    </template>
    <template #game>
      <coin :is-small="isSmall" @stop-flipping="(e) => stopFlipping(e)" />
    </template>
    <template v-if="!isSmall" #info>
      <pick-side />
    </template>
  </game>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import game from '~/components/organisms/game.vue'
import pickSide from '~/components/atoms/games/coinflip/pick-side.vue'
import coin from '~/components/atoms/games/coinflip/coin.vue'
import { BreakPoint } from '~/model/break-points'
import roundInfo from '~/components/atoms/games/round-info.vue'

const breakpoints = useBreakpoints(BreakPoint)

const side = ref(false)

const isSmall = computed(() => {
  return breakpoints.smaller('sm').value
})

const sideText = computed(() => {
  return side.value ? 'Heads' : 'Tails'
})
</script>

<style lang="scss" scoped>
.flip-btn {
  .flip-icon {
    transition: 0.4s;
    background: none !important;
  }

  &:hover {
    box-shadow: 0px 10px 20px 0px rgba(158, 104, 255, 0.5);

    .flip-icon {
      transform: rotate(180deg);
    }
  }
}

.side-text {
  color: #b9ff6e;
  @apply absolute bottom-2 left-0 right-0 m-auto text-center text-xl;
}
</style>
