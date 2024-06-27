<template>
  <div class="info-container flex sm:flex-col flex-col-reverse justify-center py-2" :class="playBuild ? 'play-build-container' : ''">
    <div class="title">
      {{ title }}
    </div>
    <div class="text-3xl font-bold subtitle">
      {{ subtitle }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        title: { type: String, required: true, default: '' },
        subtitle: { type: String, required: true, default: '' },
        playBuild: { type: Boolean, required: false, default: false }
    }
}
</script>

<style lang="scss" scoped>
.title {
    color: #E6E6E6;
    font-size: 16px;
}
.subtitle {
    color: #B9FF6E;
}
.info-container {
    width: 100%;
    height: 100px;
    text-align: center;
    background: #2C2634;
    border-radius: 12px;
  }
  .play-build-container {
    background: #2C2634;
  }
</style>
