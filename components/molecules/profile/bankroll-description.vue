<template>
  <div class="flex flex-col gap-4">
    <div class="title-text leading-none font-semibold">
      A New Way to Win: <span style="color: #FF6600;">Stake, Bankroll, and Profit</span> with Ridotto's Cutting-Edge Protocol!
    </div>
    <div class="default-text leading-relaxed">
      Want to earn profits while revolutionizing the online gambling industry? Stake and bankroll with Ridotto's innovative protocol and become the house.
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
    .blue-text {
        background: linear-gradient(#79D9F6 100%, #62D3F5 100%, #4CCDF3 100%, #1FC0F0 100%, #199AC0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>
