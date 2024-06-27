<template>
  <div class="personal-info-container mt-8">
    <div class="lottery-title text-xl">
      Personal Info Settings
    </div>
    <div class="default-text">
      Players will be able to see information about your account. Choose what information you do not want to display about your profile.
    </div>
    <div class="flex flex-col gap-4 mt-4">
      <o-checkbox v-model="statistics" variant="info" class="default-text">
        Hide Statistics
      </o-checkbox>
      <o-checkbox v-model="activity" variant="info" class="default-text">
        Hide Activity
      </o-checkbox>
      <o-checkbox v-model="playedGames" variant="info" class="default-text">
        Hide Played Games
      </o-checkbox>
      <o-checkbox v-model="challangesRewards" variant="info" class="default-text">
        Hide Challenges Rewards
      </o-checkbox>
      <o-checkbox v-model="allProfileData" variant="info" class="default-text">
        Hide all Profile Data
      </o-checkbox>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
    setup() {
        const statistics = ref(false)
        const activity = ref(false)
        const playedGames = ref(false)
        const challangesRewards = ref(false)
        const allProfileData = ref(false)

        return {
            statistics,
            activity,
            playedGames,
            challangesRewards,
            allProfileData
        }
    }
}
</script>

<style lang="scss" scoped>
    :deep(.o-chk__check) {
        padding: 8px;
        background-color: rgba($color: #000000, $alpha: 0) !important;
        border: 1px solid rgba(128, 127, 127, 0.35) !important;
    }
    :deep(.o-chk__check--checked) {
        background-color: #1FC0F0 !important;
    }
    .personal-info-container {
        padding: 20px;
        background: #201A29;
        border-radius: 12px;
        transition: .2s;
        max-width: 376px;
        margin: 0 auto;
        &:hover {
          background: #2C2634;
        }
    }
</style>
