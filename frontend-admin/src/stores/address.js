import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAddressStore = defineStore('address', () => {
  const STORAGE_KEY = 'addresses'
  const addresses = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses.value))
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const defaultAddress = computed(() => {
    return addresses.value.find(addr => addr.isDefault) || addresses.value[0] || null
  })

  function addAddress(addressData) {
    const newAddress = {
      id: generateId(),
      ...addressData,
      createTime: new Date().toISOString()
    }

    if (addresses.value.length === 0 || newAddress.isDefault) {
      addresses.value.forEach(addr => addr.isDefault = false)
      newAddress.isDefault = true
    }

    addresses.value.push(newAddress)
    saveToStorage()
    return newAddress
  }

  function updateAddress(id, addressData) {
    const index = addresses.value.findIndex(addr => addr.id === id)
    if (index !== -1) {
      if (addressData.isDefault) {
        addresses.value.forEach(addr => addr.isDefault = false)
      }

      addresses.value[index] = {
        ...addresses.value[index],
        ...addressData
      }

      if (addressData.isDefault === false && addresses.value.filter(a => a.isDefault).length === 0) {
        addresses.value[0].isDefault = true
      }

      saveToStorage()
      return true
    }
    return false
  }

  function deleteAddress(id) {
    const index = addresses.value.findIndex(addr => addr.id === id)
    if (index !== -1) {
      const wasDefault = addresses.value[index].isDefault
      addresses.value.splice(index, 1)

      if (wasDefault && addresses.value.length > 0) {
        addresses.value[0].isDefault = true
      }

      saveToStorage()
      return true
    }
    return false
  }

  function setDefault(id) {
    const addr = addresses.value.find(a => a.id === id)
    if (addr) {
      addresses.value.forEach(a => a.isDefault = false)
      addr.isDefault = true
      saveToStorage()
      return true
    }
    return false
  }

  function getAddressById(id) {
    return addresses.value.find(addr => addr.id === id) || null
  }

  return {
    addresses,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    getAddressById
  }
})
