<template>
  <div class="mt-20 mb-20">
    <div class="nav px-[24px] md:px-[0px]">
      <div class="lottery-title flex items-center gap-[10px] ml-[4px] select-none">
        <p>Referral Leaderboard</p>
      </div>
    </div>
    <div class="mb-[20px]">
      <div class="overflow-x-auto">
        <table class="table sm:w-full mt-4">
          <thead>
            <tr class="header">
              <th>
                <p class="text-[14px] font-[400] p-[16px] text-left">
                  Rank
                </p>
              </th>
              <th>
                <p class="text-[14px] font-[400] p-[16px] text-left">
                  Friends Wallet
                </p>
              </th>
              <th>
                <p class="text-[14px] font-[400] p-[16px] text-left">
                  Join Date
                </p>
              </th>
              <th>
                <p class="text-[14px] font-[400] p-[16px] text-left">
                  Amount Earned
                </p>
              </th>
            </tr>
          </thead>
          <tbody class="body">
            <tr
              v-for="(bet, index) of filteredList"
              :key="index"
              style="border-bottom: 1px solid #251f2d"
              :class="[index === 0 && '', index > 0 && index < 10 && '']"
            >
              <td>
                <p class="flex items-center gap-[8px] text-[14px] font-[400] p-[16px] text-left text-[#B9FF6E]">
                  <span>
                    <img :src="`/profile/l${index + 1}.svg`">
                  </span>
                  <span class="text-[20px] font-[700] text-[#fff]">{{ index + 1 }}</span>
                </p>
              </td>
              <td>
                <div
                  class="flex w-fit items-center gap-[8px] pl-[16px] scale-[1] hover:scale-[1.05] transition-all origin-center"
                >
                  <img
                    :src="makeBlockie(`${bet.address}`)"
                    class="w-[24px] h-[24px] rounded-full overflow-hidden border-[1px] border-[#fff]"
                  >

                  <NuxtLink target="_blank" :to="`${linkTransaction}/address/${bet.address}`" class="text-[14px] font-[400] text-left">
                    {{ bet.address.slice(0, 10) }}
                  </NuxtLink>
                </div>
              </td>
              <td>
                <p class="text-[14px] font-[700] p-[16px] text-left">
                  {{ dayjs(bet.claimedDate).format('DD.MM.YYYY') }}
                </p>
              </td>
              <td>
                <div
                  class="flex items-center gap-[4px] p-[16px] scale-100 hover:scale-[1.05] transition-all origin-left"
                >
                  <img :src="resolveIcon">
                  <p class="text-[14px] font-[400]">
                    {{ Number(bet.amount).toFixed(2) }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import makeBlockie from 'ethereum-blockies-base64'
import dayjs from 'dayjs'
import { useWeb3 } from '../../../composables/useWeb3'
import { useWalletConnect } from '~/composables/useWalletConnect'
import chainsData from '~/data/web3/chains.json'
import filteredList from '~/data/referral/leaderboard'

export default {
  setup() {
    const active = ref(3)
    const filterDataCount = ref('10')
    const linkTransaction = ref(chainsData[0].verifyOnBlockchain)
    const { currentChain } = useWeb3()
    const { account } = useWalletConnect()

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

    return {
      active,
      filterDataCount,
      account,
      resolveIcon,
      makeBlockie,
      linkTransaction,
      filteredList,
      dayjs
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
