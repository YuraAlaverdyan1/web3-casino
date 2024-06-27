<template>
  <div class="banner-container flex flex-col justify-center gap-2">
    <div class="title">
      {{ title }}
    </div>
    <div class="subtitle flex gap-2 items-center">
      <img :src="`/images/${token}.png`"> {{ subtitle }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        title: {
            type: String,
            required: true,
            default: ''
        },
        subtitle: {
            type: String,
            required: true,
            default: ''
        },
        token: {
            type: String,
            required: true,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.banner-container {
    width: 300px;
    height: 90px;
    background: rgba($color: #000000, $alpha: 0);
    border: 1px solid rgba($color: #77777744, $alpha: 0.5);
    border-radius: 8px;
    padding-left: 20px;
}
.title, .subtitle {
  color: #E6E6E6;
}
.title {
    font-size: 14px;
}
.subtitle {
    font-size: 18px;
    font-weight: 600;
}
</style>
