<template>
  <div>
    <div class="flex flex-col items-center gap-8 page-404 w-full max-w-none">
      <div class="title-text text-center lg:whitespace-nowrap">
        Oops! Not Available (Yet)
      </div>
      <img src="/images/404/404-cat.png" class="w-full">

      <staking-btn class="w-44 h-12" :fill="true" color="#9E68FF" text-color="white" @click="$router.push('/')">
        Back to Home
      </staking-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-404 {
    @screen sm {
      padding: 0 15%;
    }
    padding: 0 10%;
}
</style>
