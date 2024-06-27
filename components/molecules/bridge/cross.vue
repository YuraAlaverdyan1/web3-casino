<template>
  <div class="cross">
    <h2>Cross Swap</h2>
    <div class="cross_container">
      <BridgeSteps :steps="steps" />
      <BridgeSuccessBox :info="box" />
    </div>
  </div>
</template>

<script setup lang="ts">
import steps from '~/data/bridge/steps.json'
import box from '~/data/bridge/box.json'
</script>

<style lang="scss" scoped>
.cross {
  display: flex;
  padding: 16px;
  flex-direction: column;
  background-color: #251F2D;
  border-radius: 12px;

  h2 {
    font-family: Exo 2;
    font-size: 20px;
    font-weight: 700;
  }

  &_container{
    border-radius: 12px;
    background: #2C2634;
    width: 100%;
    height: 100%;
  }
}
</style>
