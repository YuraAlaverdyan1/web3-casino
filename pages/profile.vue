<template>
  <div class="relative w-full">
    <div
      class="fixed top-0 left-0 flex justify-center items-center w-full h-full transition-all px-[24px] md:px-[0px]"
      :class="isSocialModal
        ? 'z-[100] scale-100 opacity-100'
        : '-z-[100] scale-0 opacity-0'
      "
    >
      <div class="w-full h-full absolute left-0 top-0" @click="isSocialModal = false" />
      <div
        class="bg-[#251F2D] border-[1px] border-[#0A0A0A] rounded-[12px] p-[24px] w-full max-w-[368px] relative z-[10]"
      >
        <p class="uppercase text-[18px] text-[400]">
          Share link to this page
        </p>
        <div class="flex items-center justify-between mt-[24px]">
          <div class="border-[1px] border-[#9E68FF] rounded-[12px] w-[56px] h-[56px] flex justify-center items-center">
            <img src="/images/profile/user-info/twitter-pink.svg">
          </div>
          <div class="border-[1px] border-[#9E68FF] rounded-[12px] w-[56px] h-[56px] flex justify-center items-center">
            <img src="/images/profile/user-info/facebook-pink.svg">
          </div>
          <div class="border-[1px] border-[#9E68FF] rounded-[12px] w-[56px] h-[56px] flex justify-center items-center">
            <img src="/images/profile/user-info/telegram-pink.svg">
          </div>
          <div class="border-[1px] border-[#9E68FF] rounded-[12px] w-[56px] h-[56px] flex justify-center items-center">
            <img src="/images/lottery/buy-tickets-modal/discord-pink.svg">
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed top-0 left-0 flex justify-center items-center w-full h-full transition-all px-[24px] md:px-[0px]"
      :class="isInviteFriendsModal
        ? 'z-[100] scale-100 opacity-100'
        : '-z-[100] scale-0 opacity-0'
      "
    >
      <div class="w-full h-full absolute left-0 top-0" @click="isInviteFriendsModal = false" />
      <div
        class="bg-[#251F2D] border-[1px] border-[#0A0A0A] rounded-[12px] p-[24px] relative w-full max-w-[466px] z-[10]"
      >
        <img
          src="/images/nav/close.svg"
          class="w-[24px] h-[24px] absolute right-[24px] top-[24px] scale-100 hover:scale-[1.05] cursor-pointer transition-all"
          @click="isInviteFriendsModal = false"
        >
        <p class="text-[24px] text-[700]">
          Invite Friends
        </p>
        <p class="text-[14px] mt-[16px]">
          Share the link to your social media to earn rewards!
        </p>
        <div class="flex items-center justify-between mt-[24px]">
          <img src="/images/menu/twitter.svg">
          <img src="/images/footer/instagram.svg">
          <img src="/images/menu/telegram.svg">
          <img src="/images/footer/m-logo.svg">
          <img src="/images/footer/youtube.svg">
          <img src="/images/footer/reddit.svg">
        </div>
        <p class="mt-[24px] text-[12px]">
          Page Link
        </p>
        <div>
          <div
            class="border-[1px] border-[#424245] rounded-[12px] w-full p-[16px] flex h-[56px] items-center justify-between mt-[8px] scale-[1] hover:scale-[1.02] transition-all cursor-pointer"
            @click.stop.prevent="copySign"
          >
            <p class="text-[14px] font-[700]">
              http://www.ridotto.io
            </p>
            <img src="/images/profile/user-info/copy-icon-revert.svg">
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed top-0 left-0 flex justify-center items-center w-full h-full transition-all px-[24px] md:px-[0px]"
      :class="isAvatarModal
        ? 'z-[100] scale-100 opacity-100'
        : '-z-[100] scale-0 opacity-0'
      "
    >
      <div class="w-full h-full absolute left-0 top-0" @click="isAvatarModal = false" />
      <div class="bg-[#251F2D] rounded-[12px] p-[24px] w-full max-w-[466px] relative z-[10]">
        <img
          src="/images/nav/close.svg"
          class="w-[24px] h-[24px] absolute right-[24px] top-[24px] scale-100 hover:scale-[1.05] cursor-pointer transition-all"
          @click="isAvatarModal = false"
        >
        <div class="flex pt-[64px] flex-col items-center">
          <img src="/images/profile/user-info/change-avatar.png" class="w-[200px] h-[200px]">
        </div>
        <div class="max-w-[384px] mx-auto">
          <p class="text-[20px mt-[40px]">
            You have not selected your PFP Avatar yet!
          </p>
          <p class="text-[14px] mt-[4px]">
            Choose your blockchain to access your NFT Collection to pick for
            your avatar picture
          </p>
        </div>
        <div class="w-full bg-[#60F] rounded-[12px] flex justify-center items-center h-[48px] mt-[40px] cursor-pointer">
          <p class="text-[16px]">
            Select Photo
          </p>
        </div>
      </div>
    </div>
    <div class="mt-[55px]">
      <ResolveRouter />
      <become-the-house class="mt-[40px]" />

      <ItemsNav
        active-color="#FF6600"
        :items="['Referral', 'Builder', 'Bankroller']"
        :active="active"
        class="border border-[#424245] mt-4"
        @set-active="(e) => $emit('setActive', e)"
      />
      <div class="gap-[24px] w-full mt-[40px] flex flex-col md:flex-row" :class="menu ? '' : 'closed-menu'">
        <div data-aos="fade-right" data-aos-once="true" data-aos-delay="700">
          <ProfileUserInfo
            :active="active"
            :show-social-modal="isSocialModal"
            :data="profile.navInfo"
            :edit="edit"
            :is-avatar-modal="isAvatarModal"
            @edit="(e) => (edit = e)"
            @show-social-modal="(e) => (isSocialModal = e)"
            @is-avatar-modal="(e) => (isAvatarModal = e)"
          />
          <!-- <ProfilePersonalInfo v-if="edit" /> -->
        </div>
        <ProfilePlayDetails
          v-if="active===0"
          :data="profile.play"
          :wallet="wallet"
          :ref-link="profile.refLink"
          :is-invite-friends-modal="isInviteFriendsModal"
          @set-active="setActive"
          @is-invite-friends-modal="(e) => (isInviteFriendsModal = e)"
          @change-active="(e) => (active = e)"
        />
        <ProfileBuildDetails v-if="active === 1" :data="profile.build" />
        <ProfileBankrollDetails v-if="active === 2" :data="profile.bankroll" :wallet="wallet" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, onMounted } from 'vue'
import profile from '~/data/profile.json'
import wallet from '~/data/wallet.json'
import { useMenu } from '~/composables/useMenu'
import BecomeTheHouse from '~/components/organisms/become-the-house.vue'
export default {
  setup() {
    const active = ref(0)
    const edit = ref(false)
    const profileData = ref<unknown>({})
    const isSocialModal = ref(false)
    const isAvatarModal = ref(false)
    const isInviteFriendsModal = ref(false)
    const copySign = () => {
      navigator.clipboard.writeText('http://www.ridotto.io')
    }
    const { menu, activeProfileIndex } = useMenu()
    const setActive = (index) => {
      activeProfileIndex.value = index
      active.value = index
    }
    onMounted(() => {
      active.value = activeProfileIndex.value
    })
    watch(
      () => activeProfileIndex.value,
      () => {
        active.value = activeProfileIndex.value
      }
    )
    return {
      profile,
      wallet,
      active,
      menu,
      edit,
      profileData,
      isSocialModal,
      isAvatarModal,
      isInviteFriendsModal,
      copySign,
      setActive
    }
  },
  components: { BecomeTheHouse }
}
</script>
