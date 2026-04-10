import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAddressStore = defineStore('address', () => {
  const addresses = ref(JSON.parse(localStorage.getItem('addresses') || '[]'))

  const defaultAddress = computed(() => {
    return addresses.value.find(addr => addr.isDefault) || addresses.value[0] || null
  })

  function saveToStorage() {
    localStorage.setItem('addresses', JSON.stringify(addresses.value))
  }

  function generateId() {
    return `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function addAddress(addressData) {
    const newAddress = {
      id: generateId(),
      ...addressData,
      createTime: new Date().toISOString()
    }

    if (newAddress.isDefault) {
      addresses.value.forEach(addr => {
        addr.isDefault = false
      })
    }

    addresses.value.push(newAddress)
    saveToStorage()
    return newAddress
  }

  function updateAddress(id, addressData) {
    const index = addresses.value.findIndex(addr => addr.id === id)
    if (index === -1) return null

    if (addressData.isDefault) {
      addresses.value.forEach(addr => {
        if (addr.id !== id) {
          addr.isDefault = false
        }
      })
    }

    addresses.value[index] = {
      ...addresses.value[index],
      ...addressData,
      updateTime: new Date().toISOString()
    }
    saveToStorage()
    return addresses.value[index]
  }

  function deleteAddress(id) {
    const index = addresses.value.findIndex(addr => addr.id === id)
    if (index === -1) return false

    addresses.value.splice(index, 1)
    saveToStorage()
    return true
  }

  function setDefaultAddress(id) {
    const address = addresses.value.find(addr => addr.id === id)
    if (!address) return false

    addresses.value.forEach(addr => {
      addr.isDefault = addr.id === id
    })
    saveToStorage()
    return true
  }

  function getAddressById(id) {
    return addresses.value.find(addr => addr.id === id) || null
  }

  function clearAddresses() {
    addresses.value = []
    saveToStorage()
  }

  return {
    addresses,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAddressById,
    clearAddresses
  }
})
