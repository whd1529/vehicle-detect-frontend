<template>
  <div style="max-width:400px">
    <h2>👤 个人中心</h2>

    <div v-if="!user">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="register">注册</el-button>
      </el-form>
    </div>

    <div v-else>
      <p>欢迎你，{{ user }}</p>
      <el-button @click="logout">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const form = ref({ username: '', password: '' })
const user = ref('')

onMounted(() => {
  user.value = localStorage.getItem('user') || ''
})

const register = () => {
  localStorage.setItem('user', form.value.username)
  alert('注册成功')
}

const login = () => {
  user.value = form.value.username
  localStorage.setItem('user', user.value)
}

const logout = () => {
  user.value = ''
  localStorage.removeItem('user')
}
</script>