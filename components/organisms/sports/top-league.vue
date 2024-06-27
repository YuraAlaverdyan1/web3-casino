<template>
  <div v-if="!isHeadPage || resolveSportLeagues.length">
    <div
      class="w-full p-[16px] bg-cover min-h-[72px] rounded-[12px] overflow-hidden flex items-end border-[1px] border-[#424245]"
      :style="`background: linear-gradient(90deg, #171120 4.83%, rgba(23, 17, 32, 0.00) 55.08%), url(${resolveIcons.image}), lightgray 50% / cover no-repeat; ${resolveIcons.styles}`"
    >
      <div class="flex justify-between items-center w-full my-auto">
        <div class="flex items-center gap-[4px]">
          <img alt="game icon" :src="resolveIcons.icon">
          <p class="text-[16px] font-[700] capitalize">
            Top {{ leagueName }}
          </p>
        </div>
        <NuxtLink
          v-if="isHeadPage"
          :to="`/sports/${sport}`"
          class="px-[16px] py-[4px] bg-[#E6E6E6] rounded-[4px] cursor-pointer scale-100 hover:scale-[1.05]"
        >
          <p class="text-[12px] text-[#60F] font-[700]">
            VIEW ALL
          </p>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col gap-[24px] mt-[24px]">
      <league-tile
        v-for="(item, index) of resolveSportLeagues"
        :key="index"
        :item="item"
        :league="item.items[0].league.country.slug"
        :is-head-page="isHeadPage"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { random, resolveGameIcons } from '../../../utils/helpers'
import { Sports, ESports } from '../../../composables/useAzuro'
import LeagueTile from '~/components/organisms/sports/league-tile.vue'

export default {
  components: {
    LeagueTile
  },
  props: {
    isHeadPage: {
      type: Boolean,
      required: false,
      default: false
    },
    sport: {
      type: String,
      required: true,
      default: ''
    },
    allLeagues: {
      type: String,
      required: true,
      default: ''
    },
    allGames: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const resolveSportLeagues = computed(() => {
      const counterStrike = props.allGames.filter(e => e.sport.slug.includes('cs2'))
      const dota = props.allGames.filter(e => e.sport.slug.includes('dota'))
      const lol = props.allGames.filter(e => e.sport.slug.includes('lol'))
      let allLeagues
      if (props.sport.toLowerCase() === Sports.ESports || (props.sport.toLowerCase() === ESports.Tournaments && !props.isHeadPage)) {
        allLeagues = [...counterStrike, ...dota, ...lol]
      } else {
        allLeagues = props.allGames.filter(e => e.sport.slug.toLowerCase() === props.sport.toLowerCase())
      }
      const namesLeagues = [...new Set(allLeagues.map(item => item.league.name))]
      const finalArr = namesLeagues.map((e) => {
        return {
          name: e,
          items: [...allLeagues.filter(item => item.league.name === e)]
        }
      })
      if (props.isHeadPage) {
        return finalArr.slice(0, 2)
      }
      return finalArr
    })
    const ballX = random(1, 4).toFixed(0)
    const resolveIcons = resolveGameIcons(props.sport, ballX)

    const leagueName = computed(() => {
      if (props.sport.toLowerCase() === ESports.Tournaments) {
        return props.sport.split('-').join(' ')
      }
      if (resolveSportLeagues.value[0]?.items[0]?.sport.name) {
        return resolveSportLeagues.value[0]?.items[0]?.sport.name
      }

      return props.sport.split('-').join(' ')
    })
    return {
      resolveSportLeagues,
      resolveIcons,
      leagueName
    }
  }
}
</script>
