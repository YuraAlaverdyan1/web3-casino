<template>
  <div
    class="min-w-fit w-full h-[124px] bg-cover rounded-[12px] overflow-hidden p-[8px]"
    :style="`background-image: url('/betting/stadions/${resolveIcons && resolveIcons.stadion}${randomStadion}.webp')`"
  >
    <div class="stadion_bg h-[68px] p-[8px]">
      <div class="flex items-center justify-between gap-[15px]">
        <p class="text-[10px] font-[400]">
          {{ item.league.name }}
        </p>
        <p class="text-[10px] font-[400]">
          {{ resolveDate(item.startsAt) }}
        </p>
      </div>
      <div class="flex items-center justify-between mt-[4px]">
        <div v-for="(obj, i) of item.participants" :key="i" class="flex items-center gap-[4px] max-w-[50%]">
          <img
            alt="team icon"
            :src="obj.image"
            :onerror="`javascript:this.src='${secondIcon.bg}'`"
            class="w-[20px] h-[20px]"
          >

          <p class="text-[14px] font-[400] cut-text">
            {{ obj.name }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center gap-[4px] mt-[8px]">
      <bet-button v-for="(obj, index) of markets" :key="index" :item="obj" :event="item" />
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import ridottoOriginals from '~/data/ridotto-originals'
import sportsItems from '~/data/sports-items.json'
import { useAzuro } from '~/composables/useAzuro'
import BetButton from '~/components/organisms/sports/bet-button.vue'
import { useWeb3 } from '~/composables/useWeb3'
import { resolveGameIcons, random, sportToMarketMap } from '~/utils/helpers'

export default {
  components: {
    BetButton
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const route = useRoute()
    const markets = ref([])
    const { allGames, useSportEvent } = useAzuro()
    const { web3Global } = useWeb3()
    const randomStadion = ref(random(1, 3).toFixed(0))
    const currentPath = computed(() => {
      return route.path
    })
    const secondIcon = resolveGameIcons(props.item.sport.slug)

    const resolveDate = (date) => {
      const d = new Date(date * 1000)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      function padTo2Digits(num) {
        return String(num).padStart(2, '0')
      }

      const hoursAndMinutes =
        `${padTo2Digits(d.getHours())
        }:${padTo2Digits(d.getMinutes())}`

      if (today.toDateString() === d.toDateString()) {
        return `Today ${hoursAndMinutes}`
      } else if (tomorrow.toDateString() === d.toDateString()) {
        return `Tomorrow ${hoursAndMinutes}`
      } else {
        return `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ${hoursAndMinutes}`
      }
    }

    const resolveIcons = computed(() => {
      if (props.item.sport.slug) {
        return resolveGameIcons(props.item.sport.slug)
      }
      return null
    })

    const resolveGameMarkets = async () => {
      const data = await useSportEvent(props.item.id)
      if (data) {
        const defaultMarketName = 'Full Time Result'

        const sportName = data.game.sport.slug
        const marketName = sportToMarketMap[sportName] || defaultMarketName
        const outcomes = data.markets.find(e => e.marketName === marketName)?.outcomes[0] || []

        markets.value = outcomes.map(item => ({ ...item, marketName }))
      }
    }

    resolveGameMarkets()

    watch(() => allGames.value, () => {
      resolveGameMarkets()
    }
    )

    watch(() => web3Global.chain, () => {
      resolveGameMarkets()
    }, { deep: true, immediate: true })

    return {
      ridottoOriginals,
      sportsItems,
      currentPath,
      allGames,
      resolveDate,
      resolveGameMarkets,
      markets,
      secondIcon,
      resolveIcons,
      randomStadion
    }
  }
}
</script>

<style lang="scss" scoped>
.stadion_bg {
  border-radius: 12px;
  border: 1px solid var(--outline, #424245);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 1px 8px 0px rgba(23, 17, 32, 0.15);
  backdrop-filter: blur(10px);
}

.cut-text {
  width: 90%;
  max-width: 330px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
