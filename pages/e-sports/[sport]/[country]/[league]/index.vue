<template>
  <league-template :sports-items="sportsItems" />
</template>

<script>

import LeagueTemplate from '~/components/organisms/sports/templates/league.vue'
import sportsItems from '~/data/e-sports-items.json'

export default {

  components: {
    LeagueTemplate
  },
  setup() {
    return { sportsItems }
  }
}
</script>
