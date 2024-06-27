<template>
  <div class="bridge">
    <ResolveRouter class="mb-[16px]" />
    <div class="bridge_section">
      <h1>Ridotto Bridge</h1>
      <div class="bridge_section_container">
        <BridgeTransfer />
        <BridgeCross />
      </div>
    </div>
    <div class="bridge_transactions">
      <h1>Transactions</h1>
      <BridgeTransactions :data="transactionsMock" />
    </div>
  </div>
</template>

<script setup lang="ts">
import transactionsMock from '~/data/bridge/transactions.json'
</script>

<style lang="scss" scoped>
.bridge {
  width: 100%;
  display: flex;
  flex-direction: column;
  @screen xs {
    padding: 28px 16px;
  }
  @screen sm {
    padding: 40px 16px 28px 16px;
  }

  h1 {
    color: white;
    font-family: Exo 2;
    font-size: 34px;
    font-weight: 700;
    margin: 24px 0;
  }

  &_section {
    &_container {
      @screen xs {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      @screen sm {
        padding: 0;
        display: grid;
        grid-template-columns: 1.7fr 1fr;
        grid-template-rows: 1fr;
        grid-column-gap: 30px;
        grid-row-gap: 0px;
      }
      @screen md {
        grid-column-gap: 60px;
      }
    }
  }

  &_transactions {
    @screen xs {
      margin: 24px 0;
    }
    @screen sm {
      margin: 48px 0;
    }
    color: #f5f5f7;
    font-family: Exo 2;
    font-size: 24px;
    font-weight: 700;
    width: 100%;
  }
}
</style>
