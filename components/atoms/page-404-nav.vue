<template>
  <div :class="menu && !isSmall ? 'md:ml-64' : 'md:ml-32'" class="page404nav mt-20 flex items-center justify-start gap-2">
    <div class="nav-button" @click="$router.back()">
      &lt;
    </div>
    <div v-if="!isSmall" class="nav-button" @click="$router.push('/')">
      Home
    </div>
    <div class="nav-button" disabled>
      404
    </div>
  </div>
</template>

<script setup>
import { useMenu } from '~/composables/useMenu'
defineProps({
  isSmall: {
    type: Boolean,
    required: true
  }
})
const { menu } = useMenu()

</script>

<style lang="scss" scoped>

.nav-button {
  border-radius: 8px;
  border: 1px solid #424245;
  padding: 6px 12px;
  @apply text-white text-sm cursor-pointer flex items-center justify-center;
}

@media (max-width: 1024px) {
  .page404nav {
    margin-left: 15%;
  }
}

@media (max-width: 768px) {
  .page404nav {
    margin-left: 10%;
    margin-top: 30px !important;
  }
}
</style>
