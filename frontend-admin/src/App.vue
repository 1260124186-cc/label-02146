<template>
  <div class="app-layout">
    <AppHeader @toggle-sidebar="toggleSidebar" />
    <div class="app-body">
      <AppSidebar ref="sidebarRef" />
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import Toast from '@/components/common/Toast.vue'

const sidebarRef = ref(null)

function toggleSidebar() {
  sidebarRef.value?.toggle()
}
</script>

<style lang="scss">
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
}

.app-body {
  display: flex;
  flex: 1;
  padding-top: var(--header-height);
}

.app-main {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: var(--spacing-lg);
  min-height: calc(100vh - var(--header-height));
  overflow-x: hidden;
}

// Page transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式
@media (max-width: 768px) {
  .app-main {
    margin-left: 0;
    padding: var(--spacing-md);
  }
}
</style>
