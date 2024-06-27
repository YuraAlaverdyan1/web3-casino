<template>
  <div
    class="transition-all duration-500 overflow-y-hidden cursor-pointer relative z-[35]"
    :class="isSuggestedGamesOpen ? 'sm:mb-[20px] pb-[0px] sm:mt-[16px]' : 'mb-[0px] pb-[0px] sm:pb-[30px] mt-[0px]'"
    @mouseover="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="transition-all duration-500 overflow-y-hidden cursor-pointer"
      :class="[isSmall ? 'suggestions_mobile' : 'suggestions', isSuggestedGamesOpen ? 'min-h-[66px] max-h-[66px] sm:opacity-100' : 'min-h-[0px] max-h-[0px] sm:opacity-0']"
    >
      <NuxtLink
        v-for="(game, index) of onlyActiveGames"
        :key="index"
        class="suggestions_container"
        :class="{
          active: resolveRoutes.includes(game.formattedName),
        }"
        :to="game.link && `/games/${game.formattedName}`"
      >
        <img :src="game.image" alt="suggested_game">
        <h3 class="capitalize">
          {{ game.name }}
        </h3>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import ridottoOriginals from '~/data/ridotto-originals.json'
import { BreakPoint } from '~/model/break-points'
import { useMobileMenu } from '~/composables/useMobileMenu'

 // eslint-disable-next-line no-undef
 const config = useRuntimeConfig()

const onlyActiveGames = ref(ridottoOriginals.games.filter(game => game.contracts[config.public.appEnvConfig].isActive))

const { isSuggestedGamesOpen } = useMobileMenu()
const router = useRouter()
const route = useRoute()
const breakpoints = useBreakpoints(BreakPoint)
const resolveRoutes: string[] = router.currentRoute.value.path
  .split('/')
  .filter(route => route !== '')
const isSmall = computed(() => breakpoints.smallerOrEqual('sm').value)
const handleMouseEnter = () => {
  isSuggestedGamesOpen.value = true
}

watch(() => route, () => {
  isSuggestedGamesOpen.value = false
}, { deep: true, immediate: true })

const handleMouseLeave = () => {
  setTimeout(() => {
    isSuggestedGamesOpen.value = isSmall.value
  }, 1000)
}
</script>

<style lang="scss" scoped>
.suggestions {
  width: 100%;
  display: flex;
  overflow-x: auto;

  .active {
    border-bottom: 1px solid #9e68ff;
    color: #9e68ff;
  }

  &_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #424245;
    font-size: 12px;
    color: #e6e6e6;
    flex: 1;
    height: 66px;
    min-width: 91px;

    &:hover {
      background-color: #21182e;
      cursor: pointer;
    }

    img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #f5f5f7;
      margin-bottom: 2px;
    }
  }
}

.suggestions_mobile {
  position: fixed;
  bottom: 53px;
  left: 0;
  background-color: #171120;
  width: 100%;
  display: flex;
  overflow-x: auto;
  z-index: 10;

  .active {
    border-bottom: 1px solid #9e68ff;
    color: #9e68ff;
  }

  &_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #424245;
    font-size: 12px;
    color: #e6e6e6;
    flex: 1;
    height: 66px;
    min-width: 100px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #f5f5f7;
      margin-bottom: 2px;
    }
  }
}
</style>
