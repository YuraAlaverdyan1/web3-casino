<template>
  <my-bets-template :sports-items="sportsItems" />
</template>

<script>

import MyBetsTemplate from '~/components/organisms/sports/templates/my-bets.vue'
import sportsItems from '~/data/e-sports-items.json'

export default {

  components: {
    MyBetsTemplate
  },
  setup() {
    return { sportsItems }
  }

}
</script>
