<template>
  <div>
    <h2>🚗 车辆识别</h2>

    <el-upload
      class="upload-demo"
      drag
      :auto-upload="false"
      :limit="1"
      accept="image/*"
      @change="handleUpload"
    >
      <el-icon style="font-size:40px"><UploadFilled /></el-icon>
      <div>点击或拖拽图片上传</div>
    </el-upload>

    <el-button type="primary" @click="doDetect" :loading="loading" style="margin-top:15px">
      开始识别
    </el-button>

    <el-divider />

    <div v-if="resultUrl" style="display:flex;gap:30px">
      <img :src="resultUrl" style="max-width:60%" />
      <div>
        <p><b>车辆总数：</b>{{ total }}</p>
        <el-table :data="tableData" border size="small">
          <el-table-column prop="type" label="车型" />
          <el-table-column prop="num" label="数量" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { UploadFilled } from '@element-plus/icons-vue'

let fileObj = null
const loading = ref(false)
const resultUrl = ref('')
const total = ref(0)
const tableData = ref([])

const handleUpload = (e) => { fileObj = e.raw }

const doDetect = async () => {
  if (!fileObj) return alert('请先选择图片')
  const fd = new FormData()
  fd.append('file', fileObj)

  loading.value = true
  try {
    const { data } = await axios.post('http://localhost:8000/api/detect/image', fd)

    resultUrl.value = 'http://localhost:8000' + data.result_url
    total.value = data.total_vehicles
    tableData.value = [
      { type: '轿车', num: data.counts.car },
      { type: '公交车', num: data.counts.bus },
      { type: '卡车', num: data.counts.truck }
    ]

    saveHistory(data)
  } catch {
    alert('识别失败')
  } finally {
    loading.value = false
  }
}

const saveHistory = (data) => {
  const record = {
    time: new Date().toLocaleString(),
    resultUrl: 'http://localhost:8000' + data.result_url,
    counts: data.counts,
    total: data.total_vehicles
  }
  const history = JSON.parse(localStorage.getItem('history') || '[]')
  history.unshift(record)
  localStorage.setItem('history', JSON.stringify(history.slice(0, 50)))
}
</script>