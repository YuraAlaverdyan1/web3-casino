<template>
  <input
    v-model="inputText"
    :type="type"
    :placeholder="placeholder"
    :style="[fill ? `background: ${backgroundColor}` : 'background: none !important;', fail ? 'border: 1px solid #FF4757;' : `border: 1px solid ${borderColor};`]"
    maxlength="40"
    class="h-[56px] w-full p-4 pr-9 custom-input outline-none"
    @input="$emit('inputText', inputText)"
  >
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
    props: {
        type: {
            type: String,
            required: true,
            default: 'text'
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        borderColor: {
            type: String,
            required: true
        },
        fill: {
            type: Boolean,
            required: true,
            default: false
        },
        backgroundColor: {
            type: String,
            required: false,
            default: ''
        },
        fail: {
            type: Boolean,
            required: true
        },
        initialValue: {
            type: String,
            required: false,
            default: ''
        },
        text: {
            type: String,
            required: false,
            default: ''
        },
        changeInputName: {
            type: Function,
            required: false,
            default: () => {}
        }
    },
    setup(props) {
        const inputText = ref<string>(props.initialValue)

        watch(() => props.initialValue, (newData) => {
            inputText.value = newData
        })

        watch(() => inputText.value, () => {
            props.changeInputName(inputText.value)
        })

        watch(() => props.text, () => {
            inputText.value = props.text
        })

        return {
            inputText
        }
    }
})
</script>

<style lang="scss" scoped>
input {
    border-radius: 12px;
    color: white
}
</style>
