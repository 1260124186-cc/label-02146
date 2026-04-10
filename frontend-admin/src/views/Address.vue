<template>
  <div class="address-page">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <Icon name="arrow-left" :size="20" />
      </button>
      <h1 class="page-title">收货地址</h1>
      <span class="address-count">{{ addressStore.addresses.length }}个地址</span>
    </div>

    <!-- 地址列表 -->
    <div v-if="addressStore.addresses.length > 0" class="address-list">
      <div
        v-for="address in addressStore.addresses"
        :key="address.id"
        class="address-card card"
        :class="{ 'is-default': address.isDefault }"
      >
        <div class="address-header">
          <div class="address-user">
            <span class="user-name">{{ address.receiverName }}</span>
            <span class="user-phone">{{ maskPhone(address.phone) }}</span>
          </div>
          <span v-if="address.isDefault" class="default-tag">默认</span>
        </div>

        <div class="address-content">
          <p class="address-region">{{ address.province }} {{ address.city }} {{ address.district }}</p>
          <p class="address-detail">{{ address.detailAddress }}</p>
        </div>

        <div class="address-actions">
          <button
            v-if="!address.isDefault"
            class="action-btn"
            @click="handleSetDefault(address.id)"
          >
            <Icon name="circle" :size="16" />
            设为默认
          </button>
          <button v-else class="action-btn active">
            <Icon name="check-circle" :size="16" />
            默认地址
          </button>

          <div class="action-right">
            <button class="action-btn" @click="handleEdit(address)">
              <Icon name="edit" :size="16" />
              编辑
            </button>
            <button class="action-btn delete" @click="handleDelete(address)">
              <Icon name="trash-2" :size="16" />
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state card">
      <span class="empty-icon">📍</span>
      <p class="empty-title">还没有收货地址</p>
      <p class="empty-desc">添加一个地址，方便收货~</p>
    </div>

    <!-- 添加按钮 -->
    <div class="add-btn-wrapper">
      <Button type="primary" size="large" block @click="handleAdd">
        <Icon name="plus" :size="18" />
        新增收货地址
      </Button>
    </div>

    <!-- 地址编辑弹窗 -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-mask" @click.self="closeModal">
        <div class="modal-content card">
          <div class="modal-header">
            <h2 class="modal-title">{{ isEditing ? '编辑地址' : '新增地址' }}</h2>
            <button class="modal-close" @click="closeModal">
              <Icon name="x" :size="20" />
            </button>
          </div>

          <form class="address-form" @submit.prevent="handleSubmit">
            <div class="form-item">
              <label class="form-label">收货人</label>
              <input
                v-model="form.receiverName"
                type="text"
                class="form-input"
                placeholder="请输入收货人姓名"
                maxlength="20"
              />
            </div>

            <div class="form-item">
              <label class="form-label">手机号</label>
              <input
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="请输入手机号"
                maxlength="11"
              />
            </div>

            <div class="form-item">
              <label class="form-label">所在地区</label>
              <div class="region-selects">
                <select v-model="form.province" class="form-select">
                  <option value="">请选择省</option>
                  <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
                </select>
                <select v-model="form.city" class="form-select" :disabled="!form.province">
                  <option value="">请选择市</option>
                  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
                <select v-model="form.district" class="form-select" :disabled="!form.city">
                  <option value="">请选择区</option>
                  <option v-for="dist in districts" :key="dist" :value="dist">{{ dist }}</option>
                </select>
              </div>
            </div>

            <div class="form-item">
              <label class="form-label">详细地址</label>
              <textarea
                v-model="form.detailAddress"
                class="form-textarea"
                placeholder="请输入街道、楼牌号等详细地址"
                rows="3"
                maxlength="100"
              ></textarea>
            </div>

            <div class="form-item checkbox-item">
              <label class="checkbox-label" @click="form.isDefault = !form.isDefault">
                <div class="checkbox" :class="{ checked: form.isDefault }">
                  <Icon v-if="form.isDefault" name="check" :size="12" />
                </div>
                <span>设为默认地址</span>
              </label>
            </div>

            <Button type="primary" size="large" block :loading="isSubmitting">
              {{ isEditing ? '保存修改' : '确认添加' }}
            </Button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- 删除确认弹窗 -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-mask" @click.self="showDeleteConfirm = false">
        <div class="confirm-modal card">
          <div class="confirm-content">
            <span class="confirm-icon">🗑️</span>
            <h3 class="confirm-title">确认删除</h3>
            <p class="confirm-desc">确定要删除这个收货地址吗？</p>
          </div>
          <div class="confirm-actions">
            <Button type="secondary" @click="showDeleteConfirm = false">取消</Button>
            <Button type="danger" @click="confirmDelete">确认删除</Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAddressStore } from '@/stores/address'
import { useToastStore } from '@/stores/toast'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'

const addressStore = useAddressStore()
const toastStore = useToastStore()

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)
const deletingId = ref(null)

const form = reactive({
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false
})

const regionData = {
  '北京市': {
    '北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']
  },
  '上海市': {
    '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
  },
  '广东省': {
    '广州市': ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'],
    '深圳市': ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区'],
    '珠海市': ['香洲区', '斗门区', '金湾区'],
    '佛山市': ['禅城区', '南海区', '顺德区', '三水区', '高明区']
  },
  '浙江省': {
    '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
    '宁波市': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '余姚市', '慈溪市', '象山县', '宁海县'],
    '温州市': ['鹿城区', '龙湾区', '瓯海区', '洞头区', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县', '瑞安市', '乐清市']
  },
  '江苏省': {
    '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'],
    '苏州市': ['虎丘区', '吴中区', '相城区', '姑苏区', '吴江区', '常熟市', '张家港市', '昆山市', '太仓市'],
    '无锡市': ['锡山区', '惠山区', '滨湖区', '梁溪区', '新吴区', '江阴市', '宜兴市']
  }
}

const provinces = computed(() => Object.keys(regionData))

const cities = computed(() => {
  if (!form.province) return []
  return Object.keys(regionData[form.province] || {})
})

const districts = computed(() => {
  if (!form.province || !form.city) return []
  return regionData[form.province]?.[form.city] || []
})

watch(() => form.province, () => {
  form.city = ''
  form.district = ''
})

watch(() => form.city, () => {
  form.district = ''
})

function maskPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

function resetForm() {
  form.receiverName = ''
  form.phone = ''
  form.province = ''
  form.city = ''
  form.district = ''
  form.detailAddress = ''
  form.isDefault = false
}

function handleAdd() {
  isEditing.value = false
  editingId.value = null
  resetForm()
  showModal.value = true
}

function handleEdit(address) {
  isEditing.value = true
  editingId.value = address.id
  form.receiverName = address.receiverName
  form.phone = address.phone
  form.province = address.province
  form.city = address.city
  form.district = address.district
  form.detailAddress = address.detailAddress
  form.isDefault = address.isDefault
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function validateForm() {
  if (!form.receiverName.trim()) {
    toastStore.warning('请输入收货人姓名')
    return false
  }
  if (!form.phone.trim()) {
    toastStore.warning('请输入手机号')
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    toastStore.warning('请输入正确的手机号')
    return false
  }
  if (!form.province || !form.city || !form.district) {
    toastStore.warning('请选择完整的所在地区')
    return false
  }
  if (!form.detailAddress.trim()) {
    toastStore.warning('请输入详细地址')
    return false
  }
  return true
}

function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true

  setTimeout(() => {
    const addressData = {
      receiverName: form.receiverName.trim(),
      phone: form.phone.trim(),
      province: form.province,
      city: form.city,
      district: form.district,
      detailAddress: form.detailAddress.trim(),
      isDefault: form.isDefault
    }

    if (isEditing.value) {
      addressStore.updateAddress(editingId.value, addressData)
      toastStore.success('地址修改成功')
    } else {
      addressStore.addAddress(addressData)
      toastStore.success('地址添加成功')
    }

    isSubmitting.value = false
    closeModal()
  }, 500)
}

function handleDelete(address) {
  deletingId.value = address.id
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (deletingId.value) {
    addressStore.deleteAddress(deletingId.value)
    toastStore.success('地址已删除')
    deletingId.value = null
  }
  showDeleteConfirm.value = false
}

function handleSetDefault(id) {
  addressStore.setDefaultAddress(id)
  toastStore.success('默认地址设置成功')
}
</script>

<style lang="scss" scoped>
.address-page {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 80px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.address-count {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.address-card {
  padding: var(--spacing-lg);
  transition: all 0.2s ease;

  &.is-default {
    border: 2px solid var(--primary);
  }
}

.address-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.address-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.user-phone {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}

.default-tag {
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: 2px 8px;
  background: var(--primary-bg);
  color: var(--primary);
  border-radius: var(--radius-sm);
}

.address-content {
  margin-bottom: var(--spacing-lg);
}

.address-region {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.address-detail {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  line-height: 1.5;
}

.address-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.action-right {
  display: flex;
  gap: var(--spacing-md);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  &.active {
    color: var(--primary);
  }

  &.delete:hover {
    background: var(--danger-bg);
    color: var(--danger);
  }
}

.empty-state {
  padding: var(--spacing-3xl);
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: var(--spacing-lg);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-desc {
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
}

.add-btn-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  z-index: 100;

  @media (min-width: 800px) {
    position: static;
    margin-top: var(--spacing-lg);
    padding: 0;
    background: transparent;
    border: none;
  }
}

// Modal
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal-content {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--spacing-xl);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  border-radius: var(--radius-full);
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input,
.form-select,
.form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border: 1.5px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:focus {
    background: var(--bg-primary);
    border-color: var(--primary);
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.form-input {
  height: 44px;
}

.form-select {
  height: 44px;
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.region-selects {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.checkbox-item {
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.checkbox {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-xs);
  color: white;
  transition: all 0.2s ease;

  &.checked {
    background: var(--primary);
    border-color: var(--primary);
  }
}

// Confirm Modal
.confirm-modal {
  width: 100%;
  max-width: 320px;
  padding: var(--spacing-xl);
}

.confirm-content {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.confirm-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.confirm-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.confirm-desc {
  font-size: var(--font-size-md);
  color: var(--text-tertiary);
}

.confirm-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

// Modal Transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-content,
  .confirm-modal {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content,
  .confirm-modal {
    transform: scale(0.95);
  }
}

// 响应式
@media (max-width: 600px) {
  .address-card {
    padding: var(--spacing-md);
  }

  .address-user {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .address-actions {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .action-right {
    width: 100%;
    justify-content: flex-end;
  }

  .region-selects {
    grid-template-columns: 1fr;
  }
}
</style>
