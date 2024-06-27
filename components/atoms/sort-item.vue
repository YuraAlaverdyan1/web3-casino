<template>
  <div class="select-container">
    <img src="/images/nav/arrow-right.png" class="arrow">
    <select v-model="selectedName" class="select" @select="$emit('select', selectedName)">
      <option background="rgba(255, 255, 255, 0.04)" :value="name" selected disabled hidden>
        {{ name }}
      </option>
      <option v-for="(option, index) of options" :key="index" background="rgba(255, 255, 255, 0.04)" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'
export default {
    props: {
        name: {
            type: String,
            default: '',
            required: true
        },
        options: {
            type: Array as PropType<any>,
            required: true
        }
    },
    setup(props) {
        const selectedName = ref(props.name)
        return {
            selectedName
        }
    }
}
</script>

<style lang="scss" scoped>
    .select {
        -webkit-appearance: none;
        -moz-appearance: none;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 5px;
        color: white;
        height: 50px;
        font-size: 16px;
        padding: 10px 30px;
    }
    .select-container {
        position: relative;
    }
    .select > option {
        color: black;
        padding: 5px 15px;
    }
    .arrow {
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        margin: auto;
    }
</style>
