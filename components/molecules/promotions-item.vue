<template>
  <div class="relative">
    <img :src="image" class="w-full">
    <div class="details flex flex-col justify-center align-center md:px-10 px-2">
      <div class="title">
        {{ title }}
      </div>
      <StakingBtn :token="token" :color="color" :fill="true" class="flex items-center gap-2 font-bold text-black btn h-14 pl-6">
        {{ amount }} {{ token.toUpperCase() }} <img :src="`/images/${token}.png`">
      </StakingBtn>
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        title: { type: String, required: true, default: '' },
        image: { type: String, required: true, default: '' },
        token: { type: String, required: true, default: '' },
        amount: { type: Number, required: true, default: 0 },
        color: { type: String, required: true, default: '' }
    }
}
</script>

<style lang="scss" scoped>
.details {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
.title {
    @screen lg {
      font-size: 32px;
    }
    font-size: 24px;
    font-weight: 600;
    color: white;
}
.btn {
  width: 100%;
}
</style>
