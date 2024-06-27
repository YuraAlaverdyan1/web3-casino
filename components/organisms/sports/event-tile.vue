<template>
  <div>
    <p class="hidden md:block text-[14px] font-[200] pl-[16px] font-family">
      {{ getTime.hoursAndMinutes }}
    </p>
    <div
      class="bg-[#251F2D] border-[1px] border-[#424245] rounded-[12px] px-[16px] py-[6px] md:py-[8px] h-[118px] md:h-[68px] flex flex-col md:flex-row md:items-center gap-[6px] md:gap-[24px] md:mt-[5px]"
    >
      <p class="md:hidden text-[12px] font-[200] font-family">
        {{ getTime.fullDate }}
      </p>
      <div
        class="flex md:flex-col justify-between h-full bg-[#38333F] md:bg-transparent rounded-[4px] px-[12px] py-[6px] md:p-[0px] relative max-h-[32px] md:max-h-full"
      >
        <div
          class="md:hidden text-[14px] font-[400] absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]"
        >
          -
        </div>
        <div v-for="(item, index) of event.participants" :key="index" class="flex items-end">
          <div class="flex items-center gap-[6px]">
            <img
              alt="team icon"
              :src="item.image"
              :onerror="`javascript:this.src='${secondIcon.bg}'`"
              class="w-[18px] h-[18px]"
            >
            <div class="text-[14px] font-[400] cut-text">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-[5px] md:gap-[8px] w-full md:w-fit ml-auto">
        <bet-button
          v-for="(obj, index) of markets"
          :key="index"
          :item="obj"
          :event="event"
          :is-full-width="markets.length === 2"
          is-full-height
        />
        <NuxtLink
          :to="`/${sportLink}/${event.sport.slug}/${event.league.country.slug}/${event.league.slug}/${event.id}`"
          class="min-w-[40px] min-h-[40px] flex items-center justify-center md:hidden bg-[#171120] rounded-[4px]"
        >
          <img alt="arrow icon" class="rotate-[90deg]" src="/betting/arrow.svg">
        </NuxtLink>
      </div>
      <NuxtLink
        :to="`/${sportLink}/${event.sport.slug}/${event.league.country.slug}/${event.league.slug}/${event.id}`"
        class="hidden md:flex items-center gap-[4px] scale-100 hover:scale-[1.05] transition-all more-hover"
      >
        <p class="text-[12px] font-[700] text-[#FFDC7E] max-w-[50px] text-center">
          More Markets
        </p>
        <img alt="arrow icon" src="/betting/yellow-arrow.svg">
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { useAzuro, Sports } from '../../../composables/useAzuro'
import BetButton from '~/components/organisms/sports/bet-button.vue'
import { useWeb3 } from '~/composables/useWeb3'
import { resolveGameIcons, sportToMarketMap } from '~/utils/helpers'

export default {
  components: {
    BetButton
  },

  props: {
    event: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const markets = ref([])
    const { useSportEvent, allGames } = useAzuro()
    const { web3Global } = useWeb3()
    const route = useRoute()
    const secondIcon = resolveGameIcons(props.event.sport.slug)

    const resolveGameMarkets = async () => {
      const data = await useSportEvent(props.event.id)

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
    watch(() => route, () => {
      if (!markets.value.length) {
        resolveGameMarkets()
      }
    }
    )

    watch(() => web3Global.chain, () => {
      resolveGameMarkets()
    }, { deep: true, immediate: true })

    const getTime = computed(() => {
      const d = new Date(props.event.startsAt * 1000)
      function padTo2Digits(num) {
        return String(num).padStart(2, '0')
      }
      const hoursAndMinutes =
        `${padTo2Digits(d.getHours())
        }:${padTo2Digits(d.getMinutes())}`

      const fullDate = dayjs(props.event.startsAt * 1000).format('ddd, MMM DD HH:MM A')
      return { hoursAndMinutes, fullDate }
    })

    const sportLink = computed(() => {
      if (route.path.includes(Sports.ESports.toLocaleLowerCase())) {
        return Sports.ESports.toLocaleLowerCase()
      }
      return Sports.Sports.toLocaleLowerCase()
    })

    return {
      getTime,
      markets,
      secondIcon,
      sportLink
    }
  }
}
</script>

<style lang="scss" scoped>
.more-hover img {
  transition: all .3s;
  transform: rotate(0deg);
}

.more-hover:hover img {
  transition: all .3s;
  transform: rotate(-90deg);
}

.cut-text {
  max-width: 100px;
  width: 100%;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;

  @screen ss {
    max-width: 100%;
    width: 100%
  }
}
</style>
