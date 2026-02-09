<template>
  <Teleport to="body">
    <TransitionGroup name="toast-list" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="toast.type"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="removeToast(toast.id)">×</button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const toasts = ref([])
let toastId = 0

function getIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i'
  }
  return icons[type] || 'i'
}

function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

watch(() => toastStore.visible, (visible) => {
  if (visible) {
    const id = ++toastId
    toasts.value.push({
      id,
      message: toastStore.message,
      type: toastStore.type
    })

    setTimeout(() => {
      removeToast(id)
    }, 3000)

    toastStore.hide()
  }
})
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid;
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;

  &.success {
    border-color: var(--success);

    .toast-icon {
      background: var(--success-bg);
      color: var(--success);
    }
  }

  &.error {
    border-color: var(--error);

    .toast-icon {
      background: var(--error-bg);
      color: var(--error);
    }
  }

  &.warning {
    border-color: var(--warning);

    .toast-icon {
      background: var(--warning-bg);
      color: #946c00;
    }
  }

  &.info {
    border-color: var(--info);

    .toast-icon {
      background: var(--info-bg);
      color: var(--info);
    }
  }
}

.toast-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: var(--font-size-md);
  color: var(--text-primary);
  line-height: 1.4;
}

.toast-close {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: 16px;
  border-radius: var(--radius-full);
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

// Transition
.toast-list-enter-active {
  transition: all 0.3s ease;
}

.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>
