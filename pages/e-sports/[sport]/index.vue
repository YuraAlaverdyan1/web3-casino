<template>
  <sports-template :sports-items="sportsItems" />
</template>

<script>

import SportsTemplate from '~/components/organisms/sports/templates/sports.vue'
import sportsItems from '~/data/e-sports-items.json'

export default {

  components: {
    SportsTemplate
  },
  setup() {
    return { sportsItems }
  }

}
</script>
