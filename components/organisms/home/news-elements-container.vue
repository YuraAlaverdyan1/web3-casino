<template>
  <div class="flex justify-between gap-4 mt-20">
    <NewsElement
      v-for="(el, index) of newsElements"
      :key="index"
      :title="el.title"
      :subtitles="el.subtitles"
      :title-color="el.titleColor"
    />
  </div>
</template>

<script lang="ts">
import newsElements from '~/data/news-elements.json'
export default {
  setup() {
    return {
      newsElements
    }
  }
}
</script>
