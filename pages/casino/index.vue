<template>
  <div
    class="container mt-[20px] lg:mt-[50px] w-full max-w-none overflow-y-hidden"
    :class="menu ? 'opened-menu' : 'closed-menu'"
  >
    <div class="mx-[16px] lg:mx-[0px] mt-[16px] lg:mt-[0px]">
      <ResolveRouter class="mb-[16px]" />
      <SuggestedGames />
    </div>
    <become-the-house />
    <CasinoGames
      :all="true"
      :items="ridottoOriginals.games"
      :title="'Ridotto Originals'"
      :items-to-show="4"
      class="px-[24px] lg:px-[0px]"
    />
    <LotteryLeaderboard data-aos="fade-up" data-aos-once="true" data-aos-delay="300" data-aos-offset="400" />
  </div>
</template>

<script>
import ridottoOriginals from '~/data/ridotto-originals.json'
import { useMenu } from '~/composables/useMenu'
import BecomeTheHouse from '~/components/organisms/become-the-house.vue'

export default {
  components: {
    BecomeTheHouse
  },
  setup() {
    const { menu } = useMenu()

    return {
      menu,
      ridottoOriginals
    }
  }
}
</script>

<style lang="scss" scoped>
.closed-menu {
  width: 89vw;
}

.opened-menu {
  width: 77vw;
}
</style>
