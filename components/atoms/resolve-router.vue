<template>
  <div class="flex gap-[8px] px-[0px] mt-[4px] ml-[4px]">
    <div data-aos="zoom-out" data-aos-once="true" data-aos-delay="700">
      <div
        class="w-[40px] h-[40px] flex justify-center items-center rounded-[8px] border-[#424245] border-[1px] scale-100 hover:scale-[1.05] transition-all cursor-pointer"
        @click="router.back()"
      >
        <img src="/images/menu/arrow-right.svg" class="-rotate-[180deg]">
      </div>
    </div>
    <div
      v-for="(item, index) of resolveRoutes()"
      :key="index"
      data-aos="zoom-out"
      data-aos-once="true"
      :data-aos-delay="1000 + (index * 100)"
    >
      <NuxtLink
        v-if="resolveRoutes().length - 1 !== index"
        :to="resolveAllRoutes(item, index)"
        class="px-[8px] h-[40px] flex justify-center items-center rounded-[8px] border-[#424245] border-[1px] scale-100 hover:scale-[1.05] transition-all cursor-pointer"
        :class="[index === resolveRoutes().length - 1 && 'bg-[#201A29]']"
      >
        <p class="text-[14px] capitalize cut-text" :class="index === resolveRoutes().length - 1 && 'font-[700]'">
          {{ item.split("-").join(" ") }}
        </p>
      </NuxtLink>

      <div
        v-else
        class="px-[8px] h-[40px] justify-center items-center rounded-[8px] border-[#424245] border-[1px] scale-100 hover:scale-[1.05] transition-all cursor-pointer"
        :class="[index === resolveRoutes().length - 1 && 'bg-[#201A29]', hideLast ? 'hidden ss:flex' : 'flex']"
      >
        <p class="text-[14px] capitalize cut-text" :class="index === resolveRoutes().length - 1 && 'font-[700]'">
          {{ item.split("-").join(" ") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
export default {
  props: {
    hideLast: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    const router = useRouter()
    const resolveRoutes: string[] = () => {
      if ((router.currentRoute.value.path.split('/').length === 2 && router.currentRoute.value.path.split('/')[1] !== 'casino') || router.currentRoute.value.path.split('/')[1] === 'profile') {
        return ['home', ...router.currentRoute.value.path.split('/')].filter(route => route !== '')
      } else {
        if (props.hideLast) {
          return router.currentRoute.value.path
            .split('/')
            .filter(route => route !== '').slice(0, router.currentRoute.value.path
              .split('/')
              .filter(route => route !== '').length - 1)
        }
        return router.currentRoute.value.path
          .split('/')
          .filter(route => route !== '')
      }
    }
    const resolveAllRoutes: string = (item: string, index: number) => {
      if (item === 'home' || `/${resolveRoutes().slice(0, index + 1).join('/')}` === '/games') {
        return '/'
      } else {
        return `/${resolveRoutes().slice(0, index + 1).join('/')}`
      }
    }
    return {
      resolveRoutes,
      router,
      resolveAllRoutes
    }
  }
}

</script>

<style lang="scss" scoped>
.cut-text {
  max-width: 90px;
  width: fit-content;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;

  @screen ss {
    max-width: 200px;
  }

  @screen sm {
    max-width: 100%;
  }
}
</style>
