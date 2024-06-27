<template>
  <div class="container w-full">
    <table class="w-full">
      <thead>
        <tr>
          <th>Time</th>
          <th>Amount</th>
          <th>Network</th>
          <th>State</th>
          <th>Transaction</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) of filteredElements" :key="index">
          <td>
            <div class="default-text">
              <div>{{ item.time.date }}</div>
              <div>{{ item.time.time }}</div>
            </div>
          </td>
          <td>
            <div class="flex items-center gap-1 text-white">
              <img :src="`/images/${item.amount.chain}.png`">
              <div>{{ item.amount.amount }}</div>
              <div>{{ item.amount.chain.toUpperCase() }}</div>
            </div>
          </td>
          <td>
            <div class="flex items-center gap-1 text-white">
              <img :src="`/images/${item.token}.png`">
              <div>{{ item.chain }}</div>
            </div>
          </td>
          <td :style="`color: ${color(item.state)};`">
            {{ item.state }}
          </td>
          <td>
            <button class="link-text">
              Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center justify-between">
      <SelectBtn :text="'All Crypto Currency'" :items="['item1', 'item2']" />
      <LotteryLatestDrawsPagination :filter="'10'" :last="Math.ceil(transactions.length / 10)" :data="transactions" @filter-elements="(e) => filterElements(e)" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import transactions from '~/data/transactions.json'
export default {
    setup() {
        const filteredElements = ref(transactions.slice(0, 10))

        const filterElements = (el) => {
            filteredElements.value = el.data
        }

        const color = (el) => {
            return el === 'Deposit is in progress' ? '#54DB43' : el === 'Success' ? '#9E68FF' : '#FF4757'
        }

        return {
            transactions,
            filteredElements,
            color,
            filterElements
        }
    }
}
</script>

<style lang="scss" scoped>
    th {
        text-align: left;
        padding: 20px 0;
        color: #E6E6E6;
        font-weight: 400;
    }
    td {
      border-top: 1px solid rgba(128, 128, 128, 0.4);
      border-bottom: 1px solid rgba(128, 128, 128, 0.4);
      padding: 5px 0;
    }
    .container {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #1C1B1F;
        border-radius: 12px;
        padding: 30px;
    }
</style>
