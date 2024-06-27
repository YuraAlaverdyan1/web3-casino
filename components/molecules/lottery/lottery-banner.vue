<template>
  <div class="banner-container relative w-full px-[5px] lg:px-[0px] select-none">
    <img :src="image" class="w-full min-h-[191px]">
    <div class="details flex flex-col justify-around align-start">
      <em v-if="isTitleItalic" class="lg:text-5xl text-3xl title">{{ title }}</em>
      <div v-else class="text-[16px] lg:text-[48px] font-[700]">
        {{ title }}
      </div>
      <div class="text-[24px] lg:text-[96px] font-[700]">
        {{ subtitle }}
      </div>
      <button
        class="btn w-full sm:w-fit flex justify-center gap-[16px] px-[48px] py-[16px] sm:py-[16px] items-center font-semibold max-h-[80px] lg:max-h-[80px]"
        :style="`background: ${buttonColor}; border: 1px solid ${buttonColor};  color: ${btnTextColor} !important`"
        :class="btnImage && ''"
      >
        <p :class="textStyle || 'text-[28px] font-[700]'">
          {{ buttonText }}
        </p>
        <img v-if="btnImage" :src="btnImage">
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        image: {
            type: String,
            required: true,
            default: ''
        },
        title: {
            type: String,
            required: true,
            default: ''
        },
        subtitle: {
            type: String,
            required: true,
            default: ''
        },
        buttonText: {
            type: String,
            required: true,
            default: ''
        },
        isTitleItalic: {
            type: Boolean,
            required: false,
            default: false
        },
        buttonColor: {
            type: String,
            required: true,
            default: 'blue'
        },
        btnTextColor: {
            type: String,
            required: true,
            default: 'black'
        },
        btnImage: {
            type: String,
            required: false,
            default: ''
        },
        textStyle: {
            type: String,
            required: false,
            default: ''
        }

    }
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
    transform: scale(1);
    transition: all .3s;

    &:hover {
        transform: scale(1.05);
    }
}

.banner-container {
    width: 100%;
    color: white;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 12px;
    overflow: hidden;

    &:hover {
        img {
            transform: scale(1.05);
        }
    }
}

.banner-container>img {
    transition: 0.4s;
}

.details {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    bottom: 0;
    margin: auto;
    height: 65%;

    @screen ss {
        width: 80%;
        left: 10%;
    }
}

.title,
.subtitle {
    text-shadow: 20px 25px 50px #000000;
}
</style>
