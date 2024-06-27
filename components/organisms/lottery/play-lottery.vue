<template>
  <div class="flex flex-col gap-6 mt-8">
    <LotteryBanner
      v-if="!isSmall"
      :image="playLotteryData.image"
      :title="playLotteryData.title"
      :subtitle="playLotteryData.subtitle"
      :button-color="'#B9FF6E'"
      :button-text="playLotteryData.btnText"
      :btn-text-color="'#171120'"
    />
    <HomeNewsCarousel v-if="isSmall" :btn-color="'#FF6600'" />
  </div>
</template>

<script lang="ts">
import playLotteryData from '~/data/play-lottery-banner.json'

export default {
    props: {
        isSmall: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(_props) {
        return {
            playLotteryData
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    line-height: 1.2 !important;
}

.subtitle {
    width: 70%;
}

.up-to {
    color: #6600FF;
}
</style>
