<template>
  <div class="referral-carousel relative w-full rounded-[12px]">
    <div class="text-[20px] font-[500] text-center mt-10">
      <p class="">
        Predicted Rewards to be won
      </p>
    </div>
    <div class="carousel-list-container z-10 flex text-xl relative items-center justify-center text-center">
      <div class="slider flex items-center">
        <div
          v-for="(props, index) of enrichedNews"
          :key="index"
          class="transition-all mt-10 slider-item bg-cover overflow-hidden border-[1px] rounded-[12px] bg-no-repeat flex flex-col justify-between"
          :style="`background: url('${props.image}')`"
          :class="[resolveClass(index, enrichedNews.length), selected === index ? 'border-[#60F]' : 'border-transparent']"
        >
          <div class="flex items-center justify-between pt-[22px] px-[24px]">
            <div class="bg-[#60F] px-[12px] py-[4px] rounded-[8px] flex items-center justify-center h-[24px]">
              <p class="text-[12px] font-[700]">
                {{ props.label }}
              </p>
            </div>
            <div class="">
              <p class="text-[16px] font-[700] uppercase">
                {{ props.title }}
              </p>
            </div>
          </div>
          <div :class="index === selected ? 'opacity-100' : 'opacity-0'" class="h-[116px] w-full relative mt-auto">
            <div
              class="absolute rounded-b-[10px] gap bg-black/70 h-full bottom-0 text-[5px] flex flex-col items-center justify-center m-0 py-0 w-full"
            >
              <div class="flex px-[24px] flex-wrap w-full basis-1/2 items-center mt-[8px] font-light">
                <div class="basis-1/3 h-[10px] flex justify-center items-center">
                  <span class="text-[12px] font-[400]">Required Point</span>
                </div>
                <div class="basis-1/3 h-[10px] flex justify-center items-center">
                  <span class="text-[12px] font-[400]">Prizes</span>
                </div>
                <div class="basis-1/3 h-[10px] flex justify-center items-center">
                  <span class="text-[12px] font-[400]">Chance to Win</span>
                </div>
                <div class="basis-1/3 flex justify-center items-center text-[6px]">
                  <div class="flex gap-[3px] items-center justify-center w-full">
                    <span class="text-[16px] font-[600]">{{ props.requirePoints }}</span>
                    <img src="/profile/carousel/diamond.svg" alt="point-icon" class="w-[24px] h-[20px]">
                  </div>
                </div>
                <div class="basis-1/3 flex justify-center items-center text-[6px]">
                  <div class="flex gap-[3px] items-center justify-center w-full">
                    <span class="text-[16px] font-[600]">{{ props.prizes }}</span>
                    <img :src="props.prizesIcon" alt="point-icon" class="w-[20px]">
                  </div>
                </div>
                <div class="basis-1/3 h-[8px] flex justify-center items-center text-[6px]">
                  <div class="flex gap-[5px] items-center justify-center w-full">
                    <img
                      v-for="(luck, i) of props.chancesToWin"
                      :key="i"
                      :src="luck"
                      alt="point-icon"
                      class="w-[23px] h-[23px] scale-[1.03]"
                    >
                  </div>
                </div>
              </div>
              <div class="basis-1/2 w-full justify-center flex mt-[5px]">
                <button class="h-[40px] w-full mx-[24px]">
                  <span class="text-[16px] font-[700]"> Invite Friends </span>
                  <img src="/svgs/x-social.svg">
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="carousel-arrow w-full absolute bottom-[35px]">
          <div class="flex gap-4 mb-1 justify-center w-full">
            <div class="hover:opacity-75 cursor-pointer w-[40px] h-[40px] flex items-center justify-center border-[1px] border-[#424245] rounded-[8px] scale-100 hover:scale-[1.03] transition-all active:border-[#fff]" @click="prev">
              <img src="/betting/arrow.svg" alt="arrow" class="-rotate-90 select-none">
            </div>
            <div class="flex items-center gap-[10px]">
              <div
                v-for="(item, index) of enrichedNews"
                :key="index"
                :class="selected === index ? 'w-[16px] h-[16px] bg-[#6600FF]' : 'w-[12px] h-[12px] bg-[#413C48]'"
                class="rounded-full transition-all scale-100 hover:scale-[1.05] cursor-pointer hover:bg-[#6600FF]"
                @click="selected = index"
              />
            </div>
            <div class="hover:opacity-75 cursor-pointer w-[40px] h-[40px] flex items-center justify-center border-[1px] border-[#424245] rounded-[8px] scale-100 hover:scale-[1.03] transition-all active:border-[#fff]" @click="next">
              <img src="/betting/arrow.svg" alt="arrow" class="rotate-90 select-none">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import profileGallery from '~/data/profile-gallery.json'

const selected = ref(2)
const news = ref(profileGallery)
const translate = ref(0)

const resolveClass = (index, allitems) => {
  if (index === selected.value) {
    return 'active-item'
  } else if (index - 2 === selected.value || (selected.value === enrichedNews.value.length - 2 && index === 0) || (selected.value === enrichedNews.value.length - 1 && index === 1)) {
    return 'first-item'
  } else if (index - 1 === selected.value || (selected.value === enrichedNews.value.length - 1 && index === 0) || (selected.value === enrichedNews.value.length - 1 && index === 1)) {
    return 'second-item'
  } else if (index + 1 === selected.value || (selected.value === 0 && index === allitems - 1)) {
    return 'fourth-item'
  } else if (index + 2 === selected.value || (selected.value === 1 && index === allitems - 1) || (selected.value === 0 && index === allitems - 2)) {
    return 'fifth-item'
  } else {
    return 'hidden-item'
  }
}
const itemsToShow = computed(() => {
  return 5
})

const enrichedNews = computed(() => {
  return [...news.value]
})

const setValues = () => {
  selected.value = 2
  translate.value = 0
}

const next = () => {
  if (selected.value === enrichedNews.value.length - 1) {
    selected.value = 0
  } else {
    selected.value++
  }
}

const prev = () => {
  if (selected.value === 0) {
    selected.value = enrichedNews.value.length - 1
  } else {
    selected.value--
  }
}

const elTranslate = computed(() => {
  return `${translate.value}px`
})

watch(
  () => itemsToShow.value,
  () => {
    setValues()
  }
)
</script>
<style lang="scss" scoped>
.slider {
  position: relative;
  width: 70%;
  height: 550px;
  max-width: 400px;
  margin: 150px auto;
  perspective: 1400px;
  transform-style: preserve-3d;
  min-width: 375px;

  @screen md {
    min-width: 345px;
  }

  @screen lg {
    min-width: 275px;
  }
}

.slider-item {
  position: absolute;
  width: 100%;
  max-width: 400px;
  height: 400px;
  left: 0;
  top: 0;
  transition: transform 400ms ease;
  z-index: 0;
  opacity: 1;
}

.blur {
  background: rgba(23, 17, 32, 0.10);

  backdrop-filter: blur(10px);
}

.active-item {
  transform: translate3d(0%, 0, 0px);
  opacity: 1;
  z-index: 10;
}

.first-item {
  transform: translate3d(-70%, 0, -850px);
  opacity: 1;
  z-index: 2;
}

.second-item {
  transform: translate3d(-27%, 0, -270px);
  opacity: 1;
  z-index: 5;
}

.fourth-item {
  transform: translate3d(27%, 0, -270px);
  opacity: 1;
  z-index: 5;
}

.fifth-item {
  transform: translate3d(70%, 0, -850px);
  opacity: 1;
  z-index: 2;
}

.hidden-item {
  transform: translate3d(0%, 0, 0px);
  opacity: 0;
  z-index: 0;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 5px;
  width: 80%;
  padding: 0 4px !important;
  height: 16px;
  background: var(--primary-01, #f5f5f7);
  color: #6600ff;
}

.carousel-list-container,
:deep(.o-car__items) {
  height: 500px;

  @screen sm {
    height: 515px;
  }
}

.news-button {
  padding: 10px;
  min-width: 230px;
}

.news-arrow {
  width: 7px;
  height: 7px;
  float: right;
  transition: 0.5s;
  box-shadow: -2px 2px 0 #332f65;
  transform: rotate(-135deg);
  position: relative;
  top: 2px;
}

.titles-container {
  display: flex;
  flex-direction: column;
}

.stay-updated-title {
  display: flex;
}

.news {
  height: 820px;
  padding-top: 80px;

  @screen ss {
    height: 790px;
  }

  @screen md {
    height: 780px;
  }

  @screen lg {
    height: 730px;
  }

  @screen xl {
    height: 750px;
  }
}

.has-icons-left,
.has-icons-right {
  width: 50px;
  height: 50px;
  background-size: 50px;
  border: none !important;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent !important;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
}

.light-arrow-left {
  background: url(/images/arrows/arrow-left-light.svg);
}

.light-arrow-right {
  background: url(/images/arrows/arrow-right-light.svg);
}

.dark-arrow-left {
  background: url(/images/arrows/arrow-left.svg);
}

.dark-arrow-right {
  background: url(/images/arrows/arrow-right.svg);
}

:deep(.new-card):not(.selected) {
  opacity: 0.6;
}

:deep(.o-car__items) {
  transform: translateX(v-bind(elTranslate)) !important;

  .selected {
    filter: none !important;
  }
}

.dark {
  .news-arrow {
    box-shadow: -2px 2px 0 #fff;
  }
}

@media (max-width: 540px) {
  .carousel-arrow {
    bottom: 10px;
  }

  .news-button {
    top: 90px !important;
  }
}

@media (max-width: 450px) {
  .news-button {
    top: 40px !important;
  }
}
</style>
