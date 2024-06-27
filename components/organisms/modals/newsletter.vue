<template>
  <div class="newsletter transition-all">
    <div class="newsletter_top">
      <div class="newsletter_top_header">
        <h2>Newsletter</h2>
        <img src="/images/profile/user-info/close.png" @click="$emit('close')">
      </div>
      <h3
        :class="[classByStatus,!showSuccessMessage?'block':'!hidden']"
        class="newsletter_top_subtitle"
      >
        Subscribe to receive our newsletters and the latest major updates.
      </h3>
      <h3
        :class="[classByStatus,!showSuccessMessage?'hidden mb-[0px]':'block mb-[40px]']"
        class="newsletter_top_subtitle transition-all"
      >
        Thank you for subscribing!
      </h3>
    </div>
    <div class="newsletter_input mt-[40px]" :class="[classByStatus,!showSuccessMessage?'block':'!hidden']">
      <label v-if="!isValidEmail && email" for="email"> Email is invalid </label>
      <label v-else for="email"> {{ getLabelText() }}</label>
      <div class="newsletter_input_container">
        <CustomInput
          id="email"
          placeholder="enter your email address"
          :text="email"
          @input-text="(e:string) => email = e"
        />
        <img src="/images/profile/user-info/close.png" @click="email = ''">
      </div>
    </div>
    <vue-recaptcha
      size="normal"
      theme="light"
      :sitekey="recaptchaSiteKey"
      :load-recaptcha-script="true"
      class="transition-all overflow-hidden duration-500"
      :class="[showRecaptcha?'h-[78px] my-[40px]':'h-[0px] my-[20px]',!showSuccessMessage?'block':'hidden']"

      @verify="handleSuccess"
    />

    <StakingBtn
      fill="true"
      color="#6600FF"
      class="newsletter_button"
      :input-text="email"
      @click="!showSuccessMessage? signUp() :$emit('close')"
    >
      <div class="flex items-center justify-center gap-[10px] relative">
        <p :class="!showSuccessMessage?'block':'hidden'">
          Sign Up
        </p>
        <p :class="showSuccessMessage?'block':'hidden'">
          Close
        </p>
        <span v-if="isLoading" class="loader absolute right-[38%] " />
      </div>
    </StakingBtn>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import vueRecaptcha from 'vue3-recaptcha2'
import axios from 'axios'

// eslint-disable-next-line no-undef
const { public: { recaptchaSiteKey } } = useRuntimeConfig()

const status = ref<string>('')
const email = ref<string>('')
const token = ref<string>('')
const recaptchaPassed = ref<boolean>(false)
const showRecaptcha = ref<boolean>(false)
const showSuccessMessage = ref<boolean>(false)
const isValidEmail = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const classByStatus = computed<string>(() => {
  if (status.value === 'Invalid email address') {
    return 'invalid'
  } else if (status.value === 'Contact already exist') {
    return 'exist'
  }
  return ''
})
const getLabelText = (): string => {
  if (status.value === 'Contact already exist') {
    return 'Already Subscribed'
  }
  return 'Email Address'
}

const handleSuccess = (successToken) => {
  token.value = successToken
  recaptchaPassed.value = true
}

const signUp = async (): Promise<void> => {
  const validEmailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (validEmailRegexp.test(email.value) || !email.value) {
      status.value = ''
      isValidEmail.value = true
      if (email.value) {
        showRecaptcha.value = true
      }
    } else {
      isValidEmail.value = false
      status.value = 'Invalid email address'
      showRecaptcha.value = false
    }
  if (!isValidEmail.value || !recaptchaPassed.value) {
    return
  }
  try {
    isLoading.value = true
        await axios.post(
          'https://jwkiruch6b.execute-api.eu-west-1.amazonaws.com/staging/addEmail',
          { email: email.value, token: token.value }
        ).then(() => {
        status.value = ''
        showSuccessMessage.value = true
        showRecaptcha.value = false
        isLoading.value = false
      })
  } catch (err: any) {
    status.value = err.response.data.message
    showSuccessMessage.value = false
  }
}

watch(
  () => email.value,
  () => {
    const validEmailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (validEmailRegexp.test(email.value) || !email.value) {
      status.value = ''
      isValidEmail.value = true
      if (email.value) {
        showRecaptcha.value = true
      }
    } else {
      showRecaptcha.value = false
    }
}
)

</script>

<style lang="scss" scoped>
.newsletter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  width: 100%;

  &_top {
    display: flex;
    flex-direction: column;
    gap: 16px;
    &_header {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 700;
      color: #f5f5f7;
      img {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
  }
  &_subtitle {
    font-size: 14px;
    color: #e6e6e6;
  }
  &_input {
    color: #e6e6e6;
    p {
      font-size: 12px;
      padding-left: 16px;
    }
    &_container {
      position: relative;
      input {
        border: 1px solid #424245;
        font-size: 14px;
      }
      img {
        position: absolute;
        right: 16px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
    label {
      font-size: 12px;
      padding-left: 16px;
    }
  }
  &_button {
    padding: 16px;
    font-size: 16px;
    font-weight: 700;
  }
  .invalid {
    label {
      color: #ff4757;
    }
    input {
      border: 1px solid #ff4757;
    }
  }
  .exist {
    label {
      color: #b9ff6e;
    }
    input {
      border: 1px solid #b9ff6e;
    }
  }
}
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #FFF;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
