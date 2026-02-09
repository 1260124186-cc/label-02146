<template>
  <button
    class="btn"
    :class="[
      `btn--${type}`,
      `btn--${size}`,
      { 'btn--block': block, 'btn--loading': loading, 'btn--disabled': disabled }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'text', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v)
  },
  block: Boolean,
  loading: Boolean,
  disabled: Boolean
})

const emit = defineEmits(['click'])

function handleClick(e) {
  if (!props.loading && !props.disabled) {
    emit('click', e)
  }
}
</script>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
  border: none;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  // Types
  &--primary {
    background: var(--primary);
    color: white;

    &:hover:not(:disabled) {
      background: var(--primary-light);
    }
  }

  &--secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);

    &:hover:not(:disabled) {
      background: var(--border-color);
    }
  }

  &--outline {
    background: transparent;
    color: var(--primary);
    border: 1.5px solid var(--primary);

    &:hover:not(:disabled) {
      background: var(--primary-bg);
    }
  }

  &--text {
    background: transparent;
    color: var(--primary);

    &:hover:not(:disabled) {
      background: var(--primary-bg);
    }
  }

  &--danger {
    background: var(--error);
    color: white;

    &:hover:not(:disabled) {
      background: #e03131;
    }
  }

  // Sizes
  &--small {
    height: 32px;
    padding: 0 var(--spacing-md);
    font-size: var(--font-size-xs);
  }

  &--medium {
    height: 38px;
    padding: 0 var(--spacing-lg);
    font-size: var(--font-size-sm);
  }

  &--large {
    height: 44px;
    padding: 0 var(--spacing-xl);
    font-size: var(--font-size-md);
  }

  // Modifiers
  &--block {
    width: 100%;
  }

  &--loading,
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
