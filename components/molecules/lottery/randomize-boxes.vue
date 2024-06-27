<template>
  <div>
    <div
      v-for="(item, index) of tableData"
      :key="index"
      class="md:pr-4 text-white bg-[#2C2634] rounded-xl p-2 px-4 w-full my-4"
    >
      <div class="flex justify-between">
        <div>
          Tickets: <b>{{ item.round }}</b>
        </div>
        <div>
          <button>
            <svg
              class="inline mr-2"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 0V2.22222C14.2878 2.22222 17.7778 5.71111 17.7778 10C17.7778 14.2889 14.2878 17.7778 10 17.7778C5.71222 17.7778 2.22222 14.2889 2.22222 10C2.22222 7.94778 3.03889 6.01555 4.44445 4.57555V7.22222H6.66667V1.11111H0.555552V3.33333H2.54555C0.923333 5.14667 0 7.51 0 10C0 15.5133 4.48555 20 10 20C15.5144 20 20 15.5133 20 10C20 4.48667 15.5144 0 10 0Z"
                fill="#F5F5F7"
              />
            </svg>
          </button>
          <button>
            <svg
              class="inline"
              width="26"
              height="20"
              viewBox="0 0 26 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8574 15.5L15.8574 11.5L19.8574 15.5L21.3931 13.9643L17.3574 10L21.3216 6.03571L19.7859 4.5L15.8574 8.5L11.8574 4.5L10.3216 6.03571L14.3574 10L10.3216 13.9643L11.8574 15.5ZM0.143066 10L6.17878 1.46429C6.4883 1.03571 6.85735 0.684524 7.28592 0.410714C7.7145 0.136905 8.19069 0 8.7145 0H23.7145C24.3038 0 24.8082 0.209821 25.2279 0.629464C25.6475 1.04911 25.8574 1.55357 25.8574 2.14286V17.8571C25.8574 18.4464 25.6475 18.9509 25.2279 19.3705C24.8082 19.7902 24.3038 20 23.7145 20H8.7145C8.19069 20 7.7145 19.8631 7.28592 19.5893C6.85735 19.3155 6.4883 18.9643 6.17878 18.5357L0.143066 10ZM2.82164 10L8.32164 17.8571H23.7145V2.14286H8.32164L2.82164 10ZM23.7145 10V2.14286V17.8571V10Z"
                fill="#F5F5F7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex justify-between gap-2 mt-4 mb-8">
        <div
          v-for="(number, i2) of item.lucky"
          :key="`${index}j${i2}`"
          class="p-4 lg:px-4 px-2 w-full bg-[#413C48] text-center rounded-2xl font-bold"
        >
          {{ number }}
        </div>
      </div>
      <div class="grid grid-cols-5 justify-between gap-2 mt-4">
        <button
          v-for="(number, i2) of randomLucky"
          :key="`${index}j${i2}`"
          class="p-2 lg:px-4 px-2 w-full border-2 border-[#413C48] text-center rounded-2xl font-bold"
        >
          {{ number }}
        </button>
      </div>
    </div>
    <StakingBtn :color="'#9E68FF'" :fill="true" class="w-full mt-4 h-14 text-base">
      Add Ticket
    </StakingBtn>
  </div>
  <!--  v-for="(item, index) of tableData" -->
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
  setup(_props) {
    const randomLucky = [0, 1, 2, 2, 2, 4, 5, 6, 2, 9]
    return {
      randomLucky
    }
  }
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
}
</style>
