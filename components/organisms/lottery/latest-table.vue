<template>
  <div class="mt-20 mb-20">
    <div class="nav">
      <div class="lottery-title flex items-center gap-[10px] pl-[4px]">
        <span class="relative flex h-[5px] w-[5px]">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9FF6E] opacity-75" />
          <span class="relative inline-flex rounded-full h-[5px] w-[5px] bg-[#B9FF6E]" />
        </span>
        <p>Recent Draw Results</p>
      </div>
      <div class="w-full flex items-center justify-between mt-4">
        <div class="flex gap-2 w-full">
          <StakingBtn
            :color="active === 0 ? '#6600FF' : '#2C2634'"
            :fill="true"
            :hover-color="active !== 0 ? '#413C48' : '#6600FF'"
            class="btn text-base"
            @click="active = 0"
          >
            All
          </StakingBtn>
          <StakingBtn
            v-if="account.isConnected"
            :color="active === 1 ? '#6600FF' : '#2C2634'"
            :fill="true"
            :hover-color="active !== 1 ? '#413C48' : '#6600FF'"
            class="btn text-base"
            @click="active = 1"
          >
            My Bets
          </StakingBtn>
        </div>
        <SelectBtn
          v-if="onlyWin && +filterDataCount < onlyWin.length"
          class="scale-[.7] relative z-[20]"
          :text="filterDataCount"
          :items="['5', '10', '15', '25', '50']"
          @select="(e) => (filterDataCount = e)"
        />
      </div>
    </div>
    <div class="overflow-auto mb-[20px]">
      <div class="w-full max-w-full min-w-[600px] lg:min-w-[1000px]">
        <div>
          <table-lottery :data="data" />
        </div>
      </div>
    </div>
    <pagination
      :filtered-data="onlyWin ? onlyWin : []"
      :filter-data-count="filterDataCount"
      :pagination-page="paginationPage"
      :set-pagination-page="setPaginationPage"
    />
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import Pagination from '~/components/organisms/home/pagination.vue'
import TableLottery from '~/components/atoms/table-lottery.vue'
import { useGlobalBankroll } from '~/composables/useGlobalBankroll'
import { useWalletConnect } from '~/composables/useWalletConnect'

export default {
  components: { Pagination, TableLottery },
  setup() {
    const active = ref(0)
    const { globalBets } = useGlobalBankroll()
    const filterDataCount = ref('10')
    const paginationPage = ref(0)
    const { account } = useWalletConnect()

    const setPaginationPage = (newValue) => {
      paginationPage.value = newValue
    }
    const onlyWin = computed(() => {
      return globalBets.value.filter(item => item.amount > 0)
    })

    const data = computed(() => {
      return onlyWin.value && onlyWin.value.slice(
        paginationPage.value * +filterDataCount.value,
        (paginationPage.value + 1) * +filterDataCount.value
      )
    })
    return {
      active,
      data,
      filterDataCount,
      paginationPage,
      setPaginationPage,
      onlyWin,
      account
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.o-drop__menu, .o-drop__menu--active) {
  padding: 0;
}

.btn {
  width: 130px;
}

.container {
  @screen md {
    overflow-x: hidden;
  }

  overflow-x: scroll;
}
</style>
