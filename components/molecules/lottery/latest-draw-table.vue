<template>
  <table class="w-full">
    <thead>
      <tr class="text-white table-header">
        <th class="pl-4 font-light">
          Round
        </th>
        <th class="font-light text-center">
          Draw Date
        </th>
        <th class="font-light text-center">
          Total Tickets
        </th>
        <th class="font-light text-center">
          Won
        </th>
        <th class="font-light text-center">
          Payout
        </th>
        <th class="font-light text-center">
          Details
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of tableData" :key="index" class="text-white table-body">
        <td class="pl-4">
          {{ item.round }}
        </td>
        <td class="text-center">
          {{ item.date }}
        </td>
        <td class="text-center">
          {{ item.tickets }}
        </td>
        <td class="text-center">
          {{ item.won }}
        </td>
        <td class="text-center">
          <div class="flex justify-center lg:gap-1">
            <img :src="`/images/${item.wallet}.png`">{{ item.payout }}
          </div>
        </td>
        <td class="text-center">
          <a
            href="#"
            style="color: #FFDC7E;"
            @click="$emit('openPrizeModal', item.breakDown)"
          >Prize Breakdown</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { PropType } from 'vue'
export default {
  props: {
    tableData: {
      type: Array as PropType<Array<any>>,
      required: true,
      default: () => []
    }
  },
  emits: ['openPrizeModal']
}
</script>

<style lang="scss" scoped>
.table-header>th,
.table-body {
  text-align: start;
  height: 70px;
}

.table-body {
  border-top: 1px solid rgba(160, 143, 143, 0.712);
}</style>
