<template>
  <div>
    <o-carousel
      v-model="active"
      :arrow="false"
      :indicator="false"
      :items-to-show="1"
      :repeat="true"
      :has-drag="true"
      class="mt-6"
    >
      <o-carousel-item v-for="(item, index) of data" :key="index">
        <div class="relative">
          <img :src="item.image" class="w-full">
          <div
            class="flex flex-col justify-center gap-5 absolute top-0 bottom-0 left-6 m-auto"
          >
            <div
              class="lottery-title news-item-title ss:text-4xl font-bold w-2/3"
            >
              {{ item.title }}
            </div>
            <StakingBtn
              :color="btnColor"
              :fill="true"
              :style="`color: ${btnTextColor}`"
              class="ss:h-12 h-10 ss:w-48 w-40 font-bold"
              @click="$router.push('/')"
            >
              {{ item.buttonText }}
            </StakingBtn>
          </div>
        </div>
      </o-carousel-item>
    </o-carousel>
    <div class="flex justify-center gap-2 mt-2">
      <button
        v-for="(item, index) of data"
        :key="index"
        :class="active === index ? 'active-item' : 'disabled-item'"
        @click="active = index"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import newsData from '~/data/news-data.json'
export default {
  props: {
    btnColor: {
      type: String,
      required: true,
      default: ''
    },
    btnTextColor: {
      type: String,
      required: false,
      default: 'black'
    }
  },
  setup() {
    const active = ref(0)
    return {
      data: newsData,
      active
    }
  }
}
</script>

<style lang="scss" scoped>
.active-item,
.disabled-item {
  width: 9px;
  height: 9px;
  border-radius: 30px;
}
.active-item {
  background: #9e68ff;
}
.disabled-item {
  background: #e6e6e6;
  mix-blend-mode: normal;
}
.news-item-title {
  line-height: 1.2 !important;
}
</style>
