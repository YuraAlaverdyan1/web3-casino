<template>
  <div class="browse">
    <div class="browse_container">
      <div class="browse_container_input">
        <img src="/images/nav/search.png" alt="search_icon" class="browse_container_input_search">
        <CustomInput
          :text="searchedText"
          :type="'text'"
          placeholder="Search games ..."
          :fail="false"
          :border-color="'#424245'"
          :fill="false"
          class="outline-none"
          @input-text="(e) => (searchedText = e)"
        />
        <img src="/images/profile/user-info/close.png" alt="close_icon" class="browse_container_input_close">
      </div>
      <div v-if="searchedText" v-click-outside="clearInput" class="browse_container_results">
        <a
          v-for="(game, index) of searchedGames"
          :key="index"
          :href="`/games/${game.formattedName}`"
          class="browse_container_results_container"
          :class="game.formattedName === 'video-poker'
            ? 'browse_container_results_container_disabled'
            : ''
          "
        >
          <img :src="`/games/${game.formattedName}/modal-logo.webp`" alt="game_icon">
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { BreakPoint } from '~/model/break-points'
import gamesInfo from '~/data/ridotto-originals.json'

const router = useRouter()
const breakpoints = useBreakpoints(BreakPoint)

const isSmall = computed(() => breakpoints.smallerOrEqual('sm').value)
const searchedText = ref<string>('')
const searchedGames = ref([])

const clearInput = (): void => {
  searchedText.value = ''
}

onMounted(() => {
  if (!isSmall.value) {
    router.push('/')
  }
})

watch(
  () => searchedText.value,
  (newVal) => {
    if (!isSmall.value) {
      router.push('/')
    }
    searchedGames.value = gamesInfo.games.filter(
      game =>
        game.name.includes(newVal.toLowerCase()) ||
        game.type.includes(newVal.toLowerCase())
    )
  }
)
</script>

<style lang="scss" scoped>
.browse {
  position: fixed;
  z-index: 10;
  top: 72px;
  left: 0;
  height: calc(100vh - 128px);
  width: 100%;
  background-color: #171120;

  &_container {
    margin: 16px 20px;
    width: calc(100% - 40px);
    display: flex;
    align-items: center;
    flex-direction: column;

    ::-webkit-scrollbar {
      width: 6px !important;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 8px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    &_input {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;

      img {
        width: 18px;
        height: 18px;
        filter: brightness(0) invert(1) !important;
      }

      input {
        width: 100%;
        padding-left: 40px !important;
        height: 48px !important;
      }

      &_search {
        position: absolute;
        left: 16px;
      }

      &_close {
        position: absolute;
        right: 16px;

        &:hover {
          opacity: 0.8;
          cursor: pointer;
        }
      }
    }

    &_results {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      border-radius: 12px;
      margin-top: 8px;
      gap: 2%;
      max-height: calc(100vh - 208px);
      overflow-y: scroll;

      &_container {
        width: 32%;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        aspect-ratio: 1 / 1;

        img {
          width: 100%;
          aspect-ratio: 1 / 1;

          border-radius: 12px;

          &:hover {
            cursor: pointer;
            opacity: 0.9;
            border: 1px solid white;
          }
        }

        &_disabled {
          cursor: not-allowed !important;
        }
      }
    }
  }
}
</style>
