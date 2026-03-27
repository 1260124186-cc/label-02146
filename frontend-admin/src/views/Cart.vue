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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'
import Stepper from '@/components/common/Stepper.vue'

const router = useRouter()
const cartStore = useCartStore()
const toastStore = useToastStore()
const userStore = useUserStore()
const orderStore = useOrderStore()

const isCheckingOut = ref(false)
const showDeleteDialog = ref(false)
const itemToDelete = ref(null)

function goToProduct(id) {
  router.push(`/product/${id}`)
}

function handleDelete(item) {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

function confirmDelete() {
  if (itemToDelete.value) {
    cartStore.removeItem(itemToDelete.value.id, itemToDelete.value.spec)
    toastStore.success('已移除商品')
    closeDeleteDialog()
  }
}

function closeDeleteDialog() {
  showDeleteDialog.value = false
  itemToDelete.value = null
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

  isCheckingOut.value = true

  setTimeout(() => {
    isCheckingOut.value = false
    // 创建订单
    orderStore.createOrder(cartStore.selectedItems)
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

// Delete Confirmation Dialog
.delete-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-dialog {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  min-width: 360px;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.dialog-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.dialog-content {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.5;

  strong {
    color: var(--text-primary);
  }
}

.dialog-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
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
