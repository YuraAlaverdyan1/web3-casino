<template>
  <sports-main-template :sports-items="sportsItems" />
</template>

<script>

import SportsMainTemplate from '~/components/organisms/sports/templates/main.vue'
import sportsItems from '~/data/e-sports-items.json'

export default {

  components: {
    SportsMainTemplate
  },
  setup() {
    return { sportsItems }
  }

}
</script>
