<template>
  <div class="w-screen">
    <div :class="menu ? 'footer-wrapper-short' : 'footer-wrapper'">
      <div class="footer sm:scale-[0.8] md:scale-[1]">
        <div
          class="flex justify-center sm:justify-between w-full gap-[40px] md:gap-0 flex-col sm:flex-row px-[24px] pt-[10px] sm:p-0"
        >
          <div
            class="part-1 w-full sm:width-[396px] flex-col mx-auto ss:text-center sm:text-left"
          >
            <div class="flex items-center justify-between ss:mx-auto sm:mx-0">
              <img
                src="/images/nav/logo.svg"
                class="w-[150px] h-[27px] ml-[20px] sm:ml-[10px]"
              >
            </div>
            <div
              class="part-1-text default-text text-[16px] mt-[18px] sm:mt-0 font-[400] ml-[13px] sm:ml-0 mr-[10px]"
            >
              Based on complete transparency, anonymity, security and fairness,
              Ridotto is a fully scalable alternative to centralized online
              gambling.
            </div>
            <FooterNav v-if="!isSmall" class="mt-[22px]" />
          </div>
          <FooterNav v-if="isSmall" :is-small="isSmall" />
          <div class="max-w-[300px] sm:max-w-[444px] w-full mt-[4px] mx-auto">
            <div
              class="flex items-center justify-between w-full ml-[2px] pr-[8px]"
            >
              <a
                v-for="(icon, index) of socialIcons"
                :key="index"
                :href="icon.url"
                target="_blank"
                class="icon"
              >
                <img :src="icon.image">
              </a>
            </div>
            <div
              class="flex items-center justify-between last:mr-[15px] mt-[40px] sm:hidden"
            >
              <div class="footer-title">
                {{ data[2].title }}
              </div>
              <div class="flex gap-[4px] sm:hidden">
                <img src="/images/footer/letter-icon.svg">
                <NuxtLink
                  :to="`${data[2].subTitles[0].link.toLowerCase()}`"
                  class="footer-subtitle"
                >
                  {{ data[2].subTitles[0].label }}
                </NuxtLink>
              </div>
            </div>
            <div class="flex justify-between mt-[47px] sm:mt-[19px]">
              <div
                v-for="(col, index) of data"
                :key="index"
                class="col flex-col [&:nth-child(2)]:mr-[15px] sm:[&:nth-child(2)]:mr-[0px] sm:[&:nth-child(2)]:ml-[18px] last:mr-[15px]"
                :class="index === 2 ? 'hidden sm:flex' : 'flex'"
              >
                <div class="footer-title">
                  {{ col.title }}
                </div>
                <div
                  v-for="(subtitle, i) of col.subTitles"
                  :key="i"
                >
                  <a
                    v-if="subtitle.link.includes('https')"
                    :href="subtitle.link.toLowerCase()"
                    class="footer-subtitle"
                    target="_blank"
                    @click="subtitle.action && activateAction(subtitle.action)"
                  >
                    {{ subtitle.label }}
                  </a>
                  <NuxtLink
                    v-else
                    :to="
                      subtitle.link.includes('mailto')
                        ? `${subtitle.link.toLowerCase()}`
                        : `/${subtitle.link.toLowerCase()}`
                    "
                    class="footer-subtitle"
                    @click="subtitle.action && activateAction(subtitle.action)"
                  >
                    {{ subtitle.label }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="line hidden sm:block" />
        <div
          class="footer-subtitle end ss:text-center sm:text-left mt-[47px] sm:mt-[0px] ml-[38px] sm:ml-[0px]"
        >
          Copyright © 2021-2024 Ridotto. All rights reserved
        </div>
      </div>
    </div>
    <ModalsBaseModal v-if="whichModalToOpen" class="footer-modal">
      <ModalsNewsletter
        v-if="whichModalToOpen === 'openNewslettersModal'"
        @close="whichModalToOpen = ''"
      />
    </ModalsBaseModal>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import FooterData from '~/data/footer-text.json'
import { useMenu } from '~/composables/useMenu'
import socialIcons from '~/data/social-icons.json'

export default {
  props: {
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    const store = useMenu()
    const whichModalToOpen = ref('')

    const menu = computed(() => store.menu.value)

    const activateAction = (action) => {
      if (whichModalToOpen.value === action) {
        whichModalToOpen.value = ''
      } else {
        whichModalToOpen.value = action
      }
    }

    return {
      menu,
      data: FooterData,
      socialIcons,
      whichModalToOpen,
      activateAction
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  padding-top: 40px;
  padding-bottom: 26px;
  max-width: 920px;
  width: 100%;
}
.footer-wrapper {
  background: #251f2d;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  transition: all 0.4s;

  @screen lg {
    margin-left: 76px;
    width: calc(100vw - 88px);
  }
}
.footer-wrapper-short {
  background: #251f2d;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: 0px;
  transition: all 0.4s;
  @screen md {
    width: calc(100vw - 266px);
    margin-left: 254px;
  }
}
.part-1 {
  gap: 15px;
  @apply flex flex-col items-start;
}

.part-1-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
}

.part-1-text,
.footer-title {
  color: rgba(255, 255, 255, 0.87);
}

.footer-title {
  font-size: 16px;
  font-weight: 700;

  @screen sm {
    font-size: 20px;
  }
}

.footer-subtitle {
  color: #e6e6e6;
  font-size: 14px;
  font-weight: 400;
  &:hover {
    opacity: 0.7;
  }
}
.big-footer {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.input {
  display: flex;
}

.col {
  @apply flex flex-col gap-[27px];
  @screen sm {
    @apply gap-[18px];
  }
}
.part-3 {
  margin: 2% 20% 0 0;
  @apply flex flex-col items-center;
}
.input > input {
  height: 50px;
  padding-left: 20px;
  background: rgba(255, 255, 255, 0.08);
  opacity: 0.2;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 5px;
}
.input > button {
  background: linear-gradient(269.95deg, #1ff0c6 -3.4%, #1fc0f0 27.86%);
  border-radius: 0px 5px 5px 0px;
  width: 50px;
  &:hover {
    opacity: 0.7;
  }
  @apply flex justify-center items-center;
}
.line {
  width: 100%;
  margin: 35px 0 15px 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}
.end {
  text-align: left;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.7;
  @screen sm {
    opacity: 1;
  }
}

:deep(.modal-container) {
  width: 580px;
  height: max-content;
  margin: 20px;
  background-color: #251f2d;
}
</style>
