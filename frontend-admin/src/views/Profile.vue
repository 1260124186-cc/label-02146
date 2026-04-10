<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">👤 个人中心</h1>
    </div>

    <div class="profile-layout">
      <!-- 用户卡片 -->
      <div class="user-card card">
        <template v-if="userStore.isLoggedIn">
          <div class="user-avatar">
            {{ userStore.user?.nickname?.charAt(0) || 'U' }}
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ userStore.user?.nickname || '用户' }}</h2>
            <p class="user-id">@{{ userStore.user?.username }}</p>
          </div>
          <Button type="outline" @click="confirmLogout">
            <Icon name="log-out" :size="16" />
            退出登录
          </Button>
        </template>

        <template v-else>
          <div class="user-avatar guest">?</div>
          <div class="user-info">
            <h2 class="user-name">未登录</h2>
            <p class="user-hint">登录后享受更多服务</p>
          </div>
          <Button type="primary" @click="showLoginModal = true">
            立即登录
          </Button>
        </template>
      </div>

      <!-- 订单统计 -->
      <div class="stats-card card" v-if="userStore.isLoggedIn">
        <h3 class="card-title">我的订单</h3>
        <div class="stats-grid">
          <div v-for="stat in orderStats" :key="stat.key" class="stat-item">
            <span class="stat-icon">{{ stat.icon }}</span>
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- 最近订单 -->
      <div v-if="userStore.isLoggedIn && orders.length > 0" class="orders-card card">
        <h3 class="card-title">最近订单</h3>
        <div class="order-list">
          <div v-for="order in orders" :key="order.id" class="order-item">
            <div class="order-product">
              <span class="product-emoji">🍓</span>
            </div>
            <div class="order-info">
              <div class="order-name">{{ order.productName }}</div>
              <div class="order-meta">
                <span>{{ order.spec }} × {{ order.quantity }}</span>
                <span>订单号：{{ order.id }}</span>
              </div>
              <div v-if="order.address" class="order-address">
                <Icon name="map-pin" :size="12" />
                <span>{{ order.address.name }} {{ order.address.phone }} {{ order.address.province }}{{ order.address.city }}{{ order.address.district }} {{ order.address.detail }}</span>
              </div>
            </div>
            <span class="order-status" :class="order.status">{{ order.statusText }}</span>
            <div class="order-price">¥{{ order.totalPrice }}</div>
          </div>
        </div>
      </div>

      <!-- 收货地址 -->
      <div v-if="userStore.isLoggedIn" class="addresses-card card">
        <div class="address-header">
          <h3 class="card-title">收货地址</h3>
          <Button type="primary" size="small" @click="openAddressModal()">
            <Icon name="plus" :size="14" />
            添加地址
          </Button>
        </div>

        <div v-if="addressStore.addresses.length === 0" class="empty-addresses">
          <span class="empty-icon">📍</span>
          <p>暂无收货地址</p>
          <p class="empty-desc">点击上方按钮添加收货地址</p>
        </div>

        <div v-else class="address-list">
          <div v-for="addr in addressStore.addresses" :key="addr.id" class="address-item">
            <div class="address-main">
              <div class="address-top">
                <span class="address-name">{{ addr.name }}</span>
                <span class="address-phone">{{ addr.phone }}</span>
                <span v-if="addr.isDefault" class="default-badge">默认</span>
              </div>
              <div class="address-full">
                <Icon name="map-pin" :size="14" />
                <span>{{ addr.province }}{{ addr.city }}{{ addr.district }} {{ addr.detail }}</span>
              </div>
            </div>
            <div class="address-actions">
              <button class="action-btn" @click="setDefaultAddress(addr.id)" v-if="!addr.isDefault">设为默认</button>
              <button class="action-btn edit" @click="openAddressModal(addr)">编辑</button>
              <button class="action-btn delete" @click="confirmDeleteAddress(addr.id)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 收货地址弹窗 -->
    <Transition name="modal">
      <div v-if="showAddressModal" class="modal-mask" @click.self="showAddressModal = false">
        <div class="modal-content card address-modal">
          <button class="modal-close" @click="showAddressModal = false">
            <Icon name="x" :size="20" />
          </button>

          <div class="modal-header">
            <span class="modal-logo">📍</span>
            <h2 class="modal-title">{{ editingAddress ? '编辑收货地址' : '添加收货地址' }}</h2>
          </div>

          <form class="address-form" @submit.prevent="handleSaveAddress">
            <div class="form-item">
              <label class="form-label">收货人 *</label>
              <input
                v-model="addressForm.name"
                type="text"
                class="form-input"
                placeholder="请输入收货人姓名"
              />
            </div>
            <div class="form-item">
              <label class="form-label">手机号 *</label>
              <input
                v-model="addressForm.phone"
                type="tel"
                class="form-input"
                placeholder="请输入手机号"
                maxlength="11"
              />
            </div>
            <div class="form-item">
              <label class="form-label">省份 *</label>
              <input
                v-model="addressForm.province"
                type="text"
                class="form-input"
                placeholder="例：北京市"
              />
            </div>
            <div class="form-item">
              <label class="form-label">城市 *</label>
              <input
                v-model="addressForm.city"
                type="text"
                class="form-input"
                placeholder="例：北京市"
              />
            </div>
            <div class="form-item">
              <label class="form-label">区/县 *</label>
              <input
                v-model="addressForm.district"
                type="text"
                class="form-input"
                placeholder="例：朝阳区"
              />
            </div>

            <div class="form-item">
              <label class="form-label">详细地址 *</label>
              <textarea
                v-model="addressForm.detail"
                class="form-textarea"
                placeholder="请输入详细地址，如街道、门牌号等"
                rows="2"
              ></textarea>
            </div>

            <div class="form-item">
              <label class="form-checkbox">
                <input
                  type="checkbox"
                  v-model="addressForm.isDefault"
                />
                <span>设为默认收货地址</span>
              </label>
            </div>

            <Button type="primary" size="large" block :loading="isSavingAddress">
              {{ editingAddress ? '保存修改' : '添加地址' }}
            </Button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- 删除地址确认弹窗 -->
    <Transition name="modal">
      <div v-if="showDeleteAddressConfirm" class="modal-mask" @click.self="showDeleteAddressConfirm = false">
        <div class="confirm-modal card">
          <div class="confirm-content">
            <span class="confirm-icon">🗑️</span>
            <h3 class="confirm-title">确认删除</h3>
            <p class="confirm-desc">确定要删除这个收货地址吗？</p>
          </div>
          <div class="confirm-actions">
            <Button type="secondary" @click="showDeleteAddressConfirm = false">取消</Button>
            <Button type="primary" @click="handleDeleteAddress">确认删除</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 登录弹窗 -->
    <Transition name="modal">
      <div v-if="showLoginModal" class="modal-mask" @click.self="showLoginModal = false">
        <div class="modal-content card">
          <button class="modal-close" @click="showLoginModal = false">
            <Icon name="x" :size="20" />
          </button>

          <div class="modal-header">
            <span class="modal-logo">🍓</span>
            <h2 class="modal-title">欢迎登录</h2>
          </div>

          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-item">
              <label class="form-label">用户名</label>
              <input
                v-model="loginForm.username"
                type="text"
                class="form-input"
                placeholder="请输入用户名"
              />
            </div>
            <div class="form-item">
              <label class="form-label">密码</label>
              <input
                v-model="loginForm.password"
                type="password"
                class="form-input"
                placeholder="请输入密码"
              />
            </div>
            <Button type="primary" size="large" block :loading="isLoggingIn">
              登录
            </Button>
          </form>

        </div>
      </div>
    </Transition>

    <!-- 退出确认弹窗 -->
    <Transition name="modal">
      <div v-if="showLogoutConfirm" class="modal-mask" @click.self="showLogoutConfirm = false">
        <div class="confirm-modal card">
          <div class="confirm-content">
            <span class="confirm-icon">🚪</span>
            <h3 class="confirm-title">确认退出</h3>
            <p class="confirm-desc">确定要退出登录吗？</p>
          </div>
          <div class="confirm-actions">
            <Button type="secondary" @click="showLogoutConfirm = false">取消</Button>
            <Button type="primary" @click="handleLogout">确认退出</Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useOrderStore } from '@/stores/order'
import { useAddressStore } from '@/stores/address'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const toastStore = useToastStore()
const orderStore = useOrderStore()
const addressStore = useAddressStore()

const showLoginModal = ref(false)
const showLogoutConfirm = ref(false)
const isLoggingIn = ref(false)

const showAddressModal = ref(false)
const showDeleteAddressConfirm = ref(false)
const isSavingAddress = ref(false)
const editingAddress = ref(null)
const pendingDeleteAddressId = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const addressForm = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const orderStats = computed(() => [
  { key: 'pending', icon: '💳', value: orderStore.orderStats.pending, label: '待付款' },
  { key: 'shipped', icon: '📦', value: orderStore.orderStats.shipped, label: '待收货' },
  { key: 'review', icon: '⭐', value: orderStore.orderStats.review, label: '待评价' },
  { key: 'refund', icon: '🔄', value: orderStore.orderStats.refund, label: '售后' }
])

const orders = computed(() => orderStore.recentOrders)

function openAddressModal(address = null) {
  editingAddress.value = address
  if (address) {
    Object.assign(addressForm, {
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      isDefault: address.isDefault
    })
  } else {
    Object.assign(addressForm, {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: addressStore.addresses.length === 0
    })
  }
  showAddressModal.value = true
}

function handleSaveAddress() {
  if (!addressForm.name || !addressForm.phone || !addressForm.province || !addressForm.city || !addressForm.district || !addressForm.detail) {
    toastStore.warning('请填写完整信息')
    return
  }

  isSavingAddress.value = true

  setTimeout(() => {
    isSavingAddress.value = false
    if (editingAddress.value) {
      addressStore.updateAddress(editingAddress.value.id, addressForm)
      toastStore.success('地址已更新')
    } else {
      addressStore.addAddress(addressForm)
      toastStore.success('地址添加成功')
    }
    showAddressModal.value = false
  }, 500)
}

function setDefaultAddress(id) {
  addressStore.setDefault(id)
  toastStore.success('已设为默认地址')
}

function confirmDeleteAddress(id) {
  pendingDeleteAddressId.value = id
  showDeleteAddressConfirm.value = true
}

function handleDeleteAddress() {
  addressStore.deleteAddress(pendingDeleteAddressId.value)
  showDeleteAddressConfirm.value = false
  toastStore.success('地址已删除')
}

async function handleLogin() {
  if (!loginForm.username || !loginForm.password) {
    toastStore.warning('请填写完整信息')
    return
  }

  isLoggingIn.value = true

  try {
    await userStore.login(loginForm.username, loginForm.password)
    toastStore.success('登录成功')
    showLoginModal.value = false
    loginForm.username = ''
    loginForm.password = ''
  } catch (error) {
    toastStore.error(error.message)
  } finally {
    isLoggingIn.value = false
  }
}

function confirmLogout() {
  showLogoutConfirm.value = true
}

function handleLogout() {
  userStore.logout()
  cartStore.clearCart()
  orderStore.clearOrders()
  showLogoutConfirm.value = false
  toastStore.success('已退出登录')
}
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
}

.profile-layout {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

// User Card
.user-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
}

.user-avatar {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light), var(--primary));
  color: white;
  font-size: 28px;
  font-weight: 600;
  border-radius: var(--radius-full);

  &.guest {
    background: var(--bg-tertiary);
    color: var(--text-tertiary);
  }
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.user-id {
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
}

.user-hint {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

// Stats Card
.stats-card,
.orders-card {
  padding: var(--spacing-xl);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-bg);
  }
}

.stat-icon {
  font-size: 28px;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

// Order List
.order-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.order-item {
  display: grid;
  grid-template-columns: 56px 1fr 72px 80px;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.order-product {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #fff8f8 0%, #ffecec 100%);
  border-radius: var(--radius-md);
}

.product-emoji {
  font-size: 28px;
}

.order-info {
  min-width: 0;
}

.order-name {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.order-meta {
  display: flex;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.order-status {
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  text-align: center;
  white-space: nowrap;

  &.pending {
    background: var(--warning-bg);
    color: var(--warning);
  }

  &.shipping {
    background: var(--primary-bg);
    color: var(--primary);
  }

  &.completed {
    background: var(--success-bg);
    color: var(--success);
  }

  &.refund {
    background: var(--danger-bg);
    color: var(--danger);
  }
}

.order-price {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary);
  text-align: right;
}

.order-address {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
}

// Address Card
.addresses-card {
  padding: var(--spacing-xl);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.empty-addresses {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);

  .empty-icon {
    font-size: 48px;
    display: block;
    margin-bottom: var(--spacing-md);
  }

  p {
    font-size: var(--font-size-md);
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .empty-desc {
    font-size: var(--font-size-sm);
    color: var(--text-tertiary);
  }
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.address-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.address-top {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.address-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
}

.address-phone {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}

.default-badge {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background: var(--primary-bg);
  color: var(--primary);
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.address-full {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;

  .icon {
    margin-top: 2px;
    color: var(--primary);
    flex-shrink: 0;
  }
}

.address-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.action-btn {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  &.edit:hover {
    background: var(--primary-bg);
    color: var(--primary);
  }

  &.delete:hover {
    background: var(--error-bg);
    color: var(--error);
  }
}

// Address Modal
.address-modal {
  width: 480px;
  max-width: calc(100% - 32px);
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
}

.flex-1 {
  flex: 1;
}

.form-textarea {
  min-height: 60px;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  border: 1.5px solid transparent;
  transition: all 0.2s ease;
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:focus {
    background: var(--bg-primary);
    border-color: var(--primary);
    outline: none;
  }
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: var(--primary);
  }

  span {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
}

// Modal
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 380px;
  padding: var(--spacing-2xl);
}

.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  border-radius: var(--radius-full);
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

.modal-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.modal-logo {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input {
  height: 44px;
  padding: 0 var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  border: 1.5px solid transparent;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:focus {
    background: var(--bg-primary);
    border-color: var(--primary);
  }
}

// Confirm Modal
.confirm-modal {
  width: 320px;
  padding: var(--spacing-xl);
}

.confirm-content {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.confirm-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.confirm-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.confirm-desc {
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
}

.confirm-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

// Modal Transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-content,
  .confirm-modal {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content,
  .confirm-modal {
    transform: scale(0.95);
  }
}

// 响应式
@media (max-width: 600px) {
  .user-card {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .user-info {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .order-item {
    grid-template-columns: 48px 1fr;
    gap: var(--spacing-sm);
  }

  .order-product {
    width: 48px;
    height: 48px;
  }

  .order-info {
    grid-column: 2;
  }

  .order-status {
    grid-column: 2;
    justify-self: start;
  }

  .order-price {
    grid-column: 2;
    text-align: left;
  }

  .order-meta {
    flex-direction: column;
    gap: 2px;
  }

  .modal-content {
    width: calc(100% - 32px);
    max-width: 380px;
    padding: var(--spacing-xl);
  }

  .confirm-modal {
    width: calc(100% - 32px);
    max-width: 320px;
  }
}
</style>
