import { defineStore } from 'pinia'
import { ref } from 'vue'

// 导入图片
import dandongImg from '@/img/dandong.webp'
import naiyouImg from '@/img/naiyou.webp'
import hongyanImg from '@/img/hongyan.webp'
import baixueImg from '@/img/baixue.webp'
import youjiImg from '@/img/youji.webp'

export const useProductStore = defineStore('product', () => {
  const products = ref([
    {
      id: 1,
      name: '丹东99草莓',
      description: '来自辽宁丹东的优质草莓，果肉饱满，香甜多汁，维生素C含量丰富',
      price: 39.9,
      originalPrice: 59.9,
      unit: '盒',
      weight: '300g/盒',
      specs: ['300g/盒', '500g/盒', '1kg/盒'],
      specPrices: { '300g/盒': 39.9, '500g/盒': 59.9, '1kg/盒': 99.9 },
      sales: 2856,
      rating: 4.9,
      stock: 100,
      tags: ['热销', '新鲜直达'],
      image: dandongImg,
      origin: '辽宁丹东',
      shelfLife: '冷藏3-5天'
    },
    {
      id: 2,
      name: '奶油草莓',
      description: '日本品种奶油草莓，口感细腻，奶香浓郁，入口即化',
      price: 49.9,
      originalPrice: 79.9,
      unit: '盒',
      weight: '250g/盒',
      specs: ['250g/盒', '500g/盒'],
      specPrices: { '250g/盒': 49.9, '500g/盒': 89.9 },
      sales: 1892,
      rating: 4.8,
      stock: 80,
      tags: ['精选', '限量'],
      image: naiyouImg,
      origin: '云南昆明',
      shelfLife: '冷藏3-5天'
    },
    {
      id: 3,
      name: '红颜草莓',
      description: '经典红颜品种，色泽鲜艳，甜度高，果香浓郁',
      price: 35.9,
      originalPrice: 49.9,
      unit: '盒',
      weight: '350g/盒',
      specs: ['350g/盒', '700g/盒'],
      specPrices: { '350g/盒': 35.9, '700g/盒': 65.9 },
      sales: 3421,
      rating: 4.7,
      stock: 150,
      tags: ['热销', '实惠'],
      image: hongyanImg,
      origin: '浙江建德',
      shelfLife: '冷藏3-5天'
    },
    {
      id: 4,
      name: '白雪公主草莓',
      description: '稀有白色草莓，外观独特，口感清甜，富含花青素',
      price: 89.9,
      originalPrice: 129.9,
      unit: '盒',
      weight: '200g/盒',
      specs: ['200g/盒', '400g/盒'],
      specPrices: { '200g/盒': 89.9, '400g/盒': 169.9 },
      sales: 856,
      rating: 4.9,
      stock: 30,
      tags: ['稀有', '限量'],
      image: baixueImg,
      origin: '日本进口',
      shelfLife: '冷藏2-3天'
    },
    {
      id: 5,
      name: '有机草莓',
      description: '有机认证草莓，无农药残留，天然健康，适合宝宝食用',
      price: 59.9,
      originalPrice: 89.9,
      unit: '盒',
      weight: '250g/盒',
      specs: ['250g/盒', '500g/盒'],
      specPrices: { '250g/盒': 59.9, '500g/盒': 109.9 },
      sales: 2134,
      rating: 4.9,
      stock: 45,
      tags: ['有机', '健康'],
      image: youjiImg,
      origin: '北京昌平',
      shelfLife: '冷藏3-5天'
    }
  ])

  const banners = ref([
    { id: 1, title: '新鲜草莓 限时特惠', subtitle: '满99减20', color: '#ff6b5b' },
    { id: 2, title: '丹东99草莓 产地直发', subtitle: '48小时新鲜送达', color: '#e74c3c' },
    { id: 3, title: '会员专享 8折优惠', subtitle: '注册即享', color: '#c0392b' }
  ])

  function getProductById(id) {
    return products.value.find(p => p.id === Number(id))
  }

  function getHotProducts() {
    return [...products.value].sort((a, b) => b.sales - a.sales).slice(0, 4)
  }

  return {
    products,
    banners,
    getProductById,
    getHotProducts
  }
})
