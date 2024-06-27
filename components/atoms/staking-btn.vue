<template>
  <button
    class="btn"
    :class="`hover:bg-[${hoverColor}]`"
    :style="[fill ? `background: ${color}` : `border: 1px solid ${color};`, disabledColor && disabled ? `color: ${disabledColor}` : '', disabledBgColor && disabled ? `background: ${disabledBgColor}` : '', textColor ? `color: ${textColor}` : '']"
    :onmouseover="mouseOver"
    :onmouseout="mouseOut"
    :onmousedown="(e) => setClickColor(e)"
  >
    <slot />
  </button>
</template>

<script lang="ts">
export default {
    props: {
        color: {
          type: String,
          required: true,
          default: ''
        },
        fill: {
          type: Boolean,
          required: true,
          default: false
        },
        textColor: {
          type: String,
          required: false,
          default: ''
        },
        hoverColor: {
          type: String,
          required: false,
          default: ''
        },
        hoverTextColor: {
          type: String,
          required: false,
          default: ''
        },
        hoverShadow: {
          type: String,
          required: false,
          default: ''
        },
        clickIcon: {
          type: String,
          required: false,
          default: ''
        },
        clickIconStyle: {
          type: String,
          required: false,
          default: ''
        },
        disabledColor: {
          type: String,
          required: false,
          default: ''
        },
        icon: {
          type: String,
          required: false,
          default: ''
        },
        clickStyle: {
          type: String,
          required: false,
          default: ''
        },
        disabledBgColor: {
          type: String,
          required: false,
          default: ''
        },
        disabled: {
          type: Boolean,
          required: false,
          default: false
        }
    },
    setup(props) {
        const setIcon = (e, icon, iconStyle = '') => {
            const images = e.target.children
            for (let i = 0; i < images.length; i++) {
                images[i].style = iconStyle
                images[i].setAttribute('src', icon)
            }
        }

        const mouseOver = (e) => {
            e.target.style.boxShadow = props.hoverShadow
            e.target.style.color = props.hoverTextColor
        }

        const mouseOut = (e) => {
            e.target.style.background = props.color
            e.target.style.boxShadow = ''
            e.target.style.color = props.textColor
            if (props.icon) {
                setIcon(e, props.icon)
            }
        }

        const setClickColor = (e) => {
            e.target.style = props.clickStyle
            if (props.clickIcon) {
                setIcon(e, props.clickIcon, props.clickIconStyle)
            }
        }

        return {
            mouseOver,
            mouseOut,
            setClickColor
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    border-radius: 12px;
    padding: 5px;
    color: white;
    font-size: 20px;
    font-weight: 500;
    transition: 0.4s;
}
</style>
