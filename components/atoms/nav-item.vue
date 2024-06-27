<template>
  <div class="flex flex-col gap-[20px]">
    <NuxtLink
      v-for="(item, index) of sportLeagues?.leagues"
      :key="index"
      :to="`${link}/${item.countrySlug}/${item.leagueSlug}/`"
      class="flex items-center gap-[4px] last:pb-[16px]"
    >
      <img alt="country icon" :src="resolveIconLeague(item.country)" class="w-[20px] h-[20px]">
      <div class="cut-text text-[14px] font-[400] text-left">
        {{ item.league }}
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useAzuro } from '~/composables/useAzuro'
import { resolveIconLeague } from '~/utils/helpers'

export default {
  props: {
    sport: {
      type: Object,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { allLeagues } = useAzuro()
    const sportLeagues = computed(() => {
      return allLeagues.value.find(e => e.sport === props.sport)
    })

    return {
      sportLeagues,
      resolveIconLeague

    }
  }

}

</script>

<style scoped>
.cut-text {
  width: 80%;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
