<template>
  <div class="backdrop-blur-lg message">
    <div v-click-outside="onClose" class="message_container">
      <img src="/images/profile/messages/warning.png" alt="message_image">
      <h3>Warning</h3>
      <p>{{ showMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  onClose: {
    type: Function,
    required: true
  },
  showMessage: {
    type: String,
    required: false,
    default: 'Please connect your wallet first'
  }
})
</script>

<style lang="scss" scoped>
.message {
  position: fixed;
  z-index: 10000;
  height: 100vh;
  width: 100%;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &_container {
    width: 375px;
    background: #251f2d;
    padding: 24px 16px 32px 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 64px;
      height: 64px;
    }

    h3 {
      font-size: 24px;
      font-weight: 700;
    }

    p {
      font-size: 18px;
    }
  }
}
</style>
