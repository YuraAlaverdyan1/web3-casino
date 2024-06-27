<template>
  <NuxtLink class="item" :to="view">
    <img :src="img" class="w-full h-1/2">
    <div class="content">
      <div class="title-text part-3-title">
        {{ title }}
      </div>
      <div class="subtitle-text part-3-subtitle">
        {{ subtitle }}
      </div>
      <StakingBtn
        :active="true"
        :fill="true"
        :color="'#6600FF'"
        :hover-color="'#9E68FF'"
        class="font-semibold text-lg w-44"
        style="min-height: 60px; max-height: 60px"
        @click="view"
      >
        {{ name }}
      </StakingBtn>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
export default {
  props: {
    img: {
      type: String,
      required: true,
      default: ''
    },
    name: {
      type: String,
      required: true,
      default: ''
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    subtitle: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()
    const view = () => {
      if (props.name === 'Lotteries') {
        router.push(`/lottery`)
      } else {
        router.push(`/${props.name.toLowerCase()}`)
      }
    }
    return {
      view
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  height: 550px;
  background: #201A29;
  border-radius: 12px;
  width: 50%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition:.6s;
  &:hover {
    .content {
      height: 54%;
      background: #2C2634;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      z-index: 10;
    }

    img {
      transform: scale(1.05);
      height: 51%;
      object-fit: cover;
      z-index: -1;
    }
  }
}

img {
  transition: .5s ease-in-out;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  object-fit: cover;
  height: 50%;
}

.content {
  transition: .6s ease-in-out;
  height: 50%;
  position: absolute;
  bottom: 0;
  @apply flex flex-col items-start gap-4 p-6;
}

.part-3-title {
  font-size: 20px;
}

.part-3-subtitle {
  font-size: 14px;
  letter-spacing: 1px;
  color: #E6E6E6;
  font-weight: 400;
  width: 90%;
  text-align: left;
  line-height: 1.5;
}
</style>
