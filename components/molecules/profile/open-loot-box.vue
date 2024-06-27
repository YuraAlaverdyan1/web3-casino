<template>
  <div class="loot-bg w-full min-h-[191px] md:h-[277px] xl:h-[350px] 2xl:h-[450px] rounded-[12px]  flex flex-col justify-between md:justify-center md:gap-[24px] overflow-hidden">
    <div class="min-h-[191px] w-full h-full gradient-bg p-[12px] md:p-[24px] flex flex-col justify-end">
      <p class="text-[16px] md:text-[24px] font-[700]">
        Coming Soon...
      </p>
      <p class="text-[32px] md:text-[48px] font-[700] text-[#fff]">
        Build & Bankroll
      </p>
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
<style lang="scss" scoped>
.loot-bg {
  background: url('/images/banners/banner-6.png');
  background-size: cover;
  background-repeat: no-repeat;
}
.gradient-bg {
  background: linear-gradient(1deg, rgba(255, 102, 0, 0.60) 12.17%, rgba(255, 102, 0, 0.42) 29.82%, rgba(255, 102, 0, 0.15) 54.7%, rgba(255, 255, 255, 0.00) 73.69%);
}
</style>
