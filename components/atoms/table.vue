<template>
  <table class="table sm:w-full mt-4">
    <thead>
      <tr class="header">
        <th class="w-[27.0%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Time
          </p>
        </th>
        <th class="w-[27.0%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Game
          </p>
        </th>
        <th class="w-[27.0%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Player
          </p>
        </th>
        <th class="w-[16.2%]">
          <p class="text-[14px] font-[400] p-[16px]">
            Profit
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
                {{ new Date(bet.timestamp * 1000).toLocaleTimeString('en-US') }}
              </p>
              <NuxtLink
                :to="`${linkTransaction}/tx/${bet.trxHash}`"
                title="Transaction Details"
                target="_blank"
                class="scale-100 hover:scale-[1.1] transition-all"
              >
                <img src="/images/menu/link-arrow.svg">
              </NuxtLink>
            </div>
          </div>
        </td>

        <td class="px-[0px]">
          <NuxtLink
            v-if="resolveGame(bet.game).link !== ''"
            :to="'/games/' + resolveGame(bet.game).link"
            class="flex gap-[4px] p-[4px] scale-100 hover:scale-[1.05] transition-all origin-left"
          >
            <img
              class="w-[24px] h-[24px] rounded-full border-[1px] border-[#F5F5F7]"
              :src="`/games/${resolveGame(bet.game).link}/modal-logo.webp`"
              alt="game_icon"
            >
            <p class="text-[14px] font-[400] capitalize">
              {{ resolveGame(bet.game).name }}
            </p>
          </NuxtLink>
          <NuxtLink
            v-if="resolveGame(bet.game).link === ''"
            :to="'/casino/#coinflip'"
            class="flex gap-[4px] p-[4px] scale-100 hover:scale-[1.05] transition-all origin-left"
          >
            <img
              class="w-[24px] h-[24px] rounded-full border-[1px] border-[#F5F5F7]"
              :src="`/games/coinflip/modal-logo.webp`"
              alt="game_icon"
            >
            <p class="text-[14px] font-[400] capitalize">
              coinflip
            </p>
          </NuxtLink>
        </td>
        <td>
          <div class="flex">
            <NuxtLink
              :to="`${linkTransaction}/address/${bet.user}`"
              title="Transaction Details"
              target="_blank"
              class="scale-100 hover:scale-[1.1] transition-all flex cursor-pointer items-center"
            >
              <img
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
            <img :src="resolveIcon(bet.token)">
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
import { PropType, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import makeBlockie from 'ethereum-blockies-base64'
import { useWeb3 } from '../../composables/useWeb3'
import { useWalletConnect } from '~/composables/useWalletConnect'
import { resolveGame } from '~/utils/web3/resolveGame'
import chainsData from '~/data/web3/chains.json'
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
    const { currentChain, web3Global } = useWeb3()
    const icon = ref('/tokens/rdt.png')
    const route = useRoute()
    watch(() => [currentChain.value, route], () => {
      if (currentChain.value) {
        if (currentChain.value.verifyOnBlockchain) {
          linkTransaction.value = currentChain.value.verifyOnBlockchain
        } else {
          linkTransaction.value = ''
        }
      }
    }, { deep: true, immediate: true })

    const resolveIcon = (token) => {
      if (currentChain.value) {
        if (currentChain.value.symbol === 'ETH') {
          if (currentChain.value.priceCalculation.usdt.toLowerCase() === token.toLowerCase()) {
            return '/tokens/rusdt.png'
          } else if (currentChain.value.smartContracts.RDTToken.toLowerCase() === token.toLowerCase()) {
            return '/tokens/rdt.png'
          } else {
            return '/tokens/rdt.png'
          }
        } else if (currentChain.value.symbol === 'BNB') {
          if (currentChain.value.smartContracts.RDTToken.toLowerCase() === token.toLowerCase()) {
            return '/tokens/rdt.png'
          }
          return '/tokens/usdt.png'
        }
      } else {
        if (web3Global.chain.smartContracts.RDTToken.toLowerCase() === token.toLowerCase()) {
            return '/tokens/rdt.png'
          }
        return '/tokens/usdt.png'
      }
    }

    return {
      account,
      resolveGame,
      linkTransaction,
      currentChain,
      icon,
      resolveIcon,
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

      img {
        width: 20px;
        height: 20px;
      }

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
