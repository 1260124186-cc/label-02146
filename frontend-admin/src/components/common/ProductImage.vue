<template>
  <div
    class="product-image"
    :class="{ 'product-image--loading': isLoading, 'product-image--error': hasError }"
    :style="{ aspectRatio: aspectRatio }"
  >
    <!-- 加载中状态 -->
    <div v-if="isLoading" class="image-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- 错误/占位状态 - 使用 SVG 内联图标 -->
    <div v-else-if="hasError || !src" class="image-placeholder">
      <svg
        class="placeholder-icon"
        :width="iconSize"
        :height="iconSize"
        viewBox="0 0 64 64"
        fill="none"
      >
        <!-- 草莓图标 SVG -->
        <ellipse cx="32" cy="36" rx="20" ry="22" fill="#e74c3c"/>
        <path d="M32 14 L28 6 M32 14 L36 6 M32 14 L32 4" stroke="#40c057" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="32" cy="10" rx="8" ry="4" fill="#40c057"/>
        <circle cx="26" cy="32" r="2" fill="#f1c40f"/>
        <circle cx="38" cy="32" r="2" fill="#f1c40f"/>
        <circle cx="32" cy="40" r="2" fill="#f1c40f"/>
        <circle cx="26" cy="44" r="2" fill="#f1c40f"/>
        <circle cx="38" cy="44" r="2" fill="#f1c40f"/>
        <circle cx="32" cy="50" r="2" fill="#f1c40f"/>
      </svg>
      <span v-if="showLabel" class="placeholder-label">{{ placeholderText }}</span>
    </div>

    <!-- 实际图片 -->
    <img
      v-else
      :src="src"
      :alt="alt"
      class="image-content"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: '商品图片'
  },
  aspectRatio: {
    type: String,
    default: '1'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v)
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  placeholderText: {
    type: String,
    default: '暂无图片'
  }
})

const isLoading = ref(!!props.src)
const hasError = ref(false)

const iconSize = computed(() => {
  const sizes = { small: 32, medium: 48, large: 64 }
  return sizes[props.size]
})

function handleLoad() {
  isLoading.value = false
  hasError.value = false
}

function handleError() {
  isLoading.value = false
  hasError.value = true
}
</script>

<style lang="scss" scoped>
.product-image {
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-loading,
.image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.placeholder-icon {
  opacity: 0.8;
}

.placeholder-label {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}
</style>
