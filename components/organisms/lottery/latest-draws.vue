<template>
  <div class="mt-10">
    <div class="lottery-title">
      Latest Draw Results
    </div>
    <div class="content mt-8">
      <LotteryLatestDrawsNav
        :is-small="isSmall"
        class="my-4"
        :disable-buttons="disableButtons"
        :active-item="active"
        :items="latestDrawsData.length - itemsToShow"
        :show-arrows="latestDrawsData.length > itemsToShow"
        @next="next"
        @prev="prev"
        @all="all"
      />
      <LotteryLatestDrawSmall
        :is-all="isAll"
        :active="active"
        :data="LatestDrawsData"
        :small="small"
        :items-to-show="itemsToShow"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ref
} from 'vue'
import { useBreakpoints } from '@vueuse/core'
import latestDrawsData from '~/data/latest-draws.json'
import { BreakPoint } from '~/model/break-points'
export default {
  emits: ['openPrizeModal'],
  props: {
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const sortItem = ref('10')
    const active = ref(0)
    const isAll = ref(false)
    const lastItem = ref(latestDrawsData.length / +sortItem.value)
    const LatestDrawsData = ref([...latestDrawsData])
    const disableButtons = ref(false)
    const breakpoints = useBreakpoints(BreakPoint)
    const itemsToShow = computed(() => {
      if (props.small && breakpoints.xl.value) {
        return 4
      } else if (props.small && breakpoints.lg.value) {
        return 3
      } else if (props.small && breakpoints.md.value) {
        return 2
      }
      return 1
    })

    const sort = (el) => {
      sortItem.value = el
      lastItem.value = Math.ceil(latestDrawsData.length / +sortItem.value)
    }
    const next = () => {
      if (active.value < LatestDrawsData.value.length - itemsToShow.value) {
        active.value++
      }
    }

    const prev = () => {
      if (active.value > 0) {
        active.value--
      }
    }

    const all = () => {
      isAll.value = !isAll.value
      active.value = 0
      if (isAll.value) {
        disableButtons.value = true
      } else {
        disableButtons.value = false
      }
    }

    return {
      LatestDrawsData,
      latestDrawsData,
      sortItem,
      lastItem,
      sort,
      isAll,
      active,
      next,
      prev,
      all,
      disableButtons,
      itemsToShow
    }
  }
}
</script>
