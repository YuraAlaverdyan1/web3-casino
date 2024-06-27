<template>
  <div class="flex justify-between mt-7 pb-2 items-center gap-4">
    <div class="text-white text-medium">
      Total {{ data.length }} items
    </div>
    <div class="flex gap-2">
      <PaginationItem :prev="true" @click="prev" />
      <PaginationItem v-if="position > 0" :active="data.length / +filter === 1" :number="1" @click="filterElements(0)" />
      <PaginationItem v-if="position > 1" :middle="true" />
      <PaginationItem
        v-for="(number, index) of part1"
        :key="index"
        :active="position + index + 1 === active"
        :number="position + index + 1"
        @click="filterElements(position + index)"
      />
      <PaginationItem v-if="position < last - 4" :middle="true" />
      <PaginationItem v-if="position < last - 4" :number="last" @click="filterElements(last - 1)" />
      <PaginationItem :next="true" @click="next" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue'
export default {
  props: {
    data: {
      type: Array as PropType<Array<any>>,
      default: () => []
    },
    filter: {
      type: String,
      default: ''
    },
    last: {
      type: Number,
      default: 0
    }
  },
  emits: ['filterElements'],
  setup(props, { emit }) {
    const position = ref<number>(0)
    const active = ref(1)

    const filteredData = computed(() => {
      const start = position.value * +props.filter
      const Data = [...props.data]
      return Data.slice(start, start + +props.filter)
    })

    const filterElements = (index) => {
      position.value = index
      active.value = index + 1
      emit('filterElements', { data: filteredData.value, position: position.value })
    }

    const next = () => {
      if (position.value < props.last - 4) {
        position.value++
        active.value++
        emit('filterElements', filteredData.value)
      }
    }

    const prev = () => {
      if (position.value > 0) {
        position.value--
        active.value--
        emit('filterElements', filteredData.value)
      }
    }

    const part1 = computed(() => {
      if (props.last < 4) {
        if (position.value === 0) {
          return new Array(props.last)
        } else if (props.last < 4) {
          return new Array(props.last - position.value)
        }
      } else if (position.value >= props.last - 4) {
        return new Array(props.last - position.value)
      }
      if (position.value === 0) {
        return new Array(4)
      }
      return new Array(position.value * Math.ceil(props.data.length / +props.filter)).slice(0, 4)
    })

    return {
      filteredData,
      position,
      part1,
      active,
      filterElements,
      next,
      prev
    }
  }
}
</script>

<style lang="scss" scoped></style>
