<template>
  <div class="mt-20">
    <div class="lottery-title">
      Top Winners
    </div>
    <Table :data="data" />
  </div>
</template>

<script lang="ts">
import data from '~/data/top-winners.json'
export default {
    setup() {
        return { data }
    }
}
</script>

<style lang="scss" scoped>

</style>
