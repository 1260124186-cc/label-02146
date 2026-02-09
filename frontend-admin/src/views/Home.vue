<template>
  <div class="home-page">
    <!-- 轮播图区域 -->
    <section class="banner-section">
      <div class="banner-wrapper">
        <div
          class="banner-slide"
          :style="{ background: `linear-gradient(135deg, ${banners[currentBanner].color} 0%, ${banners[currentBanner].colorEnd} 100%)` }"
        >
          <!-- 左侧内容 -->
          <div class="banner-content">
            <span class="banner-tag">限时特惠</span>
            <h2 class="banner-title">{{ banners[currentBanner].title }}</h2>
            <p class="banner-desc">{{ banners[currentBanner].subtitle }}</p>

            <!-- 轮播控制 -->
            <div class="banner-controls">
              <button class="control-btn" @click="prevBanner">‹</button>
              <div class="banner-dots">
                <span
                  v-for="(_, index) in banners"
                  :key="index"
                  class="dot"
                  :class="{ active: currentBanner === index }"
                  @click="currentBanner = index"
                />
              </div>
              <button class="control-btn" @click="nextBanner">›</button>
            </div>
          </div>

          <!-- 右侧草莓图片和按钮 -->
          <div class="banner-right">
            <div class="banner-emoji">🍓</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热销推荐 -->
    <section class="product-section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-icon">🔥</span>
          <h2>热销推荐</h2>
        </div>
      </div>
      <div class="product-grid">
        <ProductCard
          v-for="product in hotProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- 全部商品 -->
    <section class="product-section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-icon">🍓</span>
          <h2>精选好货</h2>
        </div>
      </div>
      <div class="product-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductCard from '@/components/common/ProductCard.vue'

const productStore = useProductStore()

const banners = ref([
  { id: 1, title: '新鲜草莓 限时特惠', subtitle: '精选丹东99草莓，产地直发，48小时新鲜送达', color: '#f56c6c', colorEnd: '#f78989' },
  { id: 2, title: '会员专享 8折起', subtitle: '注册即享超值优惠，更多会员权益等你来', color: '#e74c3c', colorEnd: '#ec7063' },
  { id: 3, title: '满99减20', subtitle: '新人首单专享，优质草莓等你来尝', color: '#c0392b', colorEnd: '#e74c3c' }
])

const products = productStore.products
const hotProducts = productStore.getHotProducts()
const currentBanner = ref(0)

let bannerTimer = null

function prevBanner() {
  currentBanner.value = (currentBanner.value - 1 + banners.value.length) % banners.value.length
}

function nextBanner() {
  currentBanner.value = (currentBanner.value + 1) % banners.value.length
}

function startBannerTimer() {
  bannerTimer = setInterval(() => {
    nextBanner()
  }, 5000)
}

onMounted(() => {
  startBannerTimer()
})

onUnmounted(() => {
  if (bannerTimer) clearInterval(bannerTimer)
})
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

// Banner Section
.banner-section {
  margin-bottom: var(--spacing-xl);
}

.banner-wrapper {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.banner-slide {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  padding: 0 48px;
  overflow: hidden;
}

.banner-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 500px;
}

.banner-tag {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--spacing-lg);
  backdrop-filter: blur(4px);
}

.banner-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

.banner-desc {
  font-size: var(--font-size-md);
  opacity: 0.9;
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.banner-right {
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  z-index: 2;
}

.banner-emoji {
  font-size: 120px;
  line-height: 1;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
}

.banner-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.control-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 18px;
  font-weight: 300;
  border-radius: var(--radius-full);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
}

.banner-dots {
  display: flex;
  gap: 6px;
  padding: 0 var(--spacing-sm);
}

.dot {
  width: 24px;
  height: 4px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background: white;
    width: 32px;
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.6);
  }
}

// Product Section
.product-section {
  margin-bottom: var(--spacing-xl);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  h2 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
  }
}

.title-icon {
  font-size: 24px;
}

.section-more {
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

// 响应式
@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .banner-slide {
    height: 240px;
    padding: 0 32px;
  }

  .banner-title {
    font-size: 28px;
  }

  .banner-right {
    right: 32px;
  }

  .banner-emoji {
    font-size: 80px;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .banner-slide {
    height: 200px;
    padding: 0 24px;
  }

  .banner-title {
    font-size: 24px;
  }

  .banner-desc {
    font-size: 13px;
  }

  .banner-right {
    right: 16px;
    gap: var(--spacing-sm);
  }

  .banner-emoji {
    font-size: 56px;
  }

  .banner-btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-sm);
  }
}
</style>
