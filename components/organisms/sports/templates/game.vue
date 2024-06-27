<template>
  <div class="container mt-[20px] lg:mt-[50px] w-full max-w-none" :class="menu ? 'opened-menu' : 'closed-menu'">
    <div class="mx-[16px] lg:mx-[0px] mt-[16px] lg:mt-[0px]">
      <ResolveRouter class="mb-[16px]" hide-last />
    </div>
    <div class="flex w-full flex-col lg:flex-row gap-[16px] mt-[40px]">
      <div
        class="lg:min-w-[calc(100%_-_400px)] lg:max-w-[calc(100%_-_400px)] md:border-[1px] md:border-[#424245] rounded-[12px] md:p-[24px] md:bg-[#201A29]"
      >
        <div
          :style="`background-image: url('/betting/stadions/${resolveIcons && resolveIcons.stadion}${randomStadion}.webp')`"
          class="h-[146px] md:rounded-[12px] bg-center bg-cover p-[24px] mb-[16px]"
        >
          <div class="blur-bg h-[56px] md:h-[98px] flex flex-col justify-center items-center w-full">
            <div v-if="gameInfo" class="flex items-center justify-between px-[8px] md:px-[24px] pt-[5px] w-full">
              <div class="flex gap-[4px] md:gap-[20px] items-center w-full max-w-[45%]">
                <img
                  alt="game icon"
                  :onerror="`javascript:this.src='${resolveIcons && resolveIcons.bg}'`"
                  :src="gameInfo.game && gameInfo.game.participants[0].image"
                  class="w-[30px] md:w-[50px] h-[30px] md:h-[50px]"
                >
                <p class="text-[14px] md:text-[16px] font-[700] cut-text">
                  {{ gameInfo.game && gameInfo.game.participants[0].name }}
                </p>
              </div>
              <div class="border-[1px] border-[#fff] rounded-[4px] p-[4px]">
                <p class="text-[10px] font-[400] uppercase">
                  {{ startDate.date }}
                </p>
                <p class="text-[14px] font-[800]">
                  {{ startDate.time }}
                </p>
              </div>
              <div class="flex gap-[4px] md:gap-[20px] items-center justify-end w-full max-w-[45%]">
                <p class="text-[14px] md:text-[16px] font-[700] cut-text">
                  {{ gameInfo.game && gameInfo.game.participants[1].name }}
                </p>
                <img
                  alt="game icon"
                  :onerror="`javascript:this.src='${resolveIcons && resolveIcons.bg}'`"
                  :src="gameInfo.game && gameInfo.game.participants[1].image"
                  class="w-[30px] md:w-[50px] h-[30px] md:h-[50px]"
                >
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col gap-[16px] border-[1px] border-[#424245] md:border-none rounded-[12px] p-[16px] md:p-0 bg-[#201A29] md:bg-transparent mx-[24px] md:mx-0"
        >
          <div
            v-for="(item, index) of gameInfo.markets"
            :key="index"
            class="border-[1px] border-[#424245] bg-[#251F2D] rounded-[12px] p-[8px]"
          >
            <div class="flex items-center gap-[8px] px-[12px]">
              <img alt="clip icon" src="/betting/clip.svg">
              <p class="text-[14px] font-[400]">
                {{ item.marketName }}
              </p>
              <img alt="info icon" src="/betting/info.svg">
            </div>
            <div class="flex flex-col gap-[8px] mt-[8px]">
              <div
                v-for="(obj, i) of item.outcomes"
                :key="i"
                :class="obj.length === 6 ? 'flex flex-col ss:grid ss:grid-cols-3' : obj.length === 4 ? 'flex flex-col ss:grid ss:grid-cols-2' : 'flex flex-col ss:flex-row'"
                class="w-full gap-[8px]"
              >
                <bet-button
                  v-for="(val, inx) of obj"
                  :key="inx"
                  :is-full-width="true"
                  :item="val"
                  :event="{ ...gameInfo.game, gameId: currentPath.split('_')[1] }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <my-bets />
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import ridottoOriginals from '~/data/ridotto-originals'
import { useMenu } from '~/composables/useMenu'
import sportsItems from '~/data/sports-items.json'
import MyBets from '~/components/organisms/sports/my-bets.vue'
import BetButton from '~/components/organisms/sports/bet-button.vue'
import { useAzuro } from '~/composables/useAzuro'
import { useLoading } from '~/composables/useLoading'
import { useWeb3 } from '~/composables/useWeb3'
import { resolveGameIcons, random } from '~/utils/helpers'

export default {
  components: {
    MyBets,
    BetButton
  },
  setup() {
    const { menu } = useMenu()
    const route = useRoute()
    const gameInfo = ref({})
    const { useSportEvent, allGames, isSportsPage } = useAzuro()
    const { loading } = useLoading()
    const { web3Global } = useWeb3()
    const randomStadion = ref(random(1, 3).toFixed(0))
    const currentPath = computed(() => {
      if (isSportsPage) {
        return route.path.split('/').reverse()[0]
      }
      return route.path
    })

    const resolveIcons = computed(() => {
      if (gameInfo.value.game) {
        return resolveGameIcons(gameInfo.value.game.sport.slug)
      }
      return null
    })

    const startDate = computed(() => {
      const date = dayjs(gameInfo.value.game?.startsAt * 1000).format('DD MMM')
      const time = dayjs(gameInfo.value.game?.startsAt * 1000).format('HH:MM')

      return { date, time }
    })

    const resolveGameMarkets = () => {
      loading.value.loading = true
      useSportEvent(currentPath.value).then((data) => {
        gameInfo.value = data
        loading.value.loading = false
      })
    }

    resolveGameMarkets()

    watch(() => allGames.value, () => {
      resolveGameMarkets()
    }
    )

    watch(() => web3Global.chain, () => {
      if (web3Global.chain.name === 'Mumbai') {
        resolveGameMarkets()
      }
    }, { deep: true, immediate: true })

    return {
      menu,
      ridottoOriginals,
      sportsItems,
      currentPath,
      gameInfo,
      startDate,
      resolveIcons,
      randomStadion
    }
  }
}
</script>

<style lang="scss" scoped>
.blur-bg {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 1px 8px 0px rgba(23, 17, 32, 0.15);
  backdrop-filter: blur(10px);
}

.cut-text {
  max-width: 90px;
  width: fit-content;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;

  @screen ss {
    max-width: 200px;
  }

  @screen sm {
    max-width: 60%;
  }

}
</style>
