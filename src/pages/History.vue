<template>
  <div>
    <h2>📜 识别历史</h2>

    <el-empty v-if="!history.length" description="暂无记录" />

    <el-card
      v-for="(item, index) in history"
      :key="index"
      style="margin-bottom:15px;cursor:pointer"
      @click="showDetail(item)"
    >
      <div style="display:flex;gap:15px">
        <img :src="item.resultUrl" style="width:120px" />
        <div>
          <p>{{ item.time }}</p>
          <p>总数：{{ item.total }}</p>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="visible" title="识别详情">
      <img :src="current.resultUrl" style="width:100%" />
      <p>轿车：{{ current.counts?.car }}</p>
      <p>公交车：{{ current.counts?.bus }}</p>
      <p>卡车：{{ current.counts?.truck }}</p>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const history = ref([])
const visible = ref(false)
const current = ref({})

onMounted(() => {
  history.value = JSON.parse(localStorage.getItem('history') || '[]')
})

const showDetail = (item) => {
  current.value = item
  visible.value = true
}
</script>