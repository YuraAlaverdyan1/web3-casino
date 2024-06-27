<template>
  <div class="container flex flex-col items-center mt-4 gap-4">
    <div class="lottery-title">
      Transactions
    </div>
    <ItemsNav :items="['Deposit', 'Withdraw']" :active="active" class="w-1/2" @set-active="(e) => active = e" />
    <ProfileTransactionsTable />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
    setup() {
        const active = ref(0)
        return {
            active
        }
    }
}
</script>
