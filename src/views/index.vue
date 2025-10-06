<template>
  <div class="container-fluid py-4">
      <div class="row">
        <!-- 왼쪽 사이드바 -->
        <div class="col-md-3">
          <MyWorldSideBar />
        </div>

        <!-- 오른쪽 컨텐츠 -->
        <div class="col-md-9">
          <MyWorldHeader :page-name="$route.meta.theme" class="mb-4" />
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
import MyWorldSideBar from '@/components/MyWorldSideBar.vue'
import MyWorldHeader from '@/components/MyWorldHeader.vue'

// 2. 라우터 정보를 사용하기 위해 vue-router와 vue에서 필요한 기능을 import 합니다.
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 3. 현재 페이지의 제목을 계산하는 로직을 추가합니다.
const route = useRoute()
const currentPageTitle = computed(() => route.meta.title || 'MyWorld')
</script>

<style scoped>
.container-fluid {
  background-color: #f8f9fa;
  min-height: 100vh;
}
</style>
