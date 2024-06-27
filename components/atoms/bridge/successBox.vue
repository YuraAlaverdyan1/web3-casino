<template>
  <div class="box">
    <div class="box_header">
      <p>{{ info.time }}</p>
      <div class="box_header_status">
        <img
          v-if="info.status.toLowerCase() === 'successful'"
          src="/bridge/tick.svg"
          alt="tick"
        >
        <p>{{ info.status }}</p>
      </div>
    </div>
    <div class="box_container">
      <div class="box_container_token">
        <img :src="info.from.icon" alt="token">
        <div class="box_container_token_container">
          <p class="box_container_token_container_value_from">
            {{ info.from.value }}
          </p>
          <p class="box_container_token_container_name">
            {{ info.from.name }}
          </p>
        </div>
      </div>
      <img src="/bridge/arrow.svg" alt="arrow">
      <div class="box_container_token">
        <img :src="info.to.icon" alt="token">
        <div class="box_container_token_container">
          <p class="box_container_token_container_value_to">
            {{ info.to.value }}
          </p>
          <p class="box_container_token_container_name">
            {{ info.to.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  info: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.box {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  border: 1px solid #424245;
  box-sizing: border-box;
  margin: 8px 24px 24px 24px;
  @screen xs {
    font-size: 12px;
    min-width: 230px;
  }
  @screen ss {
    font-size: 16px;
    min-width: 300px;
  }
  &_header {
    background-color: #38333f;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px 12px 0px 0px;
    gap: 10px;
    @screen xs {
      padding: 10px;
    }
    @screen ss {
      padding: 16px;
    }

    &_status {
      display: flex;
      color: #9e68ff;

      img {
        width: 24px;
      }
    }
  }

  &_container {
    display: flex;
    justify-content: space-between;
    padding: 24px 16px;

    & > img {
      @screen xs {
        width: 20px;
      }
      @screen ss {
        width: 24px;
      }
    }

    &_token {
      display: flex;
      gap: 6px;
      align-items: center;
      img {
        @screen xs {
          height: 30px;
        }
        @screen ss {
          height: 40px;
        }
        object-fit: cover;
      }

      &_container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 55px;

        &_value {
          &_from {
            font-weight: 700;
            color: #ffdc7e;
          }
          &_to {
            font-weight: 700;
            color: #b9ff6e;
          }
        }
      }
    }
  }
}
</style>
