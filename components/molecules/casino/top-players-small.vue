<template>
  <div class="mt-4">
    <div class="flex justify-between items-center text-white">
      <div style="padding-left: 50px;">
        Player
      </div>
      <div style="padding-right: 30px;">
        Earned
      </div>
    </div>
    <div class="flex flex-col gap-2 pt-2">
      <TopPlayer
        v-for="(player, index) of players"
        :key="index"
        :index="index + 1"
        :name="player.name"
        :earned="player.earned"
        :staked="player.staked"
        :token="player.token"
      />
    </div>
  </div>
</template>

<script lang="ts">
import players from '~/data/top-players.json'
export default {
    setup() {
        return {
            players
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
