<template>
  <div class="part-1">
    <Info v-if="isSmall && smallDetails1" :data="Data" />
    <div class="carousel relative">
      <o-carousel
        v-model="active"
        :arrow="false"
        :indicator="false"
        :items-to-show="1"
        :repeat="false"
        :has-drag="true"
        class="w-full max-w-fit"
      >
        <o-carousel-item v-for="(item, index) of data.images" :key="index">
          <img :src="item.image" class="item-image w-full">
        </o-carousel-item>
      </o-carousel>
      <div
        v-if="!isSmall"
        class="details flex flex-col md:gap-8 gap-2"
      >
        <div class="title text-white font-bold">
          {{ data.title }}
        </div>
        <div class="subtitle">
          {{ data.subtitle }}
        </div>
        <StakingBtn
          :active="true"
          :hover-color="'#9E68FF'"
          :color="'#6600FF'"
          :fill="true"
          class="w-40 lg:h-16 h-12 font-semibold lg:text-2xl text-base"
        >
          {{ data.btnText }}
        </StakingBtn>
        <input type="image" src="/images/home/part-1/left.png" class="arrow-left" @click="active > 0 ? active-- : ''">
        <input
          type="image"
          src="/images/home/part-1/right.png"
          class="arrow-right"
          :class="!menu && !isSmall ? 'closed-menu-arrow' : ''"
          @click="active < data.images.length - 1 ? active++ : ''"
        >
      </div>
      <div class="indicators">
        <button
          v-for="(indicator, index) of data.images"
          :key="index"
          :class="index === active ? 'active-indicator' : 'disabled-indicator'"
          @click="active = index"
        />
      </div>
    </div>
    <div v-if="isSmall && smallDetails2" class="flex flex-col gap-5 mt-10">
      <div class="lottery-title">
        {{ details2Title }}
      </div>
      <div style="color: #E6E6E6;">
        {{ details2SubTitle }}
      </div>
      <StakingBtn
        v-if="details2Btn"
        :color="'#9E68FF'"
        :fill="true"
        class="flex justify-center items-center gap-2 rounded-3xl"
      >
        {{ details2BtnText }} <img src="/images/nav/arrow-right.png">
      </StakingBtn>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref, defineComponent, computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useMenu } from '~/composables/useMenu'
import { BreakPoint } from '~/model/break-points'

export default defineComponent({
  name: 'PartOne',
  props: {
    smallDetails1: {
      type: Boolean,
      required: false,
      default: false
    },
    smallDetails2: {
      type: Boolean,
      required: false,
      default: false
    },
    details2Btn: {
      type: Boolean,
      required: false,
      default: false
    },
    data: {
      type: Object as PropType<any>,
      default: () => ({})
    },
    details2Title: {
      type: String,
      required: false,
      default: ''
    },
    details2SubTitle: {
      type: String,
      required: false,
      default: ''
    },
    details2BtnText: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup() {
    const { menu } = useMenu()
    const active = ref(0)

    const breakpoints = useBreakpoints(BreakPoint)
    const isSmall = computed(() => {
      return breakpoints.smaller('sm').value
    })

    return {
      menu,
      active,
      Data: {
        btn1Text: 'Go to Casino',
        smallTitle1: 'Play the Worlds First 100% Verifiably Fair Jackpot Lottery',
        smallTitle2: ' Today and Everyday!'
      },
      isSmall,
      breakpoints
    }
  }
})
</script>

<style lang="scss" scoped>
.details {
  @screen lg {
    top: 30%;
  }

  @screen md {
    width: 78%;
  }

  width: 90%;
  position: absolute;
  top: 15%;
  left: 10%;
}

.title {
  @screen lg {
    font-size: 2.7rem;
  }

  font-size: 2rem;
  line-height: 1.1;
}

.subtitle {
  @screen md {
    font-size: 16px;
  }

  font-size: 14px;
  width: 80%;
  color: #C5C6D3;
}

.active-indicator,
.disabled-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.active-indicator {
  background: #9E68FF;
}

.disabled-indicator {
  background: grey;
}

.indicators {
  width: 100%;
  bottom: -20px;
  @apply flex justify-center gap-2 absolute;
}

.part-1 {
  margin-top: 40px;
}

.carousel {
  @apply relative flex flex-col justify-center items-start;
}

.arrow-left,
.arrow-right {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}

.arrow-left {
  left: -10%;
}

.arrow-right {
  @screen md {
    right: -13%;
  }

  right: 5px;
}

.closed-menu-arrow {
  right: -13%;
}</style>
