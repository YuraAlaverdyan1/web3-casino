<template>
  <div>
    <div class="flex justify-between items-center transition-all cursor-pointer mb-[7px]">
      <NuxtLink
        :to="item.items[0] ?`/sports/${item.items[0].sport.slug}/${item.items[0].league.country.slug}/${item.items[0].league.slug}` : '/404'"
        class="flex items-center gap-[8px] pl-[4px]"
      >
        <img alt="league icon" :src="resolveIconLeagueItem" class="w-[20px] h-[20px]">
        <p class="text-[14px] font-[700]">
          {{ item.name }}
        </p>
      </NuxtLink>
      <div
        class="p-[8px] rounded-[8px] border-[1px] border-[#3B3C4E] transition-all scale-100 hover:scale-[1.02]"
        @click="isOpenList = !isOpenList"
      >
        <img alt="arrow icon" src="/betting/arrow.svg" class="transition-all duration-300" :class="isOpenList ? 'rotate-0' : 'rotate-180'">
      </div>
    </div>
    <div
      class="overflow-hidden transition-all duration-500 flex flex-col gap-[16px]"
      :class="isOpenList ? 'max-h-[8000px]' : 'max-h-[0px]'"
    >
      <div v-for="(i, index) of resolveDate" :key="index">
        <div class="bg-[#38333F] rounded-[12px] px-[16px] py-[8px] mb-[11px]">
          <p class="text-[14px] font-[400]">
            {{ i.date }}
          </p>
        </div>
        <div class="flex flex-col gap-[8px] sm:gap-[5px]">
          <div v-for="(obj, idx) of i.events" :key="idx">
            <event-tile :event="obj" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import EventTile from '~/components/organisms/sports/event-tile.vue'
import { resolveIconLeague } from '~/utils/helpers'

export default {
  components: {
    EventTile
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    league: {
      type: Object,
      required: true
    },
    isHeadPage: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    const isOpenList = ref(true)
    const resolveIconLeagueItem = resolveIconLeague(props.league)

    const resolveDate = computed(() => {
      const datesArr = props.item.items.map((item) => {
        const d = new Date(item.startsAt * 1000)

        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      })
      let uniqDatesArr = [...new Set(datesArr.map(item => item))]

      if (props.isHeadPage) {
        uniqDatesArr = uniqDatesArr.splice(0, 2)
      }

      return uniqDatesArr.map((item) => {
        const dateEvents = props.item.items.filter((i) => {
          const d = new Date(i.startsAt * 1000)
          const formattedDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          return formattedDate === item
        }).sort((a, b) => a.startsAt - b.startsAt)

        return { date: item, events: props.isHeadPage ? dateEvents.splice(0, 2) : dateEvents }
      })
    })

    return {
      resolveIconLeagueItem,
      resolveDate,
      isOpenList
    }
  }
}
</script>
