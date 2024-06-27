<template>
  <div class="nav grid" :style="`grid-template-columns: ${columns}`">
    <button
      v-for="(item, index) of items"
      :key="index"
      class="btn relative text-white"
      :class="[active === index ? `bg-[${activeColor}]` : 'disabled-item', index === 0 ? 'rounded-item--first' : '', index === 1 ? 'rounded-item--middle' : '', index === items.length - 1 ? 'rounded-item--last' : '', active === 1 && active === index || active === 2 && active === index ? 'text-[#FFDC7E] bg-[#9E68FF]' : '']"
      @click="activeProfileIndex = index"
    >
      {{ item }}
    </button>
  </div>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { useMenu } from '~/composables/useMenu'
export default {
  props: {
    activeColor: {
      type: String,
      required: true,
      default: '#6600FF'
    },
    active: {
      type: Number,
      required: true,
      default: 0
    },
    items: {
      type: Array as PropType<Array<string>>,
      required: true,
      default: () => []
    }
  },
  setup(props) {
    const { activeProfileIndex } = useMenu()
    const columns = computed(() => {
      let str = ''
      props.items.forEach(() => {
        str += `${100 / props.items.length}% `
      })
      return str
    })

    return {
      columns,
      activeProfileIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  background: #2C2634;
  border-radius: 12px;
  overflow: hidden;
  height: 40px;
}

.btn {
  width: 100%;
  color: white;
  font-weight: 500;
  height: 40px;
}

.disabled-item {
  background: #2C2634 !important;
}

.rounded-item--first {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.rounded-item--middle {
  border-radius: 12px;
}

.rounded-item--last {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
</style>
