<template>
  <div class="container mt-[20px] lg:mt-[50px] w-full max-w-none" :class="menu ? 'opened-menu' : 'closed-menu'">
    <div class="mx-[16px] lg:mx-[0px] mt-[16px] lg:mt-[0px]">
      <ResolveRouter class="mb-[16px]" />
    </div>
    <sports-template :sports-items="sportsItems">
      <top-league class="mt-[24px]" :sport="currentPath" :all-games="filteredGames" />
    </sports-template>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import ridottoOriginals from '~/data/ridotto-originals'
import { useMenu } from '~/composables/useMenu'
import SportsTemplate from '~/components/organisms/sports/sports.vue'
import TopLeague from '~/components/organisms/sports/top-league.vue'
import { useAzuro } from '~/composables/useAzuro'

export default {
  components: {
    SportsTemplate,
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
    const { allGames, isSportsPage } = useAzuro()

    const currentPath = computed(() => {
      if (isSportsPage) {
        return route.path.split('/')[2]
      }
      return route.path
    })

    const filteredGames = computed(() => {
      return allGames.value.filter(e => e.league.country.slug === route.path.split('/')[3] && e.sport.slug === route.path.split('/')[2])
    })

    return {
      menu,
      ridottoOriginals,
      currentPath,
      allGames,
      filteredGames
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
