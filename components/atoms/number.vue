<template>
  <button v-if="!chooseNumber" class="number rounded-xl" :class="[activeSelected ? 'active-selected-btn' : '', ticket ? 'ticket-button' : '']">
    <slot />
  </button>
  <div v-else class="active-choose-number flex items-center justify-center font-medium" :class="[chooseNumber ? 'choose-number' : '', ticket ? 'ticket-btn' : '']">
    <button class="w-full h-full btn flex items-center gap-2 justify-center">
      <slot />
    </button>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        activeSelected: {
            type: Boolean,
            requried: false,
            default: false
        },
        chooseNumber: {
            type: Boolean,
            required: false,
            default: false
        },
        activeChooseNumber: {
            type: Boolean,
            required: false,
            default: false
        },
        ticket: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
    .number {
        width: 80px;
        height: 40px;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #1C1B1F;
        color: #1FC0F0;
        border-radius: 12px;
        font-weight: 600;
    }
    .active-selected-btn {
        background: #4F5069;
    }
    .choose-number {
        width: 100%;
        background: linear-gradient(83.96deg, #79D9F6 -15.55%, #62D3F5 7.79%, #4CCDF3 24.27%, #1FC0F0 42.92%, #199AC0 99.04%) !important;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        border: 1px solid;
        border-image: linear-gradient(83.96deg, #79D9F6 -15.55%, #62D3F5 7.79%, #4CCDF3 24.27%, #1FC0F0 42.92%, #199AC0 99.04%);
        border-image-slice: 1;
        &:hover {
          -webkit-text-fill-color: unset !important;
          color: white;
        }
    }
    .active-choose-number {
        position: relative;
        -webkit-text-fill-color: unset !important;
        color: white;
        background: linear-gradient(0deg, rgba(31, 192, 240, 0.02), rgba(31, 192, 240, 0.02)), #1C1B1F;
        border: 1px solid transparent;
        border-radius: 8px;
        background-clip: padding-box;
    }
    .ticket-button {
        background: linear-gradient(83.96deg, #79D9F6 -15.55%, #62D3F5 7.79%, #4CCDF3 24.27%, #1FC0F0 42.92%, #199AC0 99.04%) !important;
        color: white;
    }
    .active-choose-number::after{
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        margin: -1px;
        border-radius: inherit;
        background: linear-gradient(83.96deg, #79D9F6 -15.55%, #62D3F5 7.79%, #4CCDF3 24.27%, #1FC0F0 42.92%, #199AC0 99.04%);
    }
    .redNumber {
        background: linear-gradient(83.71deg, #F56280 -15.41%, #F56280 3.43%, #F34C6D 31.27%, #F01F49 71.52%, #C0193A 108.42%) !important;
    }
    .ticket-button, .btn {
        width: 90px;
        border-radius: 8px !important;
    }
    .btn {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #1C1B1F !important;
    }
    .ticket-btn {
        height: 40px;
        width: 100%;
        z-index: 10;
        background: linear-gradient(0deg, rgba(31, 192, 240, 0.05), rgba(31, 192, 240, 0.05)), #1C1B1F !important;
        &:after {
            background: none;
        }
        &:hover {
            opacity: 0.5;
        }
    }
</style>
