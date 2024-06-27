<template>
  <div class="mt-20 mb-20">
    <div class="nav px-[24px] md:px-[0px]">
      <div class="lottery-title flex items-center gap-[10px] ml-[4px]">
        <span class="relative flex h-[5px] w-[5px]">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9FF6E] opacity-75"
          />
          <span
            class="relative inline-flex rounded-full h-[5px] w-[5px] bg-[#B9FF6E]"
          />
        </span>
        <p>Leaderboard</p>
      </div>
    </div>
    <div class="overflow-auto mb-[20px]">
      <div class="w-full max-w-full min-w-[600px]">
        <div>
          <table class="table sm:w-full mt-4">
            <thead>
              <tr class="header">
                <th style="width: 10%">
                  <p class="text-[14px] font-[400] p-[16px] text-left">
                    Rank
                  </p>
                </th>
                <th style="width: 73%">
                  <p class="text-[14px] font-[400] p-[16px] text-left">
                    Player
                  </p>
                </th>

                <th style="width: 17%">
                  <p class="text-[14px] font-[400] p-[16px] text-left">
                    Volume
                  </p>
                </th>
              </tr>
            </thead>
            <tbody class="body">
              <tr
                v-for="(bet, index) of leaderBoardList"
                :key="index"
                style="border-bottom: 1px solid #251f2d"
                :class="[
                  index === 0 && 'first-position',
                  index > 0 && index < 10 && 'top-ten'
                ]"
              >
                <td style="width: 10%">
                  <p
                    class="text-[14px] font-[400] p-[16px] text-left text-[#B9FF6E]"
                  >
                    {{ index + 1 }}
                  </p>
                </td>
                <td style="width: 73%">
                  <div
                    class="flex w-fit items-center gap-[8px] pl-[16px] scale-[1] hover:scale-[1.05] transition-all origin-center"
                  >
                    <img
                      alt="user icon"
                      :src="makeBlockie(`${bet.address}`)"
                      class="w-[24px] h-[24px] rounded-full overflow-hidden border-[1px] border-[#fff]"
                    >

                    <a
                      :href="`${linkTransaction}/address/${bet.address}`"
                      class="text-[14px] font-[400] text-left"
                    >
                      {{ bet.address }}
                    </a>
                  </div>
                </td>

                <td style="width: 17%">
                  <div
                    class="flex items-center gap-1 p-[16px] scale-100 hover:scale-[1.05] transition-all origin-left"
                  >
                    <img alt="user icon" :src="resolveIcon">
                    <p class="text-[14px] font-[400]">
                      {{ bet.volume.toFixed(2) }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed } from 'vue'
import makeBlockie from 'ethereum-blockies-base64'
import { useRoute } from 'vue-router'
import { useWeb3 } from '../../../composables/useWeb3'
import { useGlobalBankroll } from '~/composables/useGlobalBankroll'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { useLeaderboard } from '~/composables/useLeaderboard'
import chainsData from '~/data/web3/chains.json'

export default {
  setup() {
    const active = ref(3)
    const filterDataCount = ref('10')
    const paginationPage = ref(0)
    const route = useRoute()
    const linkTransaction = ref(chainsData[0].verifyOnBlockchain)
    const { currentChain } = useWeb3()
    const { globalGameBets } = useGlobalBankroll()
    const { account } = useWalletConnect()
    const { leaderBoardList, filterBy } = useLeaderboard()

    watch(
      () => [currentChain.value, route],
      () => {
        if (currentChain.value) {
          if (currentChain.value.verifyOnBlockchain) {
            linkTransaction.value = currentChain.value.verifyOnBlockchain
          } else {
            linkTransaction.value = ''
          }
        }
      },
      { deep: true, immediate: true }
    )

    const setPaginationPage = (newValue) => {
      paginationPage.value = newValue
    }

    const resolveIcon = computed(() => {
      if (currentChain.value) {
        if (currentChain.value.symbol === 'ETH') {
          return '/tokens/rusdt.png'
        } else if (currentChain.value.symbol === 'BNB') {
          return '/tokens/usdt.png'
        }
      } else {
        return '/tokens/usdt.png'
      }
      return '/tokens/usdt.png'
    })

    watch(active, () => {
      if (active.value === 3) {
        filterBy.value = 'all_time'
      } else if (active.value === 2) {
        filterBy.value = 'monthly'
      } else if (active.value === 1) {
        filterBy.value = 'weekly'
      } else if (active.value === 0) {
        filterBy.value = 'daily'
      }
    })

    return {
      active,
      globalGameBets,
      filterDataCount,
      paginationPage,
      setPaginationPage,
      account,
      resolveIcon,
      makeBlockie,
      linkTransaction,
      leaderBoardList
    }
  }
}
</script>

<style scoped lang="scss">
.first-position {
  background: #9e68ff;
}

.top-ten {
  background: #9e68ff4d;
}

:deep(.o-drop__menu, .o-drop__menu--active) {
  padding: 0;
}

.container {
  @screen md {
    overflow-x: hidden;
  }

  overflow-x: scroll;
}

.table {
  width: 100%;
  min-width: 600px;
}
</style>
