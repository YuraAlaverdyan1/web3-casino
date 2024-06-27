<template>
  <div class="migrationItem">
    <h1>{{ changeUnderlineToUppercase(Object.keys(item)[0]) }}</h1>
    <div
      v-for="(elm, index) in Object.values(item)[0]"
      :key="index"
      class="migrationItem_container"
    >
      <div class="migrationItem_container_pool">
        <div class="migrationItem_container_pool_images">
          <img
            v-for="(image, ind) in elm.coins"
            :key="ind"
            :src="image"
            alt="coins"
            :class="{not_first: ind > 0}"
          >
        </div>
        <div>
          <h4>{{ elm.pool }}</h4>
          <p>
            Pool

            <span>i</span>
          </p>
        </div>
      </div>
      <div class="migrationItem_container_token">
        <div>
          <img :src="elm.token.image" alt="token">
          <h4>{{ elm.token.value }} {{ elm.token.currency }}</h4>
        </div>
        <p>Token</p>
      </div>
      <div v-if="elm.reward" class="migrationItem_container_reward">
        <div class="migrationItem_container_reward_container">
          <p>{{ elm.reward.count }} NFT</p>
          <div>
            <div :style="`width:${elm.reward.percent}%`" />
          </div>
          <p>{{ elm.reward.percent }}%</p>
        </div>
        <p>Reward</p>
      </div>
      <div class="migrationItem_container_state">
        <h4 :style="`color:${setTextColor(elm.state)}`">
          {{ elm.state }}
        </h4>
        <p>State</p>
      </div>
      <div
        class="migrationItem_container_buttons"
        :class="{ multi: elm.buttons.length !== 1 }"
      >
        <button
          v-for="(button, i) in elm.buttons"
          :key="i"
          :disabled="button.disabled"
          :class="button.fill ? 'fill' : 'default'"
        >
          {{ button.text }}
          <img v-if="button.icon" :src="button.icon" alt="icon">
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { changeUnderlineToUppercase } from '~/utils/web3/formators'

defineProps({
  item: {
    type: Object,
    required: true
  }
})
const setTextColor = (text): string => {
  if (text.toLowerCase() === 'to migrate') {
    return '#FF4757'
  } else if (text.toLowerCase() === 'in progress') {
    return '#F60'
  }
  return '#B9FF6E'
}
</script>

<style lang="scss" scoped>
.migrationItem {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;

  h1 {
    font-size: 20px;
    font-weight: 700;
  }

  &_container {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    border-radius: 16px;
    background: #201a29;
    padding: 24px;
    flex-direction: row;
    overflow: auto;
    @screen xs {
      flex-direction: column;
      align-items: flex-start;
    }

    @screen sm {
      flex-direction: row;
      align-items: center;
    }

    &_pool {
      display: flex;
      gap: 4px;
      flex: 1;

      &_images{
        display: flex;
        align-items: center;
        width: 75px;
        min-width: 75px;
        position: relative;
        .not_first{
          position: absolute;
          left: 25px;
        }
      }
      &>div:last-child{
        display: flex;
        flex-direction: column;

        h4 {
          font-size: 18px;
          font-weight: 600;
        }
        p {
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          &>div{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #F5F5F7;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            cursor: pointer;
          }
        }
      }
    }

    &_token {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;

      div {
        display: flex;
        font-size: 18px;
        font-weight: 700;
        gap: 4px;
        white-space: nowrap;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
        }
      }
      p {
        font-size: 14px;
      }
    }

    &_state {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;

      h4 {
        font-size: 18px;
        font-weight: 600;
      }
      p {
        font-size: 14px;
      }
    }

    &_reward {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;

      &_container {
        display: flex;
        align-items: center;
        gap: 5px;
        width: 100%;
        p {
          color: #e6e6e6;
          font-size: 12px;
          white-space: nowrap;
          &:first-child {
            font-size: 18px;
            font-weight: 700;
          }
        }
        & > div {
          border-radius: 4px;
          background-color: #413c48;
          height: 8px;
          overflow: hidden;
          @screen xs{
            width: 100%;
          }
          @screen sm{
            width: 60px;
          }
          & > div {
            background-color: #b9ff6e;
            height: 100%;
          }
        }
      }
    }

    &_buttons {
      display: flex;
      align-items: center;
      width: 100%;
      @screen xs {
        flex-direction: column;
        max-width:100%;
      }

      @screen sm {
        min-width: 250px;
        max-width: 20%;
        flex-direction: row;
      }
      button {
        width: 100%;
        flex: 1;
        gap: 8px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        font-size: 14px;
        font-weight: 700;
      }

      .fill {
        background-color: #60f !important;
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

      .default {
        &:hover:not(:disabled) {
          background-color: white;
          color: black;
        }
        &:active:not(:disabled) {
          color: #60f;
        }
        &:disabled {
          color: #6f6c75;
          background-color: transparent !important;
        }
      }
    }

    .multi {
      border: 1px solid #424245;
      padding: 8px;
      border-radius: 12px;
      button {
        border-radius: 4px !important;
      }
    }
  }
}
</style>
