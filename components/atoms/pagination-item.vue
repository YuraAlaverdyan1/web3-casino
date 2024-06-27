<template>
  <button class="btn pagination-btn" :class="active ? 'active-btn' : ''">
    {{ buttonValue }}
  </button>
</template>

<script lang="ts">
import { computed } from 'vue'
export default {
    props: {
        active: {
            type: Boolean,
            default: false
        },
        number: {
            type: Number,
            default: 1
        },
        prev: {
            type: Boolean,
            default: false
        },
        next: {
            type: Boolean,
            default: false
        },
        middle: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const buttonValue = computed(() => {
            if (props.prev) {
                return '<'
            } else if (props.next) {
                return '>'
            } else if (props.middle) {
                return '...'
            }
            return props.number
        })

        return {
            buttonValue
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    width: 40px;
    height: 40px;
    background: rgba($color: #000000, $alpha: 0);
    border: 1px solid #262529;
    color: #E6E6E6;
    border-radius: 8px;
}

.active-btn {
    border: 1px solid white;
}
</style>
