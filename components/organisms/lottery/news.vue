<template>
  <div class="flex flex-col gap-4 mt-8">
    <StakingBtn :disabled="true" :color="'#FFDC7E'" class="w-20 text-base" style="border-radius: 30px;">
      News
    </StakingBtn>
    <div class="text-3xl font-medium text-white">
      Lottery Round {{ newsData.round }}
    </div>
    <div class="default-text">
      Ridotto Daily lottery, round {{ newsData.round }} draw has been completed. {{ newsData.tickets }} tickets were sold, {{ newsData.players }} players earned prizes.
    </div>
    <NuxtLink class="go-to" to="/results">
      Go to results
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import newsData from '~/data/lottery-news.json'

export default {
    setup() {
        return {
            newsData
        }
    }
}
</script>

<style lang="scss" scoped>
    .go-to {
        color: #FFDC7E;
        width: 95px;
        transition: 0.2s;
        text-decoration: underline;
        &:hover {
            opacity: 0.8;
        }
    }
</style>
