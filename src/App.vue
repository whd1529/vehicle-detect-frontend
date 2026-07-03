<template>
  <div style="display:flex;height:100vh">
    <!-- 左侧 -->
    <div style="width:180px;border-right:1px solid #ddd;padding:20px">
      <div style="font-size:22px;font-weight:bold;margin-bottom:30px">
        LOGO
      </div>

      <el-menu default-active="/" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/history">历史</el-menu-item>
        <el-menu-item index="/profile">个人</el-menu-item>
        <el-menu-item index="/company">公司</el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧 -->
    <div style="flex:1;padding:30px;overflow:auto">
      <router-view />
    </div>
  </div>
</template>