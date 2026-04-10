import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orders = ref(JSON.parse(localStorage.getItem('orders') || '[]'))

  // 订单统计
  const orderStats = computed(() => {
    const stats = {
      pending: 0,   // 待付款
      shipped: 0,   // 待收货
      review: 0,    // 待评价
      refund: 0     // 售后
    }
    orders.value.forEach(order => {
      if (order.status === 'pending') stats.pending++
      else if (order.status === 'shipping') stats.shipped++
      else if (order.status === 'completed' && !order.reviewed) stats.review++
      else if (order.status === 'refund') stats.refund++
    })
    return stats
  })

  // 最近订单（最新5条）
  const recentOrders = computed(() => {
    return [...orders.value]
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      .slice(0, 5)
  })

  function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  // 生成订单号
  function generateOrderId() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    return `${year}${month}${day}${random}`
  }

  // 创建订单
  function createOrder(items, address) {
    const newOrders = items.map(item => ({
      id: generateOrderId(),
      productName: item.name,
      spec: item.spec,
      quantity: item.quantity,
      totalPrice: (item.price * item.quantity).toFixed(2),
      status: 'pending',
      statusText: '待付款',
      reviewed: false,
      address: address ? {
        receiver: address.receiver,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detail
      } : null,
      createTime: new Date().toISOString()
    }))

    orders.value.unshift(...newOrders)
    saveToStorage()
    return newOrders
  }

  // 支付订单：待付款 -> 配送中
  function payOrder(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === 'pending') {
      order.status = 'shipping'
      order.statusText = '配送中'
      saveToStorage()
      return true
    }
    return false
  }

  // 确认收货：配送中 -> 已完成
  function confirmReceive(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === 'shipping') {
      order.status = 'completed'
      order.statusText = '已完成'
      saveToStorage()
      return true
    }
    return false
  }

  // 评价订单：标记为已评价
  function reviewOrder(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === 'completed' && !order.reviewed) {
      order.reviewed = true
      saveToStorage()
      return true
    }
    return false
  }

  // 清空订单（退出登录时）
  function clearOrders() {
    orders.value = []
    saveToStorage()
  }

  return {
    orders,
    orderStats,
    recentOrders,
    createOrder,
    payOrder,
    confirmReceive,
    reviewOrder,
    clearOrders
  }
})
