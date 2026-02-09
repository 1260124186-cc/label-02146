<template>
  <div class="product-card card" @click="goToDetail">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" class="product-img" />
      <div v-if="product.tags?.length" class="product-badge">
        {{ product.tags[0] }}
      </div>
    </div>

    <div class="product-content">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-desc">{{ product.description }}</p>

      <div class="product-meta">
        <span class="meta-spec">{{ product.weight }}</span>
        <span class="meta-sales">已售 {{ formatSales(product.sales) }}</span>
        <span class="meta-rating">⭐ {{ product.rating }}</span>
      </div>

      <div class="product-footer">
        <div class="product-price">
          <span class="price-current">
            <span class="price-symbol">¥</span>
            <span class="price-value">{{ product.price }}</span>
          </span>
          <span v-if="product.originalPrice" class="price-original">
            ¥{{ product.originalPrice }}
          </span>
        </div>
        <button class="add-cart-btn" @click.stop="handleAdd">
          加入购物车
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const toastStore = useToastStore()
const userStore = useUserStore()

function goToDetail() {
  router.push(`/product/${props.product.id}`)
}

function handleAdd() {
  if (!userStore.isLoggedIn) {
    toastStore.warning('请先登录')
    router.push('/profile')
    return
  }

  cartStore.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    spec: props.product.specs?.[0] || props.product.weight,
    image: props.product.image
  })
  toastStore.success('已加入购物车')
}

function formatSales(sales) {
  if (sales >= 10000) {
    return (sales / 10000).toFixed(1) + '万'
  }
  if (sales >= 1000) {
    return (sales / 1000).toFixed(1) + 'k'
  }
  return sales
}
</script>

<style lang="scss" scoped>
.product-card {
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);

    .product-img {
      transform: scale(1.05);
    }
  }
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  background: var(--bg-secondary);
  overflow: hidden;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  background: var(--primary);
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-sm);
}

.product-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  min-height: 34px;
}

.product-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.meta-spec {
  padding: 2px 6px;
  background: var(--bg-tertiary);
  border-radius: 4px;
}

.meta-rating {
  color: #f59f00;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
  flex-shrink: 1;
}

.price-current {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
}

.price-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}

.price-original {
  font-size: 11px;
  color: var(--text-tertiary);
  text-decoration: line-through;
  white-space: nowrap;
}

.add-cart-btn {
  flex-shrink: 0;
  padding: 6px 12px;
  background: var(--primary);
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-md);
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-light);
  }

  &:active {
    transform: scale(0.96);
  }
}

// 响应式
@media (max-width: 1200px) {
  .product-content {
    padding: 10px;
  }

  .product-name {
    font-size: 13px;
  }

  .price-value {
    font-size: 16px;
  }

  .add-cart-btn {
    padding: 5px 10px;
    font-size: 11px;
  }
}

@media (max-width: 992px) {
  .product-meta {
    font-size: 10px;
  }

  .add-cart-btn {
    padding: 4px 8px;
  }
}
</style>
