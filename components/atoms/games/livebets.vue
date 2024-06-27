<template>
  <div class="mt-10 mb-[40px] w-full min-w-full">
    <div class="nav">
      <div class="lottery-title flex items-center gap-[10px] pl-[4px]">
        <span class="relative flex h-[5px] w-[5px]">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9FF6E] opacity-75" />
          <span class="relative inline-flex rounded-full h-[5px] w-[5px] bg-[#B9FF6E]" />
        </span>
        <p>Live Bets</p>
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
          v-if="+filterDataCount < filteredData.length"
          class="scale-[.7] relative z-[20]"
          :text="filterDataCount"
          :items="['5', '10', '15', '25', '50']"
          @select="(e) => (filterDataCount = e)"
        />
      </div>
    </div>
    <div class="container w-full min-w-full">
      <div>
        <table class="table sm:w-full mt-4">
          <thead>
            <tr class="header">
              <th class="w-[16.5%]">
                <p class="text-[14px] font-[400] p-[16px]">
                  Time
                </p>
              </th>
              <th class="w-[16.5%]">
                <p class="text-[14px] font-[400] p-[16px]">
                  Game
                </p>
              </th>
              <th class="w-[16.5%]">
                <p class="text-[14px] font-[400] p-[16px]">
                  Player
                </p>
              </th>
              <th class="w-[16.5%]">
                <p class="text-[14px] font-[400] p-[16px]">
                  Wager
                </p>
              </th>
              <th class="w-[16.5%]">
                <p class="text-[14px] font-[400] p-[16px]">
                  Multiplier
                </p>
              </th>
              <th class="w-[16.5%]">
                <p class="text-[14px] font-[400] p-[16px]">
                  Payout
                </p>
              </th>
            </tr>
          </thead>
          <TransitionGroup
            :name="Math.ceil(filteredData.length / +filterDataCount) === paginationPage + 1 ||
              Math.ceil(filteredData.length / +filterDataCount) - 1 === paginationPage + 1
              ? ''
              : 'list'
            "
            tag="tbody"
            :style="{ '--translate': `${translateClass}` }"
          >
            <tr
              v-for="(bet, index) of data"
              :key="resolveKey(index, data.length - 1)"
              :class="{
                'player-row':
                  account.isConnected &&
                  bet.player.toLowerCase() == account.address.toLowerCase(),
              }"
            >
              <td v-if="bet.timestamp">
                <div class="flex items-center gap-[15px]">
                  <div class="flex items-center">
                    <div class="text-[14px] font-[400] p-[16px] scale-100 hover:scale-[1.05] transition-all">
                      {{ new Date(bet.timestamp * 1000).toLocaleTimeString("en-US") }}
                    </div>
                    <a
                      :href="`${linkTransaction}/tx/${bet.trxHash}`"
                      title="Transaction Details"
                      target="_blank"
                      class="scale-100 hover:scale-[1.1] transition-all"
                    >
                      <img src="/images/menu/link-arrow.svg">
                    </a>
                  </div>
                </div>
              </td>
              <td v-else>
                <img :src="icon">
              </td>
              <td class="px-[0px]">
                <div class="flex gap-[4px] p-[4px] scale-100 hover:scale-[1.05] transition-all origin-left">
                  <img
                    :src="`/games/${currentGame}/modal-logo.webp`"
                    class="w-[24px] h-[24px] rounded-full border-[1px] border-[#F5F5F7]"
                  >
                  <p class="text-[14px] font-[400] capitalize">
                    {{ gameName }}
                  </p>
                </div>
              </td>
              <td>
                <div class="flex">
                  <a
                    :href="`${linkTransaction}/address/${bet.player}`"
                    title="Transaction Details"
                    target="_blank"
                    class="scale-100 hover:scale-[1.1] transition-all flex items-center"
                  >
                    <img
                      :src="makeBlockie(`${bet.player}`)"
                      class="w-[24px] h-[24px] rounded-full overflow-hidden border-[1px] border-[#fff]"
                    >
                    <p class="inline text-[14px] font-[400] pr-[16px] pl-[8px] py-[16px]">
                      {{ bet.player.split("").slice(0, 8).join("") }}
                    </p>
                  </a>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-1 p-[16px] scale-100 hover:scale-[1.05] transition-all origin-left">
                  <img :src="resolveIcon(bet.token)">
                  <p class="text-[14px] font-[400]">
                    {{ Math.round(setWager(bet.wager, bet.numOfBets) * 10000) / 10000 }}
                  </p>
                </div>
              </td>
              <td>
                <p
                  class="text-[14px] font-[400] p-[16px] scale-100 hover:scale-[1.05] transition-all origin-left"
                  :class="checkIsPayoutHigerThanOne(
                    +setMulti(setWager(bet.wager, bet.numOfBets), bet.payOut)
                  ) === 'zero'
                    ? 'text-[#fff]'
                    : checkIsPayoutHigerThanOne(
                      +setMulti(setWager(bet.wager, bet.numOfBets), bet.payOut)
                    )
                  "
                >
                  x{{ setMulti(setWager(bet.wager, bet.numOfBets), bet.payOut) }}
                </p>
              </td>
              <td>
                <div class="flex items-center gap-1 p-[16px] scale-100 hover:scale-[1.05] transition-all origin-left">
                  <img :src="resolveIcon(bet.token)">
                  <p
                    class="text-[14px] font-[400]"
                    :class="bet.payOut !== 'Waiting'
                      ? checkIsPayoutHigerThanOne(
                        +setMulti(setWager(bet.wager, bet.numOfBets), bet.payOut)
                      )
                      : 'text-[#fff]'
                    "
                  >
                    {{ setPayout(bet.payOut, bet.token) }}
                  </p>
                  <p v-if="bet.payOut === 'Waiting'">
                    <span class="one">.</span><span class="two">.</span><span class="three">.</span>
                  </p>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </div>
    <pagination
      :filtered-data="filteredData"
      :filter-data-count="filterDataCount"
      :pagination-page="paginationPage"
      :set-pagination-page="setPaginationPage"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import makeBlockie from 'ethereum-blockies-base64'
import { useWeb3 } from '../../../composables/useWeb3'
import { useMiniGames } from '~/composables/useMiniGames'
import { useWalletConnect } from '~/composables/useWalletConnect'
import Pagination from '~/components/organisms/home/pagination.vue'
import chainsData from '~/data/web3/chains.json'

export default {
  components: { Pagination },
  props: {
    isSmall: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const active = ref(0)
    const filterDataCount = ref('10')
    const { liveBets, currentGame, unclaimTokens, isPlaying } = useMiniGames()
    const { account } = useWalletConnect()
    const paginationPage = ref(0)
    const gameName = ref('')
    const linkTransaction = ref(chainsData[0].verifyOnBlockchain)
    const showFirstElement = ref(0)
    const showLastElement = ref(0)
    const translateClass = ref('translateY(-30px)')
    const route = useRoute()
    const { currentChain, web3Global } = useWeb3()
    const filteredData = ref([])
    const icon = ref('/tokens/rdt.png')

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

    const checkIsPayoutHigerThanOne = (value) => {
      if (value > 1) {
        return 'high'
      } else if (value < 1 && value > 0) {
        return 'low'
      } else if (value === 0) {
        return 'zero'
      }
    }

    const setWager = (wager, numOfBets = 1) => {
      return `${wager}`.split('.')[1]
        ? wager.toFixed(`${wager}`.split('.')[1].length) * numOfBets
        : (wager * numOfBets).toFixed()
    }

    const setMulti = (wager, payout) => {
      if (wager === '0' || typeof payout === 'string') {
        return '0.00'
      }
      return (payout / wager).toFixed(2)
    }

    const setPayout = (payout, token) => {
      if (typeof payout === 'string') {
        return payout
      }
      const formatedPayout = +Number(payout)
        .toFixed(token === '0x55d398326f99059ff775485246999027b3197955' ? 2 : 8)
        .replace(/\.?0+$/, '')

      return `${formatedPayout}`.split('.')[1]
        ? formatedPayout.toFixed(`${formatedPayout}`.split('.')[1].length)
        : formatedPayout
    }
    const resolveIcon = (token) => {
      if (currentChain.value) {
        if (currentChain.value.symbol === 'ETH') {
          if (
            currentChain.value.priceCalculation.usdt.toLowerCase() === token.toLowerCase()
          ) {
            return '/tokens/rusdt.png'
          } else if (
            currentChain.value.smartContracts.RDTToken.toLowerCase() === token.toLowerCase()
          ) {
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
    const setPayoutBet = () => {
      liveBets.value.find(
        bet => bet.player.toLowerCase() === account.value.address?.toLowerCase()
      ).payOut = unclaimTokens.value
    }
    watch(
      () => [unclaimTokens.value, liveBets.value, isPlaying.value],
      (newValue, oldValue) => {
        const isNewValue = newValue[1].length && oldValue[1].length && newValue[1].find(
          bet => bet.player.toLowerCase() === account.value.address?.toLowerCase()
        )?.trxHash.includes(oldValue[1].find(
          bet => bet.player.toLowerCase() === account.value.address?.toLowerCase()
        )?.trxHash)
        const payout = liveBets.value && liveBets.value.find(
          bet => bet.player.toLowerCase() === account.value.address?.toLowerCase()
        )?.payOut
        if (account.value.isConnected) {
          if (unclaimTokens.value === 'waiting' || (!isNewValue && isPlaying.value)) {
            liveBets.value.find(
              bet => bet.player.toLowerCase() === account.value.address?.toLowerCase()
            ).payOut = 'Waiting'
            return
          }
          if (
            !liveBets.value.find(
              bet => bet.player.toLowerCase() === account.value.address?.toLowerCase()
            ) || `${payout}`.includes('Waiting')
          ) {
            return
          }
          if (unclaimTokens.value === 0) {
            setPayoutBet()
          }
          if (
            payout === unclaimTokens.value
          ) {
            return
          }
          if (
            payout === 0
          ) {
            setPayoutBet()
          }
        }
      }
    )

    watch(
      () => currentGame.value,
      () => {
        if (currentGame.value === 'slidedice') {
          gameName.value = 'Dice'
        } else if (currentGame.value === 'arcade') {
          gameName.value = 'Arcade Action'
        } else {
          gameName.value = currentGame.value
        }
      }
    )
    const setPaginationPage = (newValue) => {
      paginationPage.value = newValue
    }

    watch(() => [account.value, liveBets.value, active.value], () => {
      if (active.value === 1 && account.value.isConnected) {
        filteredData.value = liveBets.value.filter((item) => {
          return item.player.toLowerCase() === account.value.address?.toLowerCase()
        })
      } else if (filteredData.value.length) {
        setTimeout(() => {
          filteredData.value = liveBets.value
        }, 500)
      } else {
        filteredData.value = liveBets.value
      }
    })

    watch(
      () => filteredData.value,
      (newValue, OldValue) => {
        if (newValue[0]?.token === OldValue[0]?.token) {
          if (OldValue.length !== 0) {
            if (newValue[0].timestamp > OldValue[0].timestamp) {
              showFirstElement.value = 1
              showLastElement.value = 1
              setTimeout(() => {
                showFirstElement.value = 0
                setTimeout(() => {
                  showLastElement.value = ''
                  translateClass.value = 'translateY(30px)'
                  setTimeout(() => {
                    showLastElement.value = 0
                    setTimeout(() => {
                      translateClass.value = 'translateY(-30px)'
                    }, 1000)
                  }, 700)
                }, 700)
              }, 1050)
            }
          }
        }
      }
    )

    const resolveKey = (index, arrLendth) => {
      let result
      if (showFirstElement.value === 1) {
        result = arrLendth - index
      } else if (showLastElement.value === '') {
        result = index
      } else {
        result = arrLendth - index
      }

      return result
    }

    const data = computed(() => {
      return filteredData.value.slice(
        paginationPage.value * +filterDataCount.value + showFirstElement.value,
        (paginationPage.value + 1) * +filterDataCount.value +
        (showLastElement.value === '' ? 1 : showLastElement.value)
      )
    })

    return {
      account,
      liveBets,
      filteredData,
      active,
      filterDataCount,
      data,
      paginationPage,
      gameName,
      setPaginationPage,
      currentGame,
      checkIsPayoutHigerThanOne,
      setWager,
      setMulti,
      setPayout,
      linkTransaction,
      icon,
      showLastElement,
      resolveKey,
      translateClass,
      resolveIcon,
      makeBlockie
    }
  }
}
</script>

<style lang="scss" scoped>
.one {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0s;
  animation: dot 1.3s infinite;
  animation-delay: 0s;
}

.two {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0.2s;
  animation: dot 1.3s infinite;
  animation-delay: 0.2s;
}

.three {
  opacity: 0;
  -webkit-animation: dot 1.3s infinite;
  -webkit-animation-delay: 0.3s;
  animation: dot 1.3s infinite;
  animation-delay: 0.3s;
}

@-webkit-keyframes dot {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes dot {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.list-item {
  display: inline-block;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: var(--translate);
}

.player-row>td {
  background: rgba(158, 104, 255, 0.3);
  font-weight: 300;
}

:deep(.o-drop__menu, .o-drop__menu--active) {
  padding: 0;
  width: 130px;
}

tr td {
  border-bottom: 1px solid #251f2d;
}

.btn {
  width: 100%;
  max-width: 130px;
}

.container {
  @screen lg {
    overflow-x: hidden;
  }

  overflow-x: scroll;
}

.header>th {
  color: white;
  height: 50px;
  text-align: start;
}

.body>tr {
  border-top: 1px solid rgba(158, 148, 148, 0.322);
  height: 56px;
  color: white;
  font-weight: 300;
}

.high {
  color: #b9ff6e;
}

.low {
  color: #ffdc7e;
}

.zero {
  color: #6f6c75;
}

@media (max-width: 1216px) {
  .table {
    min-width: 1100px;
    width: 100%;
  }
}
</style>
