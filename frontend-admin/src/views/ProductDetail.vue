<template>
  <div class="detail-page" v-if="product">
    <!-- 上半部分：图片 + 购买信息 -->
    <div class="detail-top">
      <!-- 左侧：商品图片 -->
      <div class="detail-left">
        <div class="gallery-main card">
          <img :src="product.image" :alt="product.name" class="gallery-img" />
        </div>
      </div>

      <!-- 右侧：商品信息 -->
      <div class="detail-right">
        <div class="info-card card">
          <div v-if="product.tags?.length" class="product-tags">
            <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-desc">{{ product.description }}</p>

          <!-- 价格区域 -->
          <div class="price-box">
            <div class="price-row">
              <span class="price-label">价格</span>
              <div class="price-main">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ currentPrice }}</span>
                <span v-if="product.originalPrice" class="price-original">¥{{ product.originalPrice }}</span>
              </div>
            </div>
            <div class="price-meta">
              <span>⭐ {{ product.rating }} 好评</span>
              <span class="divider">|</span>
              <span>已售 {{ product.sales }} 件</span>
            </div>
          </div>

          <!-- 规格 -->
          <div class="spec-row">
            <span class="row-label">规格</span>
            <div class="spec-list">
              <button
                v-for="spec in product.specs"
                :key="spec"
                class="spec-btn"
                :class="{ active: selectedSpec === spec }"
                @click="selectedSpec = spec"
              >
                {{ spec }}
              </button>
            </div>
          </div>

          <!-- 数量 -->
          <div class="quantity-row">
            <span class="row-label">数量</span>
            <div class="quantity-box">
              <Stepper v-model="quantity" :max="product.stock" />
              <span class="stock-text">库存 {{ product.stock }} 件</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-row">
            <Button type="outline" size="large" @click="addToCart">
              <Icon name="shopping-cart" :size="18" />
              加入购物车
            </Button>
            <Button type="primary" size="large" @click="buyNow">
              立即购买
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 下半部分：商品详情（全宽） -->
    <div class="detail-bottom">
      <div class="detail-card card">
        <h3 class="card-title">商品信息</h3>
        <div class="info-table">
          <div class="info-row">
            <span class="info-label">产地</span>
            <span class="info-value">{{ product.origin }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">规格</span>
            <span class="info-value">{{ product.weight }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">保质期</span>
            <span class="info-value">{{ product.shelfLife }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">配送</span>
            <span class="info-value">顺丰冷链</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 商品不存在 -->
  <div v-else class="empty-state card">
    <span class="empty-icon">📦</span>
    <p class="empty-title">商品不存在</p>
    <Button type="primary" @click="$router.push('/')">返回首页</Button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'
import Stepper from '@/components/common/Stepper.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const toastStore = useToastStore()
const userStore = useUserStore()

const product = computed(() => productStore.getProductById(route.params.id))
const selectedSpec = ref('')
const quantity = ref(1)

const currentPrice = computed(() => {
  if (product.value?.specPrices && selectedSpec.value) {
    return product.value.specPrices[selectedSpec.value] || product.value.price
  }
  return product.value?.price || 0
})

watch(product, (newProduct) => {
  if (newProduct?.specs?.length) {
    selectedSpec.value = newProduct.specs[0]
  }
}, { immediate: true })

function addToCart() {
  if (!product.value) return

  if (!userStore.isLoggedIn) {
    toastStore.warning('请先登录')
    router.push('/profile')
    return
  }

  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: currentPrice.value,
    spec: selectedSpec.value,
    image: product.value.image
  }, quantity.value)

  toastStore.success('已加入购物车')
}

function buyNow() {
  if (!product.value) return

  if (!userStore.isLoggedIn) {
    toastStore.warning('请先登录')
    router.push('/profile')
    return
  }

  // 直接添加到购物车并选中
  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: currentPrice.value,
    spec: selectedSpec.value,
    image: product.value.image
  }, quantity.value)

  // 选中刚添加的商品
  cartStore.selectOnly(product.value.id, selectedSpec.value)

  // 跳转到购物车页面
  router.push('/cart')
}
</script>

<style lang="scss" scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

// 上半部分布局
.detail-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: stretch;
  margin-bottom: var(--spacing-xl);
}

// 左侧图片区
.detail-left {
  display: flex;
}

.gallery-main {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 右侧信息区
.detail-right {
  display: flex;
}

.info-card {
  flex: 1;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
}

.product-tags {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.tag {
  padding: 4px 12px;
  background: var(--primary-bg);
  color: var(--primary);
  font-size: var(--font-size-xs);
  font-weight: 500;
  border-radius: var(--radius-sm);
}

.product-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.product-desc {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

// 价格区域
.price-box {
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #fff5f5 0%, #ffecec 100%);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
}

.price-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.price-main {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary);
}

.price-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.price-original {
  margin-left: var(--spacing-sm);
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
  text-decoration: line-through;
}

.price-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);

  .divider {
    color: var(--border-color);
  }
}

// 规格行
.spec-row,
.quantity-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xl);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-light);
}

.row-label {
  width: 48px;
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
  padding-top: var(--spacing-sm);
  flex-shrink: 0;
}

.spec-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.spec-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  border-radius: var(--radius-md);
  border: 1.5px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &.active {
    background: var(--primary-bg);
    border-color: var(--primary);
    color: var(--primary);
    font-weight: 500;
  }
}

.quantity-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stock-text {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

// 操作按钮
.action-row {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  margin-top: auto;
}

// 下半部分：商品详情（全宽）
.detail-bottom {
  width: 100%;
}

.detail-card {
  padding: var(--spacing-xl);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.info-table {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.info-row {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) 0;
}

.info-label {
  width: 60px;
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.info-value {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

// 空状态
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
  margin-bottom: var(--spacing-xl);
}

// 响应式
@media (max-width: 900px) {
  .detail-top {
    grid-template-columns: 1fr;
  }

  .gallery-main {
    aspect-ratio: 4/3;
  }

  .price-value {
    font-size: 28px;
  }

  .info-table {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .info-card,
  .detail-card {
    padding: var(--spacing-md);
  }

  .product-title {
    font-size: var(--font-size-xl);
  }

  .price-box {
    padding: var(--spacing-md);
  }

  .price-value {
    font-size: 24px;
  }

  .spec-row,
  .quantity-row {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .row-label {
    width: auto;
    padding-top: 0;
  }

  .action-row {
    flex-direction: column;

    :deep(.btn) {
      width: 100%;
    }
  }
}
</style>
