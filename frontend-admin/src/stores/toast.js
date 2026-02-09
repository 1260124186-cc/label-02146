import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const visible = ref(false)
  const message = ref('')
  const type = ref('info') // success, error, warning, info
  const duration = ref(2000)

  let timer = null

  function show(msg, options = {}) {
    if (timer) {
      clearTimeout(timer)
    }

    message.value = msg
    type.value = options.type || 'info'
    duration.value = options.duration || 2000
    visible.value = true

    timer = setTimeout(() => {
      hide()
    }, duration.value)
  }

  function hide() {
    visible.value = false
    message.value = ''
  }

  function success(msg, options = {}) {
    show(msg, { ...options, type: 'success' })
  }

  function error(msg, options = {}) {
    show(msg, { ...options, type: 'error' })
  }

  function warning(msg, options = {}) {
    show(msg, { ...options, type: 'warning' })
  }

  function info(msg, options = {}) {
    show(msg, { ...options, type: 'info' })
  }

  return {
    visible,
    message,
    type,
    show,
    hide,
    success,
    error,
    warning,
    info
  }
})
