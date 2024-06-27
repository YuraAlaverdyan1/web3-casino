<template>
  <table class="table sm:w-full mt-4">
    <caption class="hidden">
      Monthly savings
    </caption>
    <thead>
      <tr class="header">
        <th class="w-[20.7%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Lottery Round
          </p>
        </th>
        <th class="w-[20.7%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Time
          </p>
        </th>
        <th class="w-[20.7%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Lottery Name
          </p>
        </th>
        <th class="w-[20.7%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Player
          </p>
        </th>
        <th class="w-[16.2%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Amount
          </p>
        </th>
      </tr>
    </thead>
    <tbody class="body">
      <tr
        v-for="(bet, index) of data"
        :key="index"
        :class="{
          'player-row': account.isConnected && bet.user.toLowerCase() == account.address.toLowerCase(),
        }"
      >
        <td v-if="bet.timestamp">
          <div class="flex items-center gap-[15px]">
            <div class="flex items-center">
              <p class="text-[14px] font-[400] p-[16px] scale-100 hover:scale-[1.05] transition-all origin-left">
                {{ String(index + 1).padStart(3, '0') }}
              </p>
            </div>
          </div>
        </td>

        <td v-if="bet.timestamp">
          <div class="flex items-center gap-[15px]">
            <div class="flex items-center">
              <p class="text-[14px] font-[400] p-[16px] scale-100 hover:scale-[1.05] transition-all origin-left">
                {{ new Date(bet.timestamp * 1000).toLocaleTimeString('en-US') }}
              </p>
            </div>
          </div>
        </td>
        <td>
          <div class="flex">
            <p class="text-[14px] font-[400] p-[16px]">
              Daily Lottery
            </p>
          </div>
        </td>

        <td>
          <div class="flex">
            <NuxtLink
              rel="noopener"
              :to="`${linkTransaction}/address/${bet.user}`"
              title="Transaction Details"
              target="_blank"
              class="scale-100 hover:scale-[1.1] transition-all flex cursor-pointer items-center"
            >
              <img
                alt="block icon"
                :src="makeBlockie(`${bet.user}`)"
                class="w-[24px] h-[24px] rounded-full overflow-hidden border-[1px] border-[#fff]"
              >
              <p class="text-[14px] font-[400] pl-[8px] pr-[16px] py-[16px]">
                {{ bet.user.split('').slice(0, 8).join('') }}
              </p>
            </NuxtLink>
          </div>
        </td>
        <td>
          <div class="flex items-center gap-1 p-[16px] scale-100 hover:scale-[1.05] transition-all origin-left">
            <img alt="token icon" src="/tokens/usdt.svg">
            <p class="text-[14px] font-[400]">
              {{ fixBigNumbers(bet.amount, bet.token) }}
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'
import makeBlockie from 'ethereum-blockies-base64'
import { useWeb3 } from '../../composables/useWeb3'
import { useWalletConnect } from '~/composables/useWalletConnect'
import chainsData from '~/data/web3/chains.json'
import { resolveGame } from '~/utils/web3/resolveGame'
import { fixBigNumbers } from '~/utils/helpers'
export default {
  props: {
    data: {
      type: Array as PropType<Array<any>>,
      required: true
    }
  },
  setup() {
    const { account } = useWalletConnect()
    const linkTransaction = ref(chainsData[0].verifyOnBlockchain)
    const { currentChain } = useWeb3()
    const icon = ref('/tokens/rdt.png')

    return {
      account,
      resolveGame,
      linkTransaction,
      currentChain,
      icon,
      makeBlockie,
      fixBigNumbers
    }
  }
}
</script>

<style lang="scss" scoped>
.header>th {
  color: white;
  height: 50px;
  text-align: start;
}

.body {
  &_tr {
    border-top: 1px solid rgba(158, 148, 148, 0.322);
    height: 70px;
    color: white;

    &_gameName {
      display: flex;
      align-items: center;
      gap: 8px;

      img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }
    }

    &_token {
      display: flex;
      align-items: center;
      gap: 8px;

      &_orange {
        color: #ffdc7e;
      }

      &_green {
        color: #b9ff6e;
      }
    }
  }
}

.player-row>td {
  background: rgba(158, 104, 255, 0.30);
  font-weight: 300;
}

.body tr {
  border-top: 1px solid #251F2D
}

@media (max-width: 768px) {
  .table {
    width: 100%;
    max-width: 700px;
  }

}
</style>
