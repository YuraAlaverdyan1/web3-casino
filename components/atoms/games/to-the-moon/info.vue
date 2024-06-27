<template>
  <div class="info">
    <div v-for="(item, index) in infoData" :key="index" class="info_container">
      <img :src="item.icon" alt="icon">
      <p>{{ item.title }}</p>
      <div>
        <p>{{ item.value.text }}</p>
        <img v-if="item.value.icon" :src="item.value.icon" alt="usdt">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import infoData from '~/data/games/to-the-moon/infoMock.json'
</script>

<style lang="scss" scoped>
.info{
    display: flex;
    flex-direction: column;
    gap: 8px;
    color:#F5F5F7;
    width: 100%;
    border-radius: 12px;
    background: #201A29;
    backdrop-filter: blur(20px);
    padding: 8px 12px;
    &_container{
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        &>img{
            width: 20px;
            height: 20px;
        }
        &>div{
            display: flex;
            align-items: center;
            font-weight: 700;
            gap: 4px;
            width: 100%;
            &:last-child{
                justify-content: flex-end;
            }
        }
    }
}
</style>
