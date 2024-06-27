<template>
  <div class="container mt-[20px] lg:mt-[50px] w-full max-w-none" :class="menu ? 'opened-menu' : 'closed-menu'">
    <div class="mx-[16px] lg:mx-[0px] mt-[16px] lg:mt-[0px]">
      <ResolveRouter class="mb-[16px]" />
    </div>
    <become-the-house is-leaderbord class="hidden md:block" />
    <sports-template :sports-items="sportsItems">
      <div class="flex items-center justify-between gap-[12px] overflow-x-auto">
        <top-event v-for="(item, index) of topEvents" :key="index" :item="item" :index="index" />
      </div>
      <top-league
        v-for="(item, index) of sportsItems"
        :key="index"
        :all-games="allGames"
        :is-head-page="true"
        class="mt-[24px]"
        :sport="item.link"
      />
    </sports-template>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAzuro, ESports } from '../../../../composables/useAzuro'
import ridottoOriginals from '~/data/ridotto-originals'
import { useMenu } from '~/composables/useMenu'
import BecomeTheHouse from '~/components/organisms/become-the-house.vue'
import SportsTemplate from '~/components/organisms/sports/sports.vue'
import TopEvent from '~/components/organisms/sports/top-event.vue'
import TopLeague from '~/components/organisms/sports/top-league.vue'

export default {
  components: {
    BecomeTheHouse,
    SportsTemplate,
    TopEvent,
    TopLeague
  },
  props: {
    sportsItems: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { menu } = useMenu()
    const route = useRoute()
    const router = useRouter()
    const { allGames } = useAzuro()
    const currentPath = computed(() => {
      return route.path
    })
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()

    onMounted(() => {
      if (config.public.isProduction !== 'false') {
        router.push('404')
      }
    })
    const topEvents = computed(() => {
      if (route.path.includes('e-sports')) {
        return allGames.value.filter(e => e.sport.slug === ESports.LOL || e.sport.slug === ESports.CS2 || e.sport.slug === ESports.Dota).slice(0, 2).sort((a, b) =>
          a.startsAt - b.startsAt)
      }
      return allGames.value.slice(0, 2).sort((a, b) =>
        a.startsAt - b.startsAt)
    })

    return {
      menu,
      ridottoOriginals,
      currentPath,
      allGames,
      topEvents
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

.closed-menu {
  width: 89vw;
}

.opened-menu {
  width: 77vw;
}
</style>
