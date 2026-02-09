import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const selectedItems = computed(() =>
    items.value.filter(item => item.selected)
  )

  const selectedTotalPrice = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const selectedCount = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const isAllSelected = computed(() =>
    items.value.length > 0 && items.value.every(item => item.selected)
  )

  function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function addItem(product, quantity = 1) {
    const existingItem = items.value.find(
      item => item.id === product.id && item.spec === product.spec
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        ...product,
        quantity,
        selected: true
      })
    }
    saveToStorage()
  }

  function removeItem(id, spec) {
    const index = items.value.findIndex(
      item => item.id === id && item.spec === spec
    )
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function updateQuantity(id, spec, quantity) {
    const item = items.value.find(
      item => item.id === id && item.spec === spec
    )
    if (item) {
      item.quantity = Math.max(1, quantity)
      saveToStorage()
    }
  }

  function toggleSelect(id, spec) {
    const item = items.value.find(
      item => item.id === id && item.spec === spec
    )
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }

  function toggleSelectAll() {
    const newValue = !isAllSelected.value
    items.value.forEach(item => {
      item.selected = newValue
    })
    saveToStorage()
  }

  function clearCart() {
    items.value = []
    saveToStorage()
  }

  function clearSelected() {
    items.value = items.value.filter(item => !item.selected)
    saveToStorage()
  }

  function selectOnly(id, spec) {
    items.value.forEach(item => {
      item.selected = (item.id === id && item.spec === spec)
    })
    saveToStorage()
  }

  return {
    items,
    totalCount,
    totalPrice,
    selectedItems,
    selectedTotalPrice,
    selectedCount,
    isAllSelected,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    clearCart,
    clearSelected,
    selectOnly
  }
})
