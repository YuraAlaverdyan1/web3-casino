<template>
  <div>
    <div class="lottery-title my-4">
      {{ title }}
    </div>
    <div>
      <div class="flex items-center justify-between">
        <div v-if="!isSmall" class="flex text-white gap-4">
          Stacked Only
          <o-switch v-model="active" />
        </div>
        <ItemsNav :items="['Live', 'Finished']" :active="activeNav" :staking="true" class="sm:w-1/2 w-full" @set-active="(e) => $emit('setActive', e)" />
      </div>
    </div>
    <div class="flex justify-between items-center my-8">
      <div class="flex gap-2 items-center sm:overflow-hidden overflow-y-scroll">
        <SelectBtn :text="'Games'" />
        <SelectBtn :text="'APR'" />
        <SelectBtn :text="'Earned'" />
        <SelectBtn :text="'Total Staked'" />
        <SelectBtn :text="'Latest'" />
      </div>
      <LotteryArrows v-if="!isSmall" />
    </div>
    <div v-if="isSmall" class="flex items-center justify-between">
      <div class="flex text-white gap-4">
        Stacked Only
        <o-switch v-model="active" />
      </div>
      <LotteryArrows />
    </div>
    <div class="staking-elements-container mt-6">
      <ProfileStakingElement
        v-for="(el, index) of data"
        :key="index"
        :staked="active"
        :balance="wallet.balance"
        :title="el.name"
        :estimated="el.estimated"
        :stake="el.stake"
        :token="el.token"
        :big-image="el.bigImage"
        :total-reward="el.totalReward"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue'
export default {
    props: {
        staking: {
            type: Object as PropType<any>,
            required: true,
            default: () => {
                return {}
            }
        },
        title: {
          type: String,
          required: true
        },
        isSmall: {
          type: Boolean,
          required: false,
          default: false
        },
        wallet: {
            type: Object as PropType<any>,
            required: true,
            default: () => {
                return {}
            }
        }
    },
    emits: ['setActive'],
    setup(props) {
        const active = ref(false)
        const activeNav = ref(0)

        const data = computed(() => {
            return active.value ? props.staking.stakedGames : props.staking.games
        })

        return {
            active,
            data,
            activeNav
        }
    }
}
</script>

<style lang="scss" scoped>
    :deep(.o-switch__check) {
      background: linear-gradient(0deg, rgba(31, 192, 240, 0.05), rgba(31, 192, 240, 0.05)), #1C1B1F;
    }
    :deep(.o-switch__check--checked) {
      background: #6600FF;
    }
    .staking-elements-container {
        grid-template-columns: 50% 50%;
        gap: 15px;
        @apply sm:grid flex flex-wrap;
    }
</style>
