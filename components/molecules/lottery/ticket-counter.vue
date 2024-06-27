<template>
  <div class=" mt-6 text-xs">
    <div class="flex justify-between pb-[4px]">
      <div>Amount</div>
      <div class="hidden md:block">
        {{ token }}
      </div>
    </div>
    <div class="flex gap-2 text-lg">
      <button class="rounded-xl w-full h-12 btnCounter" @click="$emit('removeTicket')">
        -
      </button>
      <button class="border-2 border-[#9E68FF] border- rounded-xl w-full h-12">
        {{
          ticketsQuantity
        }}
      </button>
      <button class="bg-[#38333F] rounded-xl w-full h-12 btnCounter" @click="$emit('addTicket')">
        +
      </button>
      <button class=" rounded-xl w-full h-12 btnMaxCounter" @click="$emit('maxTickets')">
        Max
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    token: {
      type: String,
      required: true,
      default: ''
    },
    ticketsQuantity: {
      type: Number,
      required: true,
      default: 0
    }
  },
  emits: ['removeTicket', 'addTicket', 'maxTickets']
}
</script>

<style lang="scss" scoped>
.btnCounter {
  background-color: #38333F;
  border: 1px solid #38333F;
  transition-duration: .1s;

  &:hover {
    border: 1px solid white;

  }
}

.btnMaxCounter {
  background-color: #FF6600;
  border: 1px solid #FF6600;
  transition-duration: .1s;

  &:hover {
    background-color: white;
    color: #FF6600;
    border: 1px solid #FF6600;

  }
}
</style>
