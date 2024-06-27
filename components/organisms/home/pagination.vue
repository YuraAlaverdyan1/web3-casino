<template>
  <div
    v-if="filteredData.length > 0 && paginationValues.length !== 1"
    class="flex gap-[8px] justify-center md:justify-end px-[12px] lg:px-[0px] mb-[3px] mt-[20px] h-[40px]"
  >
    <div
      class="w-[40px] h-[40px] flex justify-center items-center rounded-[8px] border-[#424245] border-[1px] scale-100 transition-all select-none"
      :class="paginationPage !== 0 && 'hover:scale-[1.05] active:scale-100 cursor-pointer'
      "
      @click="setPaginationPage(paginationPage === 0 ? paginationPage : paginationPage - 1 )"
    >
      <img src="/images/menu/arrow-right.svg" class="-rotate-[180deg]" :class="paginationPage == 0 && 'opacity-50'">
    </div>

    <div
      v-for="(item, index) of paginationValues"
      :key="index"
      class="w-[40px] h-[40px] flex justify-center items-center rounded-[8px] border-[1px] scale-100 hover:scale-[1.05] transition-all cursor-pointer"
      :class="paginationPage === item ? 'border-[#fff]' : 'border-[#424245]'"
      @click="item !== '...' ? (setPaginationPage(item)) : ''"
    >
      <p class="text-[14px] font-[700] select-none">
        {{ item === "..." ? "..." : item + 1 }}
      </p>
    </div>
    <div
      class="w-[40px] h-[40px] flex justify-center items-center rounded-[8px] border-[#424245] border-[1px] scale-100 transition-all select-none"
      :class="paginationPage !== paginationValues[paginationValues.length - 1] &&
        'hover:scale-[1.05] active:scale-100 cursor-pointer'
      "
      @click="setPaginationPage( paginationPage !== paginationValues[paginationValues.length - 1] ?paginationPage + 1 : paginationPage )"
    >
      <img
        src="/images/menu/arrow-right.svg"
        :class="paginationPage === paginationValues[paginationValues.length - 1] &&
          'opacity-50'
        "
      >
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'

export default {
  props: {
    filteredData: {
      type: Array,
      required: true

    },
    filterDataCount: {
      type: String,
      required: true,
      default: '10'
    },
    paginationPage: {
      type: Number,
      required: true,
      default: 0
    },
    setPaginationPage: {
      type: Function,
      required: true,
      default: () => { }
    }
  },

  setup(props) {
    const selectedPage = ref(0)

    const itemsArr = ref([])

    const setItemsArr = () => {
      if (props.filteredData) {
        itemsArr.value = Array(
          Math.ceil(props.filteredData.length / props.filterDataCount)
        )
          .fill(0)
          .map((_e, index) => index)
      }
    }
    onMounted(() => {
      setItemsArr()
    })
    watch(() => props.filteredData, () => {
      setItemsArr()
    })

    const paginationValues = computed(() => {
      if (
        itemsArr.value.length > 6 &&
        props.paginationPage <= 3 &&
        itemsArr.value.length > 7
      ) {
        return [
          ...itemsArr.value.slice(0, 5),
          '...',
          ...itemsArr.value.slice(itemsArr.value.length - 1, itemsArr.value.length)
        ]
      }

      if (

        props.paginationPage >= itemsArr.value.length - 3 &&
        itemsArr.value.length > 7
      ) {
        return [
          ...itemsArr.value.slice(0, 1),
          '...',
          ...itemsArr.value.slice(itemsArr.value.length - 5, itemsArr.value.length)
        ]
      }

      if (
        (props.paginationPage >= itemsArr.value.length - 4 || props.paginationPage > 3) &&
        itemsArr.value.length > 7
      ) {
        return [
          ...itemsArr.value.slice(0, 1),
          '...',
          ...itemsArr.value.slice(props.paginationPage - 1, props.paginationPage),
          ...itemsArr.value.slice(props.paginationPage, props.paginationPage + 2),
          '...',
          ...itemsArr.value.slice(itemsArr.value.length - 1, itemsArr.value.length)
        ]
      }

      return itemsArr.value
    })

    const data = computed(() => {
      return props.filteredData.slice(
        props.paginationPage * +props.filterDataCount,
        (props.paginationPage + 1) * +props.filterDataCount
      )
    })
    return {
      selectedPage,
      paginationValues,
      data
    }
  }
}
</script>
