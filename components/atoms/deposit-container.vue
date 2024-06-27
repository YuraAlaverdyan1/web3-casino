<template>
  <div class="my-container">
    <div class="relative">
      <input type="text" placeholder="Search Token" class="my-input pl-10">
      <img src="/images/nav/search.png" class="absolute left-4 top-0 bottom-0 m-auto">
    </div>
    <div class="tokens">
      <div v-for="(token, index) of tokens" :key="index" class="lottery-title text-lg flex justify-between items-center">
        <div class="flex items-center justify-center w-24 gap-2">
          <img :src="`/images/${token.token}.png`">
          {{ token.deposit }}
        </div>
        {{ token.token.toUpperCase() }}
      </div>
    </div>
    <div class="line my-4" />
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <div class="default-text text-base">
          Display on Fiat
        </div>
        <o-switch v-model="fiat" />
      </div>
      <div class="flex justify-between items-center">
        <div class="default-text text-base">
          Hide 0 Balances
        </div>
        <o-switch v-model="balances" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
    setup() {
        const tokens = ref([
            { token: 'bnb', deposit: '0.0000' },
            { token: 'rdt', deposit: '0.0000' },
            { token: 'busd', deposit: '0.0000' },
            { token: 'matic', deposit: '0.0000' },
            { token: 'avax', deposit: '0.0000' }
        ])
        const fiat = ref<boolean>(false)
        const balances = ref<boolean>(false)
        return {
            tokens,
            fiat,
            balances
        }
    }
}
</script>

<style lang="scss" scoped>
:deep(.o-switch__check--checked) {
  background: #6600FF;
}
.my-input {
    border: 1px solid #424245;
    background: none;
    border-radius: 12px;
    height: 50px;
}
.my-container {
    background: #251F2D;
    border: 1px solid #424245;
    padding: 15px;
}
.tokens {
    @apply flex flex-col gap-4 mt-4
}
.line {
    height: 1px;
    width: 100%;
    background: #424245;
}
</style>
