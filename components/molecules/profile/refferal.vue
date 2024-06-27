<template>
  <div class="flex flex-col">
    <div v-if="config.public.isHideRefferal !== 'true'" class="refferal w-full bg-[#201A29] rounded-[12px] pb-2">
      <div class="md:m-[24px] flex flex-col justify-between rounded-[12px] p-[24px]">
        <div>
          <div class="text-[20px] md:text-[32px] font-[500]">
            <p>Invite Friends, Amplify Your Earnings!</p>
          </div>
          <p class="text-[16px] font-[400] leading-[24px] mt-[24px]">
            Maximize your rewards with every friend you bring into our
            community. For every $1 your referrals spend, you'll earn 10 points,
            paving the way to exciting benefits. Accumulate points to unlock a
            world of rewards, including cryptocurrency, gifts, and more.
          </p>
        </div>

        <div class="w-full rounded-[12px] mt-[24px] p-[24px]" style="border: 1px solid #424245">
          <div class="flex flex-col ss:flex-row gap-2 w-full justify-between items-end">
            <div class="ss:basis-3/5 w-full">
              <p>Referral Link</p>
              <p class="bg-[#38333F] mt-[16px] p-[16px] rounded-[12px] flex justify-between w-full">
                <span e2e-id="referral-code">{{ code }}</span>
                <a e2e-id="referral-code-copy" class="cursor-pointer hover:text-[#60F]" @click="() => copy(code)">
                  <img src="/svgs/copy.svg">

                </a>
              </p>
            </div>
            <div class="w-full ss:basis-2/5">
              <button class="w-full" @click="() => createTwitterShareURL(code)">
                <span> Invite Friends </span>
                <img src="/svgs/x-social.svg">
              </button>
            </div>
          </div>
        </div>
        <div class="mt-[24px] share-actions">
          <span class="share-actions__description">
            Share the link to your social media to earn rewards! Don’t forget
            rewards multiply quickly!
          </span>
        </div>
      </div>
      <div class="md:bg-[#251F2D] rounded-lg p-[24px] md:m-[24px]">
        <forecast-referral />
        <carousel-referral />
      </div>
    </div>
    <div v-if="config.public.isHideRefferal !== 'true'">
      <leaderboard-referral />
    </div>
    <div>
      <coming-soon
        data-aos="fade-right"
        data-aos-once="true"
        data-aos-delay="700"
        :image="'/images/profile/user-info/refer-friends.jpeg'"
        :title="'Win cryptocurrency!'"
        :subtitle="'Refer Friends'"
        :description-title="'Refer and win #RDT, Convert to Gifts!'"
        :description="'An eye-catching section that informs users about future possibilities of converting referral points into cryptocurrency and real gifts.'"
        :link-path="2"
        without-link
        :link="'Coming Soon!'"
        :gradient="'linear-gradient(94deg, rgba(23, 17, 32, 0.81) 33.35%, rgba(23, 17, 32, 0.22) 54.3%, rgba(23, 17, 32, 0.00) 67.36%)'"
        @change-active="(e) => $emit('changeActive', e)"
      />
    </div>
    <div v-if="config.public.isHideRefferal !== 'true'" class="mt-4 px-[24px] md:px-[0px]">
      <div>
        <div class="text-[20px] md:text-[24px] font-[700]">
          <p>How to Invite?</p>
        </div>
        <p class="text-[16px] font-[400] leading-[24px] mt-[4px]">
          Follow our easy, step-by-step basic guide to securely migrate your
          assets.
        </p>
      </div>
      <div class="mt-6 flex flex-col sm:flex-row md:flex-col lg+:flex-row gap-3">
        <how-to-invite
          title="Share Your Code and Link"
          description="You can invite your friends to use all Bybit products with just one referral code."
        >
          <template #icon>
            <icon-refferal
              :icon-name="1"
            />
          </template>
        </how-to-invite>
        <how-to-invite
          title="Connect with Your Friends"
          description="Your friends will be associated with you after they sign up."
        >
          <template #icon>
            <icon-refferal
              :icon-name="2"
            />
          </template>
        </how-to-invite>
        <how-to-invite
          title="Get Multiple Rewards"
          description="Automatically get Trading Commissions, Bybit Card Rewards  when your friends trade."
        >
          <template #icon>
            <icon-refferal
              :icon-name="3"
            />
          </template>
        </how-to-invite>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import postMessage from '~/data/post.json'
import CarouselReferral from '~/components/molecules/profile/carousel-referral.vue'
import ForecastReferral from '~/components/molecules/profile/forecast-referral.vue'
import LeaderboardReferral from '~/components/molecules/profile/leaderboard-referral.vue'
import ComingSoon from '~/components/molecules/profile/coming-soon.vue'
import HowToInvite from '~/components/atoms/referral/how-to-invite.vue'
import IconRefferal from '~/components/svgs/refferal.vue'

export default {
  components: {
    ComingSoon,
    HowToInvite,
    CarouselReferral,
    ForecastReferral,
    LeaderboardReferral,
    IconRefferal
  },
  props: {
    code: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup() {
    // eslint-disable-next-line no-undef
    const config = useRuntimeConfig()
    function copyToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    const copy = (text: string) => {
      copyToClipboard(`${window.location.host}/casino?referral=${text}`)
    }
    function createTwitterShareURL(text: string) {
      const lastText = postMessage.referral.twitter.postText
      const encodedText = encodeURIComponent(lastText)
      const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodedText}&url=${`https://${window.location.host}/casino?referral=${text}`}`
      window.open(twitterShareURL, '_blank')
    }
    return { copy, createTwitterShareURL, config }
  }
}
</script>
<style lang="scss" scoped>
.refferal {
  &__description {
    color: var(--text-01, #f5f5f7);
    font-family: 'Exo 2';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }

  button {
    display: flex;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    min-width: 200px;
    border-radius: 12px;
    background: var(--primary-01, #60f);
  }

  .share-actions {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;

    &__description {
      color: var(--text-02, #e6e6e6);
      font-variant-numeric: lining-nums proportional-nums;
      /* Paragraph/M/Regular */
      font-family: 'Exo 2';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      /* 171.429% */
    }
  }
}
</style>
