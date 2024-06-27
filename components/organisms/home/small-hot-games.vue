<template>
  <div class="mt-10">
    <div class="lottery-title">
      Hot Games
    </div>
    <ItemsNav
      :items="['Slots', 'Dice', 'Wheel']"
      :active="active"
      @set-active="(e) => (active = e)"
    />
    <div class="sort flex justify-between pr-4 my-10">
      <div class="flex items-center gap-2" style="color: #ffdc7e">
        Name
        <div class="flex flex-col gap-1">
          <input type="image" src="/images/profile/play/triangle-disabled.png">
          <input type="image" src="/images//images/profile/play/triangle.png">
        </div>
      </div>
      <div class="flex items-center gap-2" style="color: #ffdc7e">
        Top Gainer
        <div class="flex flex-col gap-1">
          <input type="image" src="/images/profile/play/triangle-disabled.png">
          <input type="image" src="/images//images/profile/play/triangle.png">
        </div>
      </div>
    </div>
    <div class="items flex flex-col gap-4">
      <SmallHotGame
        v-for="(game, index) of smallHotGames"
        :key="index"
        :game="game.game"
        :image="game.image"
        :title="game.title"
        :percent="game.percent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import smallHotGames from '~/data/small-hot-games.json'

export default {
  setup() {
    const active = ref(0)
    return {
      smallHotGames,
      active
    }
  }
}
</script>
