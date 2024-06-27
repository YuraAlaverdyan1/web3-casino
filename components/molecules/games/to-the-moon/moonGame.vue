<template>
  <div v-if="isPlaying" class="toTheMoon">
    <div class="toTheMoon_head">
      <div class="toTheMoon_head_left">
        <p :class="{ activeTimeText: isPlaying }">
          02:57:09
        </p>
      </div>
      <div class="toTheMoon_head_center">
        <h4 :class="{ activeJeckpotText: isPlaying }">
          340.000
        </h4>
        <h5>JACKPOT</h5>
      </div>
      <GamesToTheMoonFuelMeter />
    </div>
    <video autoplay loop muted>
      <source src="/games/to-the-moon/to-the-moon-video.mp4" type="video/mp4">
    </video>
  </div>
  <div v-else class="toTheMoon_stoped">
    <div class="toTheMoon_stoped_head">
      <marquee>
        <div class="toTheMoon_stoped_head_container">
          <span>Mission Status:</span>
          <p class="status">
            Success
          </p>
          <span>Commander:</span>
          <p class="commander">
            0xbe....fas21
          </p>
          <span>Jackpot:</span>
          <p class="jackpot">
            $50.000.00
          </p>
          <span>Next Launch:</span>
          <p class="launch">
            02:52:39
          </p>
        </div>
      </marquee>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMiniGames } from '~/composables/useMiniGames'
const { isPlaying } = useMiniGames()
</script>
<style lang="scss" scoped>
.toTheMoon {
  border-radius: 12px;
  overflow: hidden;
  @screen xs {
    height: 300px;
  }
  @screen sm {
    height: 500px;
  }

  position: relative;
  video {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
  &_head {
    position: absolute;
    width: 100%;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_left {
      border-radius: 6px;
      border: 2px solid #f5f5f7;
      padding: 6px;
      p {
        font-size: 16px;
        background: #60f;
        border-radius: 4px;
        padding: 2px;
        font-variant-numeric: lining-nums proportional-nums;
        font-family: Glitch;
        font-size: 16px;
      }
    }
    &_center {
      font-variant-numeric: lining-nums proportional-nums;
      font-family: Glitch;
      color: #f5f5f7;
      display: flex;
      flex-direction: column;
      align-items: center;
      h4 {
        @screen xs {
          font-size: 24px;
        }
        @screen sm {
          font-size: 36px;
        }
      }
      h5 {
        font-size: 16px;
      }
    }
    .activeJeckpotText {
      animation: 1s activeJeckpotTextAnimation;
    }
    .activeTimeText {
      animation: 1s activeTimeTextAnimation;
    }

    @keyframes activeJeckpotTextAnimation {
      0% {
        text-shadow: none;
      }
      50% {
        text-shadow: 0px 0px 1.075px #f60, 0px 0px 2.15px #f60, 0px 0px 7.526px #f60,
          0px 0px 15.053px #f60, 0px 0px 25.805px #f60, 0px 0px 45.159px #f60;
      }
      100% {
        text-shadow: none;
      }
    }
    @keyframes activeTimeTextAnimation {
      0% {
        text-shadow: none;
      }
      50% {
        text-shadow: 0px 0px 4.972px #f60, 0px 0px 9.944px #f60, 0px 0px 34.804px #f60,
          0px 0px 69.608px #f60, 0px 0px 119.328px #f60, 0px 0px 208.824px #f60;
      }
      100% {
        text-shadow: none;
      }
    }
  }
}
.toTheMoon_stoped {
  border-radius: 12px;
  overflow: hidden;
  @screen xs {
    height: 300px;
  }
  @screen sm {
    height: 500px;
  }
  position: relative;
  background-image: url("/games/to-the-moon/to-the-moon-image.png");
  background-size: 100% 100%;
  &_head {
    height: 85px;
    display: flex;
    align-items: center;
    backdrop-filter: blur(10px);
    background: rgba(23, 17, 32, 0.05);
    &_container {
      display: flex;
      gap: 10px;
      p {
        font-weight: 700;
      }
      .status {
        color: #b9ff6e;
      }
      .commander {
        color: #9e68ff;
      }
      .jackpot {
        color: #f60;
      }
      .launch {
        color: #ffdc7e;
      }
    }
  }
}
</style>
