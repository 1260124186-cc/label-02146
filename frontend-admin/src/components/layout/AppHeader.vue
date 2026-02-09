<template>
  <header class="app-header">
    <div class="header-container">
      <!-- 移动端菜单按钮 -->
      <button class="menu-toggle" @click="toggleSidebar">
        <Icon name="menu" :size="24" />
      </button>

      <!-- Logo - 最左侧 -->
      <div class="header-logo">
        <span class="logo-icon">🍓</span>
        <span class="logo-text">草莓鲜果商城</span>
      </div>

      <!-- 右侧操作区 -->
      <div class="header-actions">
        <button class="action-btn cart-btn" @click="goToCart">
          <Icon name="shopping-cart" :size="20" />
          <span class="btn-text">购物车</span>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>

        <template v-if="userStore.isLoggedIn">
          <div class="user-info" @click="goToProfile">
            <div class="user-avatar">{{ userStore.user?.nickname?.charAt(0) || 'U' }}</div>
            <span class="user-name">{{ userStore.user?.nickname || '用户' }}</span>
          </div>
        </template>
        <button v-else class="action-btn login-btn" @click="$router.push('/profile')">
          <Icon name="user" :size="20" />
          <span class="btn-text">登录</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import Icon from '@/components/common/Icon.vue'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const emit = defineEmits(['toggle-sidebar'])

const cartCount = computed(() => cartStore.totalCount)

function goToCart() {
  router.push('/cart')
}

function goToProfile() {
  router.push('/profile')
}

function toggleSidebar() {
  emit('toggle-sidebar')
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  z-index: 1000;
}

.header-container {
  height: 100%;
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-bg);
    color: var(--primary);
  }
}

.header-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

.cart-btn {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--primary);
  color: white;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  border-radius: var(--radius-full);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light), var(--primary));
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-full);
}

.user-name {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  font-weight: 500;
}

.login-btn {
  background: var(--primary);
  color: white;

  &:hover {
    background: var(--primary-light);
    color: white;
  }
}

.btn-text {
  font-weight: 500;
}

// 响应式
@media (max-width: 768px) {
  .header-container {
    padding: 0 var(--spacing-md);
  }

  .menu-toggle {
    display: flex;
  }

  .logo-text {
    font-size: var(--font-size-lg);
  }

  .btn-text {
    display: none;
  }

  .user-name {
    display: none;
  }

  .action-btn {
    padding: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }

  .logo-icon {
    font-size: 32px;
  }
}
</style>
