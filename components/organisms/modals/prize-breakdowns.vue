<template>
  <ModalsBaseModal :active="active" class="prize-container" :prize="true">
    <div class="lottery-title flex justify-between items-center">
      <div>Prize Breakdown</div>
      <input type="image" src="/images/lottery/buy-tickets-modal/close.png" @click="close">
    </div>
    <img src="/images/lottery/special-lotteries/verify-logo.png" class="m-auto my-10 logo-image">
    <table class="w-full table">
      <thead>
        <tr class="text-left default-text h-16">
          <th class="pl-8">
            Lucky Numbers
          </th>
          <th>Winning Tickets</th>
          <th>
            <div class="flex gap-2">
              Total Prize <img :src="`/images/${tokenSymbol}.png`">
            </div>
          </th>
          <th>
            <div class="flex gap-2">
              Each Player <img :src="`/images/${tokenSymbol}.png`">
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) of data" :key="index" class="text-white h-16" style="border-top: 0.5px solid rgba(255, 255, 255, 0.04);">
          <td class="pl-8 font-bold">
            {{ item.numbers }}
          </td>
          <td>{{ item.tickets }}</td>
          <td>{{ item.total }}</td>
          <td>{{ item.player }}</td>
        </tr>
      </tbody>
    </table>
  </ModalsBaseModal>
</template>

<script lang="ts">
import {
    PropType
} from 'vue'
export default {
    props: {
        active: {
            type: Boolean,
            required: true,
            default: false
        },
        data: {
            type: Array as PropType < any >,
            default: () => []
        },
        tokenSymbol: {
            type: String,
            required: false,
            default: ''
        }
    },
    emits: ['close'],
    setup(_props, {
        emit
    }) {
        const close = () => {
            emit('close')
        }
        return {
            close
        }
    }
}
</script>

<style lang="scss" scoped>
.table {
    padding: 10px;
    border-radius: 12px;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #1C1B1F;
}

.logo-image {
    width: 150px;
    height: 150px;
}
</style>
