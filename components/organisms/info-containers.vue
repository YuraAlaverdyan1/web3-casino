<template>
  <div class="gap-4 mt-10 info-container">
    <InfoContainer v-for="(data, index) of totalData" :key="index" :title="data.title" :subtitle="data.subtitle" :class="index === totalData.length - 1 ? 'last-data' : ''" />
  </div>
</template>

<script lang="ts">
import totalData from '~/data/total-data.json'
export default {
    setup() {
        return {
            totalData
        }
    }
}
</script>

<style lang="scss" scoped>
  .info-container {
    @screen md {
      flex-wrap: nowrap;
      display: flex;
    }
    display: grid;
    grid-template-columns: 50% 45%;
    grid-auto-rows: 100px 100px;
    flex-wrap: wrap;
  }
  .last-data {
    grid-column: 1/3;
  }
</style>
