<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Aside></Aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "@/components/Aside.vue"
import Header from "@/components/Header.vue"
</script>

<style scoped>
.el-aside .el-menu {
  background-color: rgb(217, 236, 255);
  height: 100vh;
  overflow: auto
}

.headerP {
  height: 100%;
}

.el-header {
  padding: 0px;
}
</style>
