<template>
  <div>
    <div class="flex justify-between lottery-title mb-4">
      Activity <button class="link-text text-base">
        Details
      </button>
    </div>
    <div class="flex gap-2 mb-4 sm:flex-row flex-col">
      <InfoContainer :play-build="true" :latest-draw="true" :title="'Games Played'" :subtitle="profileData.play.games" />
      <InfoContainer :play-build="true" :latest-draw="true" :title="'Bonus Prizes'" :subtitle="profileData.play.bonusPrizes" />
      <InfoContainer :play-build="true" :latest-draw="true" :title="'Challenges Complete'" :subtitle="profileData.play.challangesComplete" />
    </div>
  </div>
</template>

<script lang="ts">
import profileData from '~/data/profile.json'
export default {
    setup() {
        return {
            profileData
        }
    }
}
</script>
