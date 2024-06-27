<template>
  <div>
    <slot-game
      v-if="isMounted"
      :background="game.background"
      :panel="game.panel"
      :elements-panel="game.elementPanel"
      :elements="game.elements"
      :name="game.name"
      :name-panel="game.namePanel"
      :balance="wallet.balance"
    />
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import slotGame from '~/components/organisms/slot/slot-game.vue'
import gameData from '~/data/slot-games-data.json'
import wallet from '~/data/wallet.json'
export default {

  components: {
    slotGame
  },
  setup() {
    const game = ref<unknown>({})
    const isMounted = ref<boolean>(false)

    const Game = computed(() => {
      return localStorage.getItem('game')
    })

    onMounted(() => {
      game.value = Game.value
        ? gameData.find(el => el.name === Game.value)
        : gameData[0]
      isMounted.value = true
    })

    return {
      game,
      Game,
      gameData,
      wallet,
      isMounted
    }
  }
}
</script>

<style lang="scss" scoped></style>
