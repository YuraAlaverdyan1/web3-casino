<template>
  <div>
    <div ref="animation" class="" :class="[hide ? 'animation-lottie' : 'animation-lottie']" />
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import lottie, { AnimationItem } from 'lottie-web'
import { ref, onMounted } from 'vue'

export default {
  props: {
    source: {
      type: String,
      required: false,
      default: ''
    },
    rePlay: {
      type: Boolean,
      required: false,
      default: false
    },
    autoload: {
      type: Boolean,
      required: false,
      default: true
    },
    infinite: {
      type: Boolean,
      required: false,
      default: true
    },
    unobserve: {
      type: Boolean,
      required: false,
      default: false
    },
    delay: {
      type: Number,
      required: false,
      default: 0
    },
    alive: {
      type: Number,
      required: false,
      default: 0
    }
  },
  setup(props) {
    const hide = ref<boolean>(false)
    const animation = ref<Element>()
    let Animation: AnimationItem | null = null
    const sources: Record<string, string> = {}

    const isDark = true

    const load = (forcePlay = false) => {
      if (Animation) {
        // Animation.destroy()
      }
      if (props.delay) {
        hide.value = true
        setTimeout(() => {
          if (props.autoload === true) {
            if (forcePlay) {
              Animation?.stop()
              Animation?.play()
            } else {
              loadAnimation()
            }
            hide.value = false
          }
        }, props.delay * 1000)
      } else {
        if (forcePlay) {
          Animation?.stop()
          Animation?.play()
        } else {
          loadAnimation()
        }
        hide.value = false
        if (props.alive) {
          setTimeout(() => {
            if (animation.value) {
              hide.value = true
            }
          }, props.alive * 1000)
        }
      }
    }

    const observe = () => {
      loadAnimation(true)
      const wrapper = animation.value as Element
      if (wrapper) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(async (entry) => {
              if (entry.intersectionRatio > 0) {
                if (
                  entry.isIntersecting &&
                  Math.floor(entry.intersectionRatio) === 1
                ) {
                  await load(true)
                  if (props.unobserve) {
                    observer.unobserve(wrapper)
                  }
                }
              }
            })
          },
          {
            threshold: [0, 0.25, 0.5, 0.75, 1]
          }
        )
        observer.observe(wrapper)
      }
    }

    const loadAnimation = (lazy = false, themeSwitched = false) => {
      if (lazy) {
        hide.value = true
      }
      const data = sources[props.source]
      if (Animation) {
        Animation.destroy()
      }
      Animation = lottie.loadAnimation({
        container: animation.value as Element,
        renderer: 'svg',
        loop: props.infinite,
        autoplay: lazy ? false : props.autoload,
        animationData: data
      })
      themeSwitched && Animation?.play()
    }

    onMounted(async () => {
      const { data } = await axios(props.source)
      sources[props.source] = data
      if (!props.rePlay) {
        await load()
      } else {
        observe()
      }
    })

    return {
      animation,
      sources,
      isDark,
      hide,
      load,
      observe,
      loadAnimation
    }
  }
}
</script>
