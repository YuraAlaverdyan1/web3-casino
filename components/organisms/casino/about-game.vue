<template>
  <div class="container flex gap-10 p-6">
    <div class="w-1/2">
      <div class="about flex gap-6">
        <img :src="image">
        <div>
          <div class="title">
            {{ name }}
          </div>
          <div class="def flex gap-3">
            By: <span class="white-text">{{ provider }}</span>
          </div>
          <div class="def flex gap-3">
            Release: {{ release }}
          </div>
        </div>
      </div>
      <div class="details flex gap-1 mt-4">
        <div class="w-1/2">
          <div class="white-text detail">
            RTP (Return to Player) <span style="color: #54DB43;">{{ returnToPlayer }}</span>
          </div>
          <div class="white-text detail">
            Max Win <span style="color: #54DB43;">{{ maxWin }}</span>
          </div>
          <div class="white-text detail">
            Mobile <span>{{ mobile }}</span>
          </div>
        </div>
        <div class="w-1/2">
          <div class="white-text detail">
            Provider <span>{{ provider }}</span>
          </div>
          <div class="white-text detail">
            Type <span>{{ type }}</span>
          </div>
          <div class="detail" style="color: #3B3C4E;">
            Stakes Range <span>- -</span>
          </div>
        </div>
      </div>
    </div>
    <div class="part-2 w-1/2">
      <div class="title mb-2">
        Feauteres
      </div>
      <div v-for="(item, index) of feauteres" :key="index" class="def feautere">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
export default {
    props: {
        image: {
            type: String,
            required: true,
            default: ''
        },
        name: {
            type: String,
            required: true,
            default: ''
        },
        provider: {
            type: String,
            required: true,
            default: ''
        },
        release: {
            type: String,
            required: true,
            default: ''
        },
        returnToPlayer: {
            type: String,
            required: true,
            default: ''
        },
        maxWin: {
            type: String,
            required: true,
            default: ''
        },
        mobile: {
            type: String,
            required: true,
            default: ''
        },
        type: {
            type: String,
            required: true,
            default: ''
        },
        feauteres: {
            type: Array as PropType<Array<string>>,
            required: true,
            default: () => []
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #1C1B1F;
        border-radius: 12px;
    }
    .title {
        color: white;
        font-weight: 600;
        font-size: 20px;
    }
    .detail {
        background: linear-gradient(0deg, rgba(31, 192, 240, 0.02), rgba(31, 192, 240, 0.02)), #1C1B1F;
        @apply my-1 flex justify-between items-center h-14 px-4;
    }
    .def {
        color: #E6E6E6;
        font-size: 16px;
    }
    .feautere {
        line-height: 1.7;
    }
    .white-text {
        color: white;
        @apply flex justify-between items-center;
    }
</style>
