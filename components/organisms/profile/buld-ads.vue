<template>
  <div class="flex justify-center gap-4 sm:flex-nowrap flex-wrap">
    <ProfileBuildAd
      v-for="(item, index) of ads"
      :key="index"
      :btn-text="item.btnText"
      :details="item.details"
      :image="item.image"
      :rdt="item.rdt"
      :btn-color="item.btnColor"
      :btn-text-color="item.btnTextColor"
      :subtitle="item.subtitle"
      :title="item.title"
      :title2="item.title2"
      :link-hover-color="item.linkHoverColor"
      class="sm:w-1/2 w-full"
    />
  </div>
</template>

<script lang="ts">
import ads from '~/data/play-ads.json'

export default {
  setup() {
    return {
      ads
    }
  }
}
</script>

<style lang="scss" scoped></style>
