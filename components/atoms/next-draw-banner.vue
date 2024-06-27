<template>
  <div class="banner-background flex items-center justify-center m-auto">
    <div class="text-white text-2xl font-semibold text-center">
      {{ hours }}h : {{ minutes }}m : {{ seconds }}s
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        hours: { type: Number, required: true, default: 0 },
        minutes: { type: Number, required: true, default: 0 },
        seconds: { type: Number, required: true, default: 0 }
    }
}
</script>

<style lang="scss" scoped>
    .banner-background {
        width: 50%;
        min-height: 60px;
        background: #FF6600;
        border-radius: 12px;
    }
    @media (max-width: 500px) {
      .banner-background {
        min-height: 40px;
        width: 80%;
    }

}
</style>
