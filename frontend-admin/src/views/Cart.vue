<template>
  <div class="cart-page">
    <div class="page-header">
      <h1 class="page-title">🛒 购物车</h1>
      <span class="item-count" v-if="cartStore.items.length">
        共 {{ cartStore.items.length }} 件商品
      </span>
    </div>

    <!-- 空购物车 -->
    <div v-if="cartStore.items.length === 0" class="empty-state card">
      <span class="empty-icon">🛒</span>
      <p class="empty-title">购物车是空的</p>
      <p class="empty-desc">快去挑选心仪的草莓吧~</p>
      <Button type="primary" @click="$router.push('/')">去逛逛</Button>
    </div>

    <!-- 购物车内容 -->
    <div v-else class="cart-layout">
      <!-- 商品列表 -->
      <div class="cart-main">
        <div class="cart-list card">
          <table class="cart-table">
            <thead>
              <tr class="cart-header">
                <th class="col-check">
                  <div class="check-cell">
                    <div
                      class="checkbox"
                      :class="{ checked: cartStore.isAllSelected }"
                      @click="cartStore.toggleSelectAll"
                    >
                      <Icon v-if="cartStore.isAllSelected" name="check" :size="12" />
                    </div>
                    <span>全选</span>
                  </div>
                </th>
                <th class="col-product">商品信息</th>
                <th class="col-price">单价</th>
                <th class="col-quantity">数量</th>
                <th class="col-total">小计</th>
                <th class="col-action">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in cartStore.items"
                :key="`${item.id}-${item.spec}`"
                class="cart-item"
              >
                <td class="col-check">
                  <div
                    class="checkbox"
                    :class="{ checked: item.selected }"
                    @click="cartStore.toggleSelect(item.id, item.spec)"
                  >
                    <Icon v-if="item.selected" name="check" :size="12" />
                  </div>
                </td>

                <td class="col-product">
                  <div class="product-cell">
                    <div class="product-image" @click="goToProduct(item.id)">
                      <img :src="item.image" :alt="item.name" class="product-img" />
                    </div>
                    <div class="product-info">
                      <h3 class="product-name" @click="goToProduct(item.id)">{{ item.name }}</h3>
                      <span class="product-spec">{{ item.spec }}</span>
                    </div>
                  </div>
                </td>

                <td class="col-price">
                  <span class="price">¥{{ item.price }}</span>
                </td>

                <td class="col-quantity">
                  <Stepper
                    :model-value="item.quantity"
                    @update:model-value="(val) => cartStore.updateQuantity(item.id, item.spec, val)"
                  />
                </td>

                <td class="col-total">
                  <span class="total-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
                </td>

                <td class="col-action">
                  <button class="delete-btn" @click="handleDelete(item)">
                    <Icon name="trash" :size="16" />
                    <span>删除</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 结算栏 -->
      <div class="cart-sidebar">
        <div class="summary-card card">
          <h3 class="summary-title">订单摘要</h3>

          <div class="summary-row">
            <span class="summary-label">已选商品</span>
            <span class="summary-value">{{ cartStore.selectedCount }} 件</span>
          </div>

          <div class="summary-row">
            <span class="summary-label">商品金额</span>
            <span class="summary-value">¥{{ cartStore.selectedTotalPrice.toFixed(2) }}</span>
          </div>

          <div class="summary-row">
            <span class="summary-label">运费</span>
            <span class="summary-value free">免运费</span>
          </div>

          <!-- 收货地址 -->
          <div class="address-section" @click="showAddressSelector = true">
            <div class="summary-row address-header">
              <span class="summary-label">收货地址</span>
              <span class="address-change">更换</span>
            </div>
            <div v-if="selectedAddress" class="address-info">
              <div class="address-name-phone">
                <span class="address-name">{{ selectedAddress.name }}</span>
                <span class="address-phone">{{ selectedAddress.phone }}</span>
                <span v-if="selectedAddress.isDefault" class="default-badge">默认</span>
              </div>
              <div class="address-detail">
                {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}
              </div>
            </div>
            <div v-else class="address-empty">
              <span>请选择收货地址</span>
              <Icon name="chevron-right" :size="16" />
            </div>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-total">
            <span class="total-label">应付金额</span>
            <span class="total-value">¥{{ cartStore.selectedTotalPrice.toFixed(2) }}</span>
          </div>

          <Button
            type="primary"
            size="large"
            block
            :disabled="cartStore.selectedCount === 0"
            :loading="isCheckingOut"
            @click="handleCheckout"
          >
            去结算
          </Button>

          <p class="summary-tip">支持顺丰冷链配送，全程保鲜</p>
        </div>
      </div>
    </div>

    <!-- 地址选择弹窗 -->
    <Transition name="fade">
      <div v-if="showAddressSelector" class="modal-overlay" @click.self="showAddressSelector = false">
        <div class="modal-content address-selector-modal">
          <div class="modal-header">
            <h3 class="modal-title">选择收货地址</h3>
            <button class="modal-close" @click="showAddressSelector = false">
              <Icon name="x" :size="20" />
            </button>
          </div>
          <div class="modal-body">
            <div v-if="addressStore.addresses.length > 0" class="address-list">
              <div
                v-for="address in addressStore.addresses"
                :key="address.id"
                class="address-item"
                :class="{ selected: selectedAddress && selectedAddress.id === address.id }"
                @click="selectAddress(address)"
              >
                <div class="address-name-phone">
                  <span class="address-name">{{ address.name }}</span>
                  <span class="address-phone">{{ address.phone }}</span>
                  <span v-if="address.isDefault" class="default-badge">默认</span>
                </div>
                <div class="address-detail">
                  {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
                </div>
                <div class="address-check" v-if="selectedAddress && selectedAddress.id === address.id">
                  <Icon name="check" :size="16" />
                </div>
              </div>
            </div>
            <div v-else class="empty-address">
              <p>暂无收货地址</p>
              <Button type="primary" @click="goToManageAddress">去管理地址</Button>
            </div>
          </div>
          <div class="modal-footer">
            <Button type="default" @click="goToManageAddress">管理收货地址</Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'
import { useAddressStore } from '@/stores/address'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'
import Stepper from '@/components/common/Stepper.vue'

const router = useRouter()
const cartStore = useCartStore()
const toastStore = useToastStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const addressStore = useAddressStore()

const isCheckingOut = ref(false)
const selectedAddressId = ref(null)
const showAddressSelector = ref(false)

const selectedAddress = computed(() => {
  if (selectedAddressId.value) {
    return addressStore.getAddressById(selectedAddressId.value)
  }
  return addressStore.defaultAddress
})

function goToProduct(id) {
  router.push(`/product/${id}`)
}

function handleDelete(item) {
  cartStore.removeItem(item.id, item.spec)
  toastStore.success('已移除商品')
}

function selectAddress(address) {
  selectedAddressId.value = address.id
  showAddressSelector.value = false
}

function goToManageAddress() {
  showAddressSelector.value = false
  router.push('/profile')
  setTimeout(() => {
    const addressSection = document.getElementById('address-section')
    if (addressSection) {
      addressSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

function handleCheckout() {
  if (!userStore.isLoggedIn) {
    toastStore.warning('请先登录')
    router.push('/profile')
    return
  }

  if (cartStore.selectedCount === 0) {
    toastStore.warning('请选择要结算的商品')
    return
  }

  if (addressStore.addresses.length === 0) {
    toastStore.warning('请先添加收货地址')
    showAddressSelector.value = true
    return
  }

  if (!selectedAddress.value) {
    toastStore.warning('请选择收货地址')
    showAddressSelector.value = true
    return
  }

  isCheckingOut.value = true

  setTimeout(() => {
    isCheckingOut.value = false
    // 创建订单并关联地址信息
    orderStore.createOrder(cartStore.selectedItems, selectedAddress.value)
    cartStore.clearSelected()
    toastStore.success('下单成功！')
  }, 1500)
}
</script>

<style lang="scss" scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
}

.item-count {
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
}

// Empty State
.empty-state {
  max-width: 400px;
  margin: var(--spacing-3xl) auto;
  padding: var(--spacing-3xl);
  text-align: center;
}

.empty-icon {
  font-size: 72px;
  display: block;
  margin-bottom: var(--spacing-lg);
}

.empty-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-desc {
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xl);
}

// Cart Layout
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-lg);
  align-items: start;
}

// Cart List
.cart-list {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.cart-table {
  width: 100%;
  min-width: 750px;
  border-collapse: collapse;
}

.cart-header {
  background: var(--bg-secondary);

  th {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-sm);
    color: var(--text-tertiary);
    font-weight: 500;
    text-align: left;
    white-space: nowrap;

    &:first-child {
      padding-left: var(--spacing-lg);
    }

    &:last-child {
      padding-right: var(--spacing-lg);
    }
  }
}

.check-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.col-check {
  width: 80px;
}

.col-product {
  min-width: 200px;
}

.col-price {
  width: 100px;
}

.col-quantity {
  width: 120px;
}

.col-total {
  width: 100px;
}

.col-action {
  width: 80px;
}

.checkbox {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-xs);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
  }

  &.checked {
    background: var(--primary);
    border-color: var(--primary);
  }
}

.cart-item {
  td {
    padding: var(--spacing-lg);
    vertical-align: middle;
    border-bottom: 1px solid var(--border-light);

    &:first-child {
      padding-left: var(--spacing-lg);
    }

    &:last-child {
      padding-right: var(--spacing-lg);
    }
  }

  &:last-child td {
    border-bottom: none;
  }
}

.product-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
}

.product-spec {
  display: inline-block;
  padding: 2px 8px;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-xs);
}

.price {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}

.total-price {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary);
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: var(--error-bg);
    color: var(--error);
  }
}

// Summary Card
.summary-card {
  padding: var(--spacing-xl);
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-lg));
}

.summary-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.summary-label {
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
}

.summary-value {
  font-size: var(--font-size-md);
  color: var(--text-primary);

  &.free {
    color: var(--success);
  }
}

.summary-divider {
  height: 1px;
  background: var(--border-light);
  margin: var(--spacing-lg) 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--spacing-xl);
}

.total-label {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.total-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--primary);
}

.summary-tip {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  text-align: center;
}

// 地址选择
.address-section {
  padding: var(--spacing-sm);
  margin: 0 calc(-1 * var(--spacing-sm));
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
  }
}

.address-header {
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.address-change {
  color: var(--primary);
  font-size: var(--font-size-sm);
}

.address-info {
  .address-name-phone {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
  }

  .address-name {
    font-weight: 500;
    color: var(--text-primary);
  }

  .address-phone {
    color: var(--text-secondary);
  }

  .address-detail {
    font-size: var(--font-size-sm);
    color: var(--text-tertiary);
    line-height: 1.4;
  }
}

.address-empty {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-tertiary);
}

// 地址选择弹窗
.address-selector-modal {
  max-width: 500px;
  width: 90%;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.address-item {
  position: relative;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
  }

  &.selected {
    border-color: var(--primary);
    background: var(--primary-bg);
  }

  .address-check {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    color: var(--primary);
  }
}

.empty-address {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-tertiary);

  p {
    margin-bottom: var(--spacing-lg);
  }
}

.modal-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

// 响应式 - 1400px以下改为上下布局
@media (max-width: 1400px) {
  .cart-layout {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .cart-main {
    width: 100%;
    order: 1;
  }

  .cart-sidebar {
    width: 100%;
    order: 2;
  }

  .summary-card {
    position: static;
    max-width: 100%;
  }
}

// 响应式 - 900px以下表格横向滚动
@media (max-width: 900px) {
  .cart-table {
    min-width: 700px;
  }
}

// 响应式 - 768px以下调整列宽
@media (max-width: 768px) {
  .cart-table {
    min-width: 650px;
  }

  .cart-header th {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .cart-item td {
    padding: var(--spacing-md);
  }

  .product-image {
    width: 60px;
    height: 60px;
  }
}

// 响应式 - 600px以下简化为卡片布局
@media (max-width: 600px) {
  .cart-list {
    overflow-x: visible;
  }

  .cart-table {
    min-width: auto;
    display: block;
  }

  .cart-table thead {
    display: none;
  }

  .cart-table tbody {
    display: block;
  }

  .cart-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-light);

    td {
      display: block;
      padding: 0;
      border: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .col-check {
    width: auto;
    flex: 0 0 auto;
  }

  .col-product {
    flex: 1 1 calc(100% - 40px);
    min-width: 0;
  }

  .product-image {
    width: 56px;
    height: 56px;
  }

  .col-price {
    display: none;
  }

  .col-quantity {
    width: auto;
    flex: 0 0 auto;
    margin-left: 28px;
  }

  .col-total {
    width: auto;
    flex: 1 1 auto;
    text-align: left;
  }

  .col-action {
    width: auto;
    flex: 0 0 auto;
  }

  .delete-btn {
    padding: var(--spacing-xs);

    span {
      display: none;
    }
  }

  .summary-card {
    padding: var(--spacing-md);
  }

  .summary-title {
    font-size: var(--font-size-md);
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
  }

  .summary-row {
    margin-bottom: var(--spacing-sm);
  }

  .summary-label,
  .summary-value {
    font-size: var(--font-size-sm);
  }

  .total-value {
    font-size: var(--font-size-xl);
  }
}
</style>
