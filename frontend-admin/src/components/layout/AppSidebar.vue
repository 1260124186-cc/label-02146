<template>
  <div>
    <!-- 遮罩层 -->
    <Transition name="fade">
      <div v-if="isOpen && isMobile" class="sidebar-overlay" @click="close"></div>
    </Transition>

    <aside class="app-sidebar" :class="{ collapsed: !isOpen }">
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          @click="handleNavClick"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobile = ref(false)
const isOpen = ref(true)

const navItems = [
  { path: '/', icon: '🏠', label: '商品首页' },
  { path: '/cart', icon: '🛒', label: '购物车' },
  { path: '/profile', icon: '👤', label: '个人中心' }
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/' || route.path.startsWith('/product')
  }
  return route.path.startsWith(path)
}

function handleResize() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isOpen.value = false
  } else {
    isOpen.value = true
  }
}

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  if (isMobile.value) {
    isOpen.value = false
  }
}

function handleNavClick() {
  if (isMobile.value) {
    isOpen.value = false
  }
}

defineExpose({ toggle, close })

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.app-sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  background: var(--bg-primary);
  border-right: 1px solid var(--border-light);
  z-index: 100;
  transition: transform 0.3s ease;

  &.collapsed {
    transform: translateX(-100%);
  }
}

.sidebar-nav {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  &.active {
    background: var(--primary-bg);
    color: var(--primary);
    font-weight: 500;
  }
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  flex: 1;
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
