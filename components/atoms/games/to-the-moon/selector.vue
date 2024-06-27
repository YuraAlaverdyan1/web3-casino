<template>
  <div class="selector">
    <div>
      <p>Booster Fuel</p>
      <p>{{ valueBet }}</p>
    </div>
    <input v-model="valueBet" type="range" class="selector_range" min="1" max="8">
    <div>
      <p>Total Spent</p>
      <p>USDT 0.01</p>
    </div>
    <div>
      <div class="prize">
        <p>Max Ticket Prize</p>
        <div class="i">
          <p>i</p>
        </div>
      </div>
      <p>USDT 100.00</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useMiniGames } from '~/composables/useMiniGames'
  const { valueBet } = useMiniGames()
</script>

<style lang="scss" scoped>
.selector {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-radius: 12px;
    background: #201A29;
    backdrop-filter: blur(20px);
    padding: 8px 12px;
  &_range {
    background: #2c2634;
    margin: 5px 0;
    height: 4px;
    outline: none;
    cursor: pointer;
    accent-color: #6600ff;
    &::-moz-range-thumb,
    &::-webkit-slider-thumb {
      width: 12px;
      height: 12px;
      background-color: #ff6600;
      border: 1px solid #ff6600;
      border-radius: 50%;
      appearance: none;
      box-shadow: 0 0 10px 0 #ff6600;
    }
    &::-moz-range-progress {
      background-color: #f5f5f7;
    }
  }
  & > div {
    display: flex;
    justify-content: space-between;
    font-size: 12px;

    &:first-child{
        font-size: 14px;
    }
    .prize {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .i {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      min-width: 20px;
      min-height: 20px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid #e6e6e6;
    }
  }
}
</style>
