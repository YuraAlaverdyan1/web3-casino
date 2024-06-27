<template>
  <game class="video_poker-game" :last-info="true" :title-image="'/games/video-poker/title-image.png'">
    <template #game>
      <poker />
    </template>
    <template #roundInfo>
      <round-info class="mt-6" bets="multiBet" />
    </template>
    <template #fullWidthTable>
      <div :class="!table && 'disabled-table'" class="table">
        <div class="table-button" @click="hideTable">
          {{ tableName }} Table
          <img
            src="/games/video-poker/arrow-up.png"
            :style="!table && 'transform: rotate(180deg)'"
          >
        </div>
        <poker-info :table="table" />
      </div>
    </template>
  </game>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import game from '~/components/organisms/game.vue'
import pokerInfo from '~/components/atoms/games/video-poker/info.vue'
import poker from '~/components/atoms/games/video-poker/poker.vue'
import { useVideoPoker } from '~/composables/games/useVideoPoker'
import roundInfo from '~/components/atoms/games/round-info.vue'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { useMiniGames } from '~/composables/useMiniGames'
import { useWeb3 } from '~/composables/useWeb3'
import { useAuth } from '~/store/useAuth'
import { useGameStatus } from '~/composables/useGameStatus'

const table = ref(false)

const tableName = computed(() => {
  return table.value ? 'Hide' : 'Show'
})
const { format } = useWeb3()
const { account } = useWalletConnect()
const { valueBet } = useMiniGames()
const { userDetails } = useAuth()
const { gameStatus } = useGameStatus()
const { checkIsGameExists, getCurrentHand, hand, status } = useVideoPoker()

const hideTable = () => {
  table.value = !table.value
}

const fetchGameData = async () => {
  try {
    const { isFirstRequest, wager } = await checkIsGameExists()
    if (wager) {
      const result = await getCurrentHand()
      hand.value = result
      valueBet.value = format(wager)
      if (isFirstRequest) {
        status.value = 'Redraw Cards'
        gameStatus.value = { text: 'Continue your game', color: 'green' }
      } else {
        status.value = 'End Game'
      }
    }
  } catch (error) {
    console.log(error)
  }
}

watch(
  () => [account.value, userDetails.value],
  () => {
    if (!account.value?.address) {
      hand.value = [{}, {}, {}, {}, {}]
      valueBet.value = 0
      status.value = ''
    } else {
      fetchGameData()
    }
  },
  { deep: true }
)

onMounted(() => {
  if (!account.value?.address) {
    hand.value = [{}, {}, {}, {}, {}]
    valueBet.value = 0
    status.value = ''
  } else {
    fetchGameData()
  }
})
</script>

<style lang="scss" scoped>
.table-button {
  color: #ffdc7e;
  @apply cursor-pointer flex items-center justify-center gap-2 my-4;
}

.video_poker-game {
  min-height: 400px !important;
}

@media (max-width: 768px) {
  .disabled-table {
    border-radius: 12px;
    background: #201a29;
  }
}
</style>
