<template>
  <nav class="tab-bar">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab-item"
      :class="{ active: isActive(tab.path) }"
    >
      <div class="tab-icon-wrapper">
        <Icon :name="tab.icon" :size="22" />
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </div>
      <span class="tab-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import Icon from '@/components/common/Icon.vue'

const route = useRoute()
const cartStore = useCartStore()

const tabs = computed(() => [
  { path: '/', icon: 'home', label: '首页' },
  { path: '/cart', icon: 'shopping-cart', label: '购物车', badge: cartStore.totalCount > 0 ? cartStore.totalCount : null },
  { path: '/profile', icon: 'user', label: '我的' }
])

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 56px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.7;
  }

  &.active {
    color: var(--primary);

    .tab-icon-wrapper {
      background: var(--primary-bg);
    }
  }
}

.tab-icon-wrapper {
  position: relative;
  width: 40px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  transition: background 0.2s ease;
}

.tab-badge {
  position: absolute;
  top: 0;
  right: 2px;
  min-width: 14px;
  height: 14px;
  padding: 0 4px;
  background: var(--primary);
  color: white;
  font-size: 9px;
  font-weight: 600;
  line-height: 14px;
  text-align: center;
  border-radius: var(--radius-full);
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
}
</style>
