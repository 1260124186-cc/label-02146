<template>
  <div class="stepper">
    <button
      class="stepper-btn"
      :disabled="modelValue <= min"
      @click="decrease"
    >
      <span class="stepper-icon">−</span>
    </button>
    <input
      type="number"
      class="stepper-input"
      :value="modelValue"
      :min="min"
      :max="max"
      @change="handleChange"
    />
    <button
      class="stepper-btn stepper-btn--add"
      :disabled="modelValue >= max"
      @click="increase"
    >
      <span class="stepper-icon">+</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 99
  }
})

const emit = defineEmits(['update:modelValue'])

function decrease() {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

function increase() {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

function handleChange(e) {
  let value = parseInt(e.target.value) || props.min
  value = Math.max(props.min, Math.min(props.max, value))
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.stepper {
  display: inline-flex;
  align-items: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.stepper-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  background: transparent;

  &:hover:not(:disabled) {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  &:active:not(:disabled) {
    background: var(--border-color);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &--add {
    color: var(--primary);

    &:hover:not(:disabled) {
      background: var(--primary-bg);
      color: var(--primary);
    }
  }
}

.stepper-icon {
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
}

.stepper-input {
  width: 36px;
  height: 28px;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  border: none;
  border-left: 1px solid var(--border-light);
  border-right: 1px solid var(--border-light);
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
