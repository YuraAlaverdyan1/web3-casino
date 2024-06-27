<template>
  <div class="migration">
    <ResolveRouter />
    <MigrationNav
      class="migration_nav"
      :items="['Beginner', 'Expert']"
      :active="activeTypeIndex"
      @set-active="(e) => (activeTypeIndex = e)"
    />
    <MigrationFaqModal
      :text="faqData[activeTypeIndex === 0 ? 'beginner' : 'expert'].text"
      :progress="faqData[activeTypeIndex === 0 ? 'beginner' : 'expert'].progress"
    />
    <div>
      <h1>Migration</h1>
      <Migration
        v-for="(item, index) in Object.keys(data)"
        :key="index"
        :item="{ [item]: mockData[item] }"
        class="migration_item"
      />
    </div>
    <div class="migration_transactions">
      <h1>Transactions</h1>
      <BridgeTransactions :data="transactionsMock" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import mockData from '~/data/migration/mockData.json'
import faqData from '~/data/migration/faq-modal-data.json'
import transactionsMock from '~/data/bridge/transactions.json'

const activeTypeIndex = ref(0)
const data = computed(() => {
  if (activeTypeIndex.value) {
    const key = Object.keys(mockData).at(-1)!
    return {
      [key]: mockData[key]
    }
  }
  return mockData
})
</script>

<style lang="scss" scoped>
.active-item {
  background: red !important;
}
.migration {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 40px;
  @screen xs {
    padding: 30px 16px 0px 16px;
  }
  @screen md {
    padding: 50px 0 0 0;
  }

  &_nav {
    @screen xs {
      width: 100%;
    }
    @screen sm {
      width: 400px;
    }
  }

  h1 {
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    @screen xs {
      padding: 20px 0 16px 0;
    }
    @screen sm {
      padding: 40px 0 24px 0;
    }
  }

  &_item {
    margin-bottom: 24px;
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
