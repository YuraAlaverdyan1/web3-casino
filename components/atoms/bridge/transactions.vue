<template>
  <div class="transaction">
    <div>
      <table>
        <thead>
          <tr>
            <td v-for="(head, index) in Object.keys(data)" :key="index">
              {{ changeUnderlineToUppercase(head) }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(_, index) in data.time.length" :key="index">
            <td>
              {{ data.time[index] }}
            </td>
            <td>
              <a :href="data.source_chain[index].link" target="_blank">
                <img :src="data.source_chain[index].icon" alt="token">
                <p>
                  {{ data.source_chain[index].name }}
                </p>
                <img src="/bridge/linkArrow.svg" alt="link">
              </a>
            </td>
            <td>
              <a :href="data.destination_chain[index].link" target="_blank">
                <img :src="data.destination_chain[index].icon" alt="token">
                <p>
                  {{ data.destination_chain[index].name }}
                </p>
                <img src="/bridge/linkArrow.svg" alt="link">
              </a>
            </td>
            <td>
              <div>
                <img :src="data.amount[index].icon" alt="token">
                <p class="amount">
                  {{ data.amount[index].value }}
                </p>
              </div>
            </td>
            <td>
              <p :class="data.state[index].toLowerCase()">
                {{ data.state[index] }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <HomePagination filtered-data="[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]" />
  </div>
</template>

<script setup lang="ts">
import { changeUnderlineToUppercase } from '~/utils/web3/formators'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.transaction {
  width: 100%;
  tbody > tr > td {
    white-space: pre-line;
  }
  & > div {
    overflow-x: auto;
    &::-webkit-scrollbar {
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
  table {
    width: 100%;
    font-size: 14px;
    font-weight: 400;

    tr {
      height: 60px;
    }

    tbody {
      tr {
        border-bottom: 1px solid #251f2d;

        td {
          white-space: nowrap;
          min-width: 135px;
          div {
            display: flex;
            gap: 5px;
          }
          a {
            display: flex;
            gap: 5px;
          }
        }
      }
      tr:first-child {
        border-top: 1px solid #251f2d;
      }
    }
  }

  .amount {
    font-weight: 700;
  }

  .pending {
    color: #f60;
  }

  .success {
    color: #b9ff6e;
  }

  .failed {
    color: #ff4757;
  }
}
</style>
