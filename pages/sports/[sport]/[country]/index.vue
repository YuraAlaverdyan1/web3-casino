<template>
  <country-template :sports-items="sportsItems" />
</template>

<script>
import CountryTemplate from '~/components/organisms/sports/templates/country.vue'
import sportsItems from '~/data/sports-items.json'

export default {
  components: {
    CountryTemplate
  },
  setup() {
    return { sportsItems }
  }

}
</script>
