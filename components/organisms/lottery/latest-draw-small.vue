<template>
  <div>
    <o-carousel
      v-if="!isAll"
      v-model="activeSlide"
      :arrow="false"
      :indicator="false"
      :items-to-show="itemsToShow"
      :repeat="false"
      :has-drag="true"
      class="my-[24px]"
    >
      <o-carousel-item
        v-for="(item, index) of data"
        :key="index"
        :class="details === 'showed' ? 'with-opened-details' : ''"
      >
        <LotteryLatestDrawSmallItem
          :index="index"
          :type="item.type"
          :active="active"
          :jackpot="item.payout"
          :date="item.date"
          :numbers="item.lucky"
          :last="data.length - 1"
          :round="item.round"
          :token="item.wallet"
          :details="details"
          :small="small"
          @next="activeSlide++"
          @prev="activeSlide--"
          @show="details = 'showed'"
        />
      </o-carousel-item>
    </o-carousel>
    <div
      v-else
      :style="`grid-template-columns: repeat(${itemsToShow}, minmax(0, 1fr));`"
      class="grid gap-[4px] px-[2px] mt-[26px]"
    >
      <div v-for="(item, index) of data" :key="index" :class="details === 'showed' ? 'with-opened-details' : ''">
        <LotteryLatestDrawSmallItem
          :index="index"
          :type="item.type"
          :active="active"
          :jackpot="item.payout"
          :date="item.date"
          :numbers="item.lucky"
          :last="data.length - 1"
          :round="item.round"
          :token="item.wallet"
          :details="details"
          :small="small"
          @next="activeSlide++"
          @prev="activeSlide--"
          @show="details = 'showed'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref, watch } from 'vue'

export default {
  props: {
    data: {
      type: Array as PropType<Array<any>>,
      required: true,
      default: () => []
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    },
    active: {
      type: Number,
      required: true
    },
    isAll: {
      type: Boolean,
      required: false,
      default: false
    },
    itemsToShow: {
      type: Number,
      required: true
    }

  },
  setup(props) {
    const details = ref('hidden')
    const activeSlide = ref(props.active)

    watch(() => props.active, () => {
      activeSlide.value = props.active
    }, { deep: true, immediate: true })

    return {
      details,
      activeSlide
    }
  }
}
</script>

<style lang="scss" scoped>
.with-opened-details {
  min-height: 1100px;
}
</style>
