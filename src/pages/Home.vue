<template>
  <div class="home">
    <el-card shadow="never" class="upload-card">
      <template #header>
        <span class="title">🚗 车辆智能识别系统</span>
      </template>

      <el-upload
        class="uploader"
        drag
        accept="image/*"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="uploadImage"
      >
        <el-icon class="upload-icon"><Upload /></el-icon>
        <div class="upload-text">点击或拖拽上传车辆图片</div>
      </el-upload>

      <div v-if="loading" class="loading">
        <el-spinner size="large" />
        <p>AI 正在识别中...</p>
      </div>

      <div v-if="result" class="result">
        <!-- 图片 + 画框 -->
        <div class="image-box">
          <img ref="imgRef" :src="previewUrl" class="result-img" />
          <canvas ref="canvasRef" class="canvas"></canvas>
        </div>

        <!-- 统计 -->
        <el-alert
          title="识别统计"
          :closable="false"
          type="success"
          show-icon
        >
          共识别到 {{ result.count }} 辆车
        </el-alert>

        <!-- 车辆明细表 -->
        <el-table :data="result.vehicles" class="table" stripe border>
          <el-table-column prop="id" label="编号" width="60" />
          <el-table-column prop="type" label="车型" />
          <el-table-column prop="brand" label="品牌" />
          <el-table-column prop="color" label="颜色" />
          <el-table-column prop="plate" label="车牌号" />
          <el-table-column prop="seatbelt" label="安全带">
            <template #default="{ row }">
              <el-tag :type="row.seatbelt ? 'success' : 'danger'">
                {{ row.seatbelt ? '已系' : '未系' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="smoking" label="抽烟">
            <template #default="{ row }">
              <el-tag :type="row.smoking ? 'warning' : 'info'">
                {{ row.smoking ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="hands_on_wheel" label="握方向盘">
            <template #default="{ row }">
              <el-tag :type="row.hands_on_wheel ? 'success' : 'danger'">
                {{ row.hands_on_wheel ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="confidence" label="置信度">
            <template #default="{ row }">
              {{ (row.confidence * 100).toFixed(1) }}%
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const loading = ref(false)
const previewUrl = ref('')
const result = ref(null)
const imgRef = ref(null)
const canvasRef = ref(null)

// ✅ 后端地址（Railway / Local）
const BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const beforeUpload = (file) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return false
  }
  previewUrl.value = URL.createObjectURL(file)
  result.value = null
  return true
}

const uploadImage = async ({ file }) => {
  loading.value = true
  const form = new FormData()
  form.append('image', file)

  try {
    const { data } = await axios.post(
      `${BASE}/api/detect/image`,
      form
    )
    result.value = data
    await nextTick()
    drawBoxes(data.vehicles)
  } catch (e) {
    console.error(e)
    ElMessage.error('识别失败，请检查后端服务')
  } finally {
    loading.value = false
  }
}

// ✅ Canvas 画检测框
const drawBoxes = (vehicles) => {
  const img = imgRef.value
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  canvas.width = img.clientWidth
  canvas.height = img.clientHeight

  const scaleX = img.clientWidth / img.naturalWidth
  const scaleY = img.clientHeight / img.naturalHeight

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  vehicles.forEach((v) => {
    const [x, y, w, h] = v.bbox
    const sx = x * scaleX
    const sy = y * scaleY
    const sw = (w - x) * scaleX
    const sh = (h - y) * scaleY

    // 边框
    ctx.strokeStyle = v.seatbelt ? '#67C23A' : '#F56C6C'
    ctx.lineWidth = 3
    ctx.strokeRect(sx, sy, sw, sh)

    // 标签
    ctx.fillStyle = v.seatbelt ? '#67C23A' : '#F56C6C'
    ctx.font = '14px Arial'
    ctx.fillText(
      `#${v.id} ${v.plate} ${v.type}`,
      sx,
      sy > 20 ? sy - 5 : sy + sh + 15
    )
  })
}
</script>

<style scoped>
.home {
  padding: 24px;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.upload-card {
  max-width: 900px;
  margin: 0 auto;
}
.uploader {
  text-align: center;
}
.upload-icon {
  font-size: 48px;
  color: #409eff;
}
.upload-text {
  margin-top: 8px;
}
.loading {
  text-align: center;
  margin: 24px 0;
}
.result {
  margin-top: 24px;
}
.image-box {
  position: relative;
  margin-bottom: 16px;
}
.result-img {
  width: 100%;
  display: block;
}
.canvas {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
.table {
  margin-top: 16px;
}
</style>