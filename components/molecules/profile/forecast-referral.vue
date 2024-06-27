<template>
  <div>
    <div class="text-[24px] font-[500]">
      <p>Referral Return Forecast</p>
    </div>
    <div class="text-[16px] font-[400] leading-[24px] mt-[2px]">
      <p>Check how many points will you earn by inviting your friends:</p>
    </div>
    <div
      class="flex flex-col sm:flex-row md:flex-col lg+:flex-row gap-[2px] items-center justify-center bg-[#201A29] p-[12px] mt-4 rounded-[12px] border border-[#424245]"
    >
      <referral-card-prize
        title="Referred Friends"
        :right-text="referredFriends"
        :progress-bar="30"
        bg-color="#FF6600"
        accent-color="#9E68FF"
        :change-input="(e) => referredFriends = e"
      >
        <template #leftIcon>
          <img src="/profile/forecast/users.svg" alt="friends-icon" class="w-[24px] h-[24px]">
        </template>
      </referral-card-prize>

      <div class="rotate-[90deg] sm:rotate-[0deg] md:rotate-[90deg] lg+:rotate-[0deg]">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.5 16.8055L14.5 12.8055L10.5 8.80554"
            stroke="#E6E6E6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <referral-card-prize
        title="Average Spent"
        :right-text="averageSpent"
        bg-color="#9E68FF"
        accent-color="#FF6600"
        :change-input="(e) => averageSpent = e"
      >
        <template #leftIcon>
          <img src="/profile/forecast/bitcoin.svg" alt="dollar-icon" class="w-[24px] h-[24px]">
        </template>
      </referral-card-prize>
      <div class="rotate-[90deg] sm:rotate-[0deg] md:rotate-[90deg] lg+:rotate-[0deg]">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.5 16.8055L14.5 12.8055L10.5 8.80554"
            stroke="#E6E6E6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="rounded-lg p-4 w-full flex gap-4 justify-center items-center bg-[#6600FF] max-h-[60px]">
        <div class="text-[32px]">
          {{ referredFriends * averageSpent }}
        </div>
        <img src="/profile/carousel/diamond.svg" alt="point-icon" class="w-[31px] h-[31px]">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import ReferralCardPrize from '~/components/atoms/referral/referral-card-prize.vue'

export default {
  components: {
    ReferralCardPrize
  },
  setup() {
    const referredFriends = ref(20)
    const averageSpent = ref(10)

    const setReferredFriends = (num) => {
      referredFriends.value = num
    }

    return { referredFriends, averageSpent, setReferredFriends }
  }
}
</script>
