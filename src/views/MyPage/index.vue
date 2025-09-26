<template>
  <div class="container-fluid py-4">
    <div class="row">
      <!-- 왼쪽 사이드바 -->
      <div class="col-md-3">
        <MyPageSideBar />
      </div>

      <!-- 오른쪽 컨텐츠 -->
      <div class="col-md-9">
        <div class="card shadow-sm">
          <div class="card-body">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyPageSideBar from '@/components/Minihome/MyPageSideBar.vue'
</script>

<style scoped>
.container-fluid {
  background-color: #f8f9fa;
  min-height: 100vh;
}
</style>
