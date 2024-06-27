<template>
  <div />
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  onMounted(() => {
    useRouter().push('/404')
  })
</script>
