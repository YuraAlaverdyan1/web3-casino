<template>
  <div class="faq_modal">
    <NuxtLink class="faq_modal_button" to="migration/faq">
      FAQ
      <img src="/migration/questionIcon.svg" alt="icon">
    </NuxtLink>
    <div class="faq_modal_container">
      <h5>{{ text.top }}</h5>
      <h3>{{ text.middle }}</h3>
      <p>{{ text.bottom }}</p>
    </div>
    <div v-if="progress && !isSmall" class="faq_modal_progress">
      <div class="faq_modal_progress_line">
        <div
          v-for="(item, index) in progress"
          :key="index"
          class="faq_modal_progress_line_container"
          :class="{ active: index === 0 }"
        >
          <div class="faq_modal_progress_line_container_index">
            <p>{{ index + 1 }}</p>
          </div>
          <p class="faq_modal_progress_line_container_text">
            {{ item.status }}
          </p>
          <div v-if="index !== progress.length - 1" class="line" />
        </div>
      </div>
      <div class="faq_modal_progress_subline">
        <div v-for="(item, index) in progress" :key="index">
          <p>{{ item.sub }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="progress && isSmall" class="faq_modal_progress_mobile">
      <div class="faq_modal_progress_mobile_line">
        <div
          v-for="(item, index) in progress"
          :key="index"
          class="faq_modal_progress_mobile_line_container"
          :class="{ active: index === 0 }"
        >
          <div class="faq_modal_progress_mobile_line_container_index">
            <p>{{ index + 1 }}</p>
          </div>
          <div v-if="index !== progress.length - 1" class="line" />
        </div>
      </div>
      <div class="faq_modal_progress_mobile_info">
        <div v-for="(item, index) in progress" :key="index">
          <span>{{ item.status }}</span>
          <p>{{ item.sub }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { BreakPoint } from '~/model/break-points'
defineProps({
  text: {
    type: String,
    requred: true,
    default: ''
  },
  progress: {
    type: Object,
    required: true
  }
})
const breakpoints = useBreakpoints(BreakPoint)
const isSmall = computed(() => breakpoints.smaller('sm').value)
</script>

<style lang="scss" scoped>
.faq_modal {
  border-radius: 12px;
  border: 1px solid #424245;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  color: #f5f5f7;

  &_button {
    background-color: #60f !important;
    display: flex;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;

    @screen xs {
      width: 100%;
    }

    @screen sm {
      width: 120px;
    }

    &:hover:not(:disabled) {
      background-color: #60f !important;
      box-shadow: 0px 0px 14px 0px #60f;
    }
    &:active:not(:disabled) {
      color: #ffdc7e;
    }
    &:disabled {
      background-color: #424245 !important;
      color: #6f6c75;
    }
  }

  &_container {
    display: flex;
    flex-direction: column;
    h3 {
      font-size: 24px;
      font-weight: 700;
      color: #f5f5f7;
    }
    h5,
    p {
      font-size: 16px;
      color: #e6e6e6;
    }
  }

  &_progress {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-right: 10%;
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 3px;
    }

    &_line {
      &_container {
        display: flex;
        gap: 8px;
        align-items: center;
        flex: 1;

        @screen xs {
          flex-direction: column;
        }
        @screen sm {
          flex-direction: row;
        }

        &_index {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          min-width: 35px;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid #e6e6e6;
          font-size: 14px;
        }

        &_text {
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }

        .line {
          width: 100%;
          height: 1px;
          background-color: #e6e6e6;
        }
      }
    }

    &_subline {
      display: flex;
      justify-content: flex-start;
      & > div {
        width: 100%;
        padding-left: 43px;
      }
    }

    &_mobile {
      display: flex;
      height: 100%;
      gap: 10px;
      &_line {
        display: flex;
        flex-direction: column;
        height: 100%;
        .active {
          .faq_modal_progress_mobile_line_container_index {
            background-color: #9e68ff;
            border: none;
          }

          .line {
            background-color: #9e68ff;
          }
        }

        &_container {
          display: flex;
          flex-direction: column;
          align-items: center;
          .line {
            width: 1px;
            height: 40px;
            background-color: #e6e6e6;
          }

          &_index {
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            min-width: 30px;
            min-height: 30px;
            font-size: 12px;
            font-weight: 700;
            border: 1px solid #e6e6e6;
            font-size: 14px;
          }
        }
      }

      &_info{
        display: flex;
        flex-direction: column;
        padding-top: 4px;
        gap: 20px;
        &>div{
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          span{
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
