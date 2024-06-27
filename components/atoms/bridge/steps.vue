<template>
  <div class="steps">
    <div v-for="(step, index) in steps" :key="index" class="steps_step">
      <div class="steps_step_progress">
        <img v-if="step.status === 'done'" alt="finished" src="/bridge/checked.svg">
        <div
          v-else
          class="steps_step_progress_container"
          :class="step.status === 'in proggress' && 'filled'"
        >
          {{ index + 1 }}
        </div>
        <div v-if="index !== steps.length - 1" class="stroke" />
      </div>
      <div class="steps_step_status">
        {{ step.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  steps: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.steps {
  display: flex;
  flex-direction: column;
  padding: 24px;

  &_step {
    display: flex;
    width: 100%;

    img {
      height: 32px;
      width: 32px;
    }

    &_status {
      color: #f5f5f7;
      width: 100%;
      text-align: center;
      font-family: Exo 2;
      font-size: 16px;
      font-weight: 700;
    }

    &_progress {
      &_container {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        border: 1px solid #9e68ff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
      }
    }

    .filled {
      background-color: #9e68ff;
    }

    .stroke {
      width: 2px;
      height: 25px;
      background-color: #9e68ff;
      margin: 3px 0 3px 15px;
    }
  }
}
</style>
