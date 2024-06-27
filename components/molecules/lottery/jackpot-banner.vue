<template>
  <div class="content-draw">
    <div>
      <div class="font-semibold text-white mb-2">
        Next Draw in:
      </div>
      <NextDrawBanner :hours="hours" :minutes="minutes" :seconds="seconds" />
      <div class="lottery-jackpot uppercase">
        {{ lotteryName }}
      </div>
      <div class="jackpot-title text-[#B9FF6E] font-semibold pb-2">
        {{ jackpot }} {{ token }}
      </div>
      <button style="min-height: 70px" class=" btn mb-2 px-10 text-center text-2xl" :style="true ? `background: #6600FF` : `border: 1px solid #6600FF;`" @click="$emit('buyTicket')">
        Buy Tickets
      </button>
    </div>
  </div>
</template>

  <script lang="ts">
  export default {
      props: {
          minutes: {
              type: Number,
              required: false,
              default: 0
          },
          seconds: {
              type: Number,
              required: false,
              default: 0
          },
          hours: {
              type: Number,
              required: false,
              default: 0
          },
          lotteryName: {
              type: String,
              required: false,
              default: ''
          },
          jackpot: {
              type: String,
              required: false,
              default: ''
          },
          token: {
              type: String,
              required: false,
              default: ''
          }
      },
      emits: ['openModal', 'buyTicket']
  }
  </script>

  <style lang="scss" scoped>
  .btn {
      border-radius: 12px;
      padding: 5px;
      color: white;
      font-size: 20px;
      font-weight: 500;
      transition: 0.4s;
      &:hover{
          background-color: #b484fa !important;
          box-shadow: -1px 1px 10px 3px #b484fa;
      }
  }

  .content-draw {
      z-index: 100;
      position: absolute;
      padding: 1rem;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      height: 100%;

      @screen sm {
          height: auto;
          width: fit-content;
      }

      background: #17112099;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
  }

  .svg-container {
      width: 100%;
      height: 32%;
  }

  .jackpot-banner {
      background: rgba(0, 0, 0, 0.6);
      padding: 15px;

      @screen sm {
          width: 50%;
          height: 55%;
          border-radius: none;
      }

      width:100%;
      height: 100%;
      border-radius: 15px;
      justify-content: center;
  }

  .lottery-jackpot {
      color: white;
      font-size: 3rem;
      font-weight: 600;
  }
  .jackpot-title {
      font-size: 5rem;
  }
  @media (max-width: 1100px) {
      .jackpot-title {
          font-size: 3rem;
      }

      .lottery-jackpot {
          font-size: 2rem;

      }

  }
  @media (max-width: 768px) {
      .jackpot-title {
          font-size: 2rem;
      }

      .lottery-jackpot {
          font-size: 2rem;

      }

  }

  @media (max-width: 500px) {
      .jackpot-title {
          font-size: 1.2rem;
      }

      .lottery-jackpot {
          font-size: 1.2rem;

      }

  }
  </style>
