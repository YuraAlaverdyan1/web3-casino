<template>
  <div class="flex items-center justify-between gap-[12px] flex-col lg:flex-row px-[24px] md:px-[0px]">
    <div class="w-full bg-[#201A29] h-[256px] md:h-[184px] flex flex-col justify-between p-[24px] rounded-[12px]">
      <p class="text-[16px] font-[700] ">
        GET YOUR 25% COMMISSION REWARDS
      </p>
      <p class="text-[15px] text-[#FFDC7E] leading-[18px]">
        You will receive commission rewards every time your friends place wager based on the games.
      </p>
      <div
        class="border-[1px] border-[#F5F5F7] flex items-center w-full max-w-[200px] h-[40px] justify-center gap-[8px] rounded-[12px]"
      >
        <p class="text-[16px] font-[700]">
          Learn More
        </p>
        <img src="/images/profile/user-info/information-icon.svg">
      </div>
    </div>
    <div class="w-full bg-[#201A29] h-[256px] md:h-[184px] flex flex-col justify-between p-[24px] rounded-[12px]">
      <p class="text-[16px] font-[700]">
        GET YOUR $350,036.61 REFERRAL REWARDS
      </p>
      <p class="text-[15px] text-[#FFDC7E] leading-[18px]">
        Every friend you invite, will get you $350,036.61, the more you invite, the more you will get!
      </p>
      <div
        class="border-[1px] border-[#F5F5F7] flex items-center w-full max-w-[200px] h-[40px] justify-center gap-[8px] rounded-[12px]"
      >
        <p class="text-[16px] font-[700]">
          Learn More
        </p>
        <img src="/images/profile/user-info/information-icon.svg">
      </div>
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
