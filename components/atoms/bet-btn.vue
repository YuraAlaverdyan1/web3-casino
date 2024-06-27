<template>
  <div class="relative">
    <img :src="`/images/slots/${game}/buttons/bet.png`">
    <div class="absolute bottom-10 left-20 slot-font">
      {{ bet }}
    </div>
    <div class="absolute top-0 bottom-2 right-6 m-auto flex flex-col justify-center gap-1 w-8 mr-4">
      <input type="image" :src="`/images/slots/${game}/buttons/+.png`" @click="$emit('inc')">
      <input type="image" :src="`/images/slots/${game}/buttons/-.png`" @click="$emit('dec')">
    </div>
  </div>
</template>

<script lang="ts">
export default {
    props: {
        game: {
            type: String,
            required: true,
            default: ''
        },
        bet: {
            type: String,
            required: true,
            default: '0'
        }
    },
    emits: ['inc', 'dec']
}
</script>
