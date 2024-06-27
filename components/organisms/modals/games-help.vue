<template>
  <base-modal class="game-modal" @closed="$emit('closed')">
    <div class="flex justify-between">
      <div class="text-2xl font-semibold">
        {{ currentGameDetails?.name.toUpperCase() }}
      </div>
      <NuxtLink :to="$route.path" @click="$emit('close')">
        <img src="/images/profile/user-info/close.png">
      </NuxtLink>
    </div>
    <div class="flex justify-center">
      <img :src="`/games/${currentGameDetails?.formattedName}/modal-logo.webp`" style="width: 200px">
    </div>
    <div v-if="currentGameDetails?.link" class="info-containers gap-1">
      <game-modal-info-container
        v-for="(item, index) of data"
        :key="index"
        :games-info="data[3][1]"
        :description="item[1]"
        description-style="color: #B9FF6E;"
        :title="item[0]"
        title-style="color: white"
      />
    </div>
    <div>
      <div style="color: white; font-size: 24px; margin:15px 0">
        Game Description
      </div>
      <div style="color: #e6e6e6; font-size: 18px">
        {{ currentGameDetails?.description }}
      </div>
    </div>
  </base-modal>
</template>

<script  lang="ts">
import { computed, defineComponent } from 'vue'

import baseModal from '~/components/organisms/modals/base-modal.vue'
import gameModalInfoContainer from '~/components/atoms/game-modal-info-container.vue'
import { capitalizeEachWord } from '~/utils/capitalizeEachWord'
import { useMiniGames } from '~/composables/useMiniGames'
import gamesDetails from '~/data/ridotto-originals.json'

export default defineComponent({
  components: { baseModal, gameModalInfoContainer },
  setup() {
    const { currentGameDetails } = useMiniGames()
    const data = computed(() => {
      let gameDetails
      if (currentGameDetails.value) {
        gameDetails = currentGameDetails.value
      } else {
        gameDetails = gamesDetails.games[0]
      }
      return Object.entries(gameDetails).slice(Object.keys(gameDetails).length - 4)
    })

    return {
      data,
      currentGameDetails,
      capitalizeEachWord

    }
  }
})

</script>

<style lang="scss" scoped>
.info-containers {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-auto-rows: 33.3% 33.3% 33.3%;
}

:deep(.modal-container) {
  width: 800px;
  padding: 10px;
  gap: 15px;
  @apply flex flex-col justify-between;

  @screen sm {
    padding: 50px;
  }
}
</style>
