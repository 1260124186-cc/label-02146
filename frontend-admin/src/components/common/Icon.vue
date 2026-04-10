<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <component :is="iconComponent" />
  </svg>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 24
  }
})

const icons = {
  home: () => [
    h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
    h('polyline', { points: '9 22 9 12 15 12 15 22' })
  ],
  'shopping-cart': () => [
    h('circle', { cx: '9', cy: '21', r: '1' }),
    h('circle', { cx: '20', cy: '21', r: '1' }),
    h('path', { d: 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' })
  ],
  user: () => [
    h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
    h('circle', { cx: '12', cy: '7', r: '4' })
  ],
  search: () => [
    h('circle', { cx: '11', cy: '11', r: '8' }),
    h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
  ],
  'chevron-left': () => [
    h('polyline', { points: '15 18 9 12 15 6' })
  ],
  'chevron-right': () => [
    h('polyline', { points: '9 18 15 12 9 6' })
  ],
  plus: () => [
    h('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
    h('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
  ],
  minus: () => [
    h('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
  ],
  trash: () => [
    h('polyline', { points: '3 6 5 6 21 6' }),
    h('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' })
  ],
  'log-out': () => [
    h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
    h('polyline', { points: '16 17 21 12 16 7' }),
    h('line', { x1: '21', y1: '12', x2: '9', y2: '12' })
  ],
  check: () => [
    h('polyline', { points: '20 6 9 17 4 12' })
  ],
  x: () => [
    h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
    h('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
  ],
  menu: () => [
    h('line', { x1: '3', y1: '6', x2: '21', y2: '6' }),
    h('line', { x1: '3', y1: '12', x2: '21', y2: '12' }),
    h('line', { x1: '3', y1: '18', x2: '21', y2: '18' })
  ],
  'map-pin': () => [
    h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
    h('circle', { cx: '12', cy: '10', r: '3' })
  ]
}

const iconComponent = computed(() => {
  const iconFn = icons[props.name]
  return iconFn ? { render: iconFn } : { render: () => null }
})
</script>

<style lang="scss" scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
