<template>
  <div class="flex gap-2">
    <input type="image" src="/images/profile/user-info/left-black-border.png" @click="$emit('prev')">
    <input type="image" src="/images/profile/user-info/right-black-border.png" @click="$emit('next')">
  </div>
</template>

<script lang="ts">
export default {
    emits: ['prev', 'next']
}
</script>
