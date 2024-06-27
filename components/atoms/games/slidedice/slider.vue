<template>
  <div class="w-full flex flex-col gap-6">
    <div class="flex gap-1 items-center justify-between">
      <div class="box-slide-l flex items-center">
        <p class="text-center">
          <span class="text-4xl font-semibold">50</span>
          <br>
          Prediction
        </p>
      </div>
      <div>
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <rect width="150" height="150" fill="url(#pattern0)" />
          <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_1_11283" transform="scale(0.00666667)" />
            </pattern>
            <image
              id="image0_1_11283"
              width="150"
              height="150"
              xlink:href="data:image/png;base64,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"
            />
          </defs>
        </svg>
      </div>
      <div class="box-slide-r flex items-center">
        <p class="text-center">
          <span class="text-4xl font-semibold">50</span>
          <br>
          Prediction
        </p>
      </div>
    </div>
    <div class="range relative mt-8">
      <input
        id="range3"
        v-model="value"
        type="range"
        min="0"
        max="100"
        :data-before="value"
      >
      <span id="range3text" class="absolute top-2 w-[35px] flex justify-start" />
    </div>
    <div class="flex gap-1 w-full justify-around bg-[#201A29] py-6 rounded-xl mb-10">
      <div>
        <p class="text-center">
          <span class="text-xl font-semibold">x1.9804</span>
          <br>
          <span class="text-sm">Multiplier</span>
        </p>
      </div>
      <div>
        <StakingBtn
          :color="'#F60'"
          :fill="true"
          class="hover:bg-[#9E68FF] px-8 text-sm w-full h-10 mt-3 flex gap-2 justify-center items-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 13.5L12 17.5L16 13.5"
              stroke="#F5F5F7"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 6.5L12 11.5L17 6.5"
              stroke="#F5F5F7"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          Roll Under 50
        </StakingBtn>
      </div>
      <div>
        <p class="text-center">
          <span class="text-xl font-semibold">50%</span>
          <br>
          <span class="text-sm">Chance to win</span>
        </p>
      </div>
    </div>
  </div>
</template>

  <script lang="ts">
  import {
    ref,
    onMounted
  } from 'vue'

  export default {
    components: {
    },
    setup() {
      const value = ref(50)
      const helpContainer = ref(false)

      function load(v) {
        const sliderEl3 = document.querySelector('#range3')!
        const sliderEl3text = document.querySelector('#range3text')!

        const tempSliderValue = Number(v)

        const progress = (tempSliderValue / sliderEl3.max) * 100

        // sliderEl3text.textContent = progress
        sliderEl3text.style.left = `calc(${progress}% - 0px)`

        sliderEl3.style.background = `linear-gradient(to right, #60F ${progress}%, #F60 ${progress}%)`
      }

      onMounted(() => {
        const sliderEl3 = document.querySelector('#range3')
        const sliderEl3text = document.querySelector('#range3text')

        load(50)

        if (sliderEl3 && sliderEl3text) {
          sliderEl3.addEventListener('input', (event) => {
            const tempSliderValue = Number(event.target.value)
            const progress = (tempSliderValue / sliderEl3.max) * 100
            // sliderEl3text.textContent = progress
            sliderEl3text.style.left = `calc(${progress}% - 0px)`
            sliderEl3.style.background = `linear-gradient(to right, #60F ${progress}%, #F60 ${progress}%)`
          })
        }
      })

      return {
        value,
        helpContainer
      }
    }
  }
  </script>

  <style lang="scss" scoped>
  .box-slide-l {
    border-radius: 12px;
    background: linear-gradient(270deg, rgba(37, 31, 45, 0.00) 0%, #251F2D 100%);
    height: 148px;
    padding: 24px 64px 24px 24px
  }

  .box-slide-r {
    border-radius: 12px;
    background: linear-gradient(270deg, #251F2D 0%, rgba(37, 31, 45, 0.00) 100%);
    height: 148px;
    padding: 24px 64px 24px 24px
  }

  .custom-dot {
    width: 100%;
    height: 100%;
    border-radius: 0;
    background-color: pink;
    transition: all .3s;
  }

  .custom-dot:hover {
    transform: rotateZ(45deg);
  }

  .custom-dot.focus {
    border-radius: 50%;
  }

  /* range 2 */
  .range-input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    cursor: pointer;
    outline: none;
    border-radius: 15px;
    height: 8px;
    background: #ccc;
  }

  .range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 35px;
    width: 35px;
    background-color: #f50;
    border-radius: 50%;
    border: none;
    transition: .2s ease-in-out;
  }

  .range-input::-moz-range-thumb {
    height: 35px;
    width: 35px;
    background-color: #f50;
    border-radius: 50%;
    border: none;
    transition: .2s ease-in-out;
  }

  .range-input::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 10px rgba(28, 27, 31, .1)
  }

  .range-input:active::-webkit-slider-thumb {
    box-shadow: 0 0 0 13px rgba(28, 27, 31, .2)
  }

  .range-input:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 13px rgba(28, 27, 31, .2)
  }

  .range-input::-moz-range-thumb:hover {
    box-shadow: 0 0 0 10px rgba(28, 27, 31, .1)
  }

  .range-input:active::-moz-range-thumb {
    box-shadow: 0 0 0 13px rgba(28, 27, 31, .2)
  }

  .range-input:focus::-moz-range-thumb {
    box-shadow: 0 0 0 13px rgba(28, 27, 31, .2)
  }

  .value2,
  .value3,
  .value4 {
    font-size: 26px;
    width: 50px;
    text-align: center;
  }

  /* range 3 */
  #range3 {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    cursor: pointer;
    outline: none;
    border-radius: 15px;
    height: 20px;
    height: 6px;
    background: #ccc;
  }

  #range3::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 35px;
    width: 35px;
    background: #201A29;
    background-image: url('/tokens/rdt.png');
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 50%;
    transition: .2s ease-in-out;
    border-radius: 8px;
    border: 6px solid rgba(28, 27, 31, 0.40);
  }

  /* Thumb: Firefox */
  #range3::-moz-range-thumb {
    height: 30px;
    width: 30px;
    background-image: url('/tokens/rdt.png');
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    border: none;
    border-radius: 50%;
    border: 6px solid rgba(28, 27, 31, 0.40);
    background: #201A29;
  }

  #range3::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 10px rgba(28, 27, 31, .1)
  }

  #range3:active::-webkit-slider-thumb {
    box-shadow: 0 0 0 13px rgba(28, 27, 31, .2)
  }

  #range3:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 13px rgba(28, 27, 31, .2)
  }

  #range3::-moz-range-thumb:hover {
    box-shadow: 0 0 0 10px rgba(28, 27, 31, .1)
  }

  #range3:active::-moz-range-thumb {
    box-shadow: 0 0 0 13px rgba(28, 27, 31, .2)
  }

  #range3:focus::-moz-range-thumb {
    box-shadow: 0 0 0 13px rgba(28, 27, 31, .2)
  }

  /* range 3 */
  .range-slider {
    flex: 1;
  }

  .sliderticks {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
  }

  .sliderticks span {
    display: flex;
    justify-content: center;
    width: 1px;
    height: 10px;
    background: #d3d3d3;
    line-height: 40px;
  }

  /*=============
  Aesthetics
  =========================*/

  .range {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  </style>
