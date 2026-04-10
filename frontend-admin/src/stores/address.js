import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAddressStore = defineStore('address', () => {
  const addresses = ref(JSON.parse(localStorage.getItem('addresses') || '[]'))

  const defaultAddress = computed(() => {
    return addresses.value.find(addr => addr.isDefault) || null
  })

  function saveToStorage() {
    localStorage.setItem('addresses', JSON.stringify(addresses.value))
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  function addAddress(address) {
    const newAddress = {
      id: generateId(),
      ...address
    }

    if (address.isDefault) {
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
    if (index !== -1) {
      if (addressData.isDefault) {
        addresses.value.forEach(addr => {
          addr.isDefault = false
        })
      }

      addresses.value[index] = {
        ...addresses.value[index],
        ...addressData
      }
      saveToStorage()
      return true
    }
    return false
  }

  function deleteAddress(id) {
    const index = addresses.value.findIndex(addr => addr.id === id)
    if (index !== -1) {
      addresses.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  function setDefault(id) {
    addresses.value.forEach(addr => {
      addr.isDefault = addr.id === id
    })
    saveToStorage()
  }

  function getAddressById(id) {
    return addresses.value.find(addr => addr.id === id)
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
