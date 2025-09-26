<template>
  <b-card>
    <!-- 결과 헤더 -->
    <b-card-header class="text-center bg-success text-white">
      <h4>{{ themeData.name }}</h4>
      <p>{{ themeData.description }}</p>
    </b-card-header>

    <!-- 본문 -->
    <b-card-body class="text-center">
      <!-- 색상 팔레트 -->
      <ThemePreview :theme="result" :colors="Object.values(themeData.css)" class="mb-3"/>
      <p><strong>성격 분석:</strong> {{ themeData.personality }}</p>
      <p><strong>추천 피크닉:</strong> {{ themeData.picnicStyle }}</p>

      <!-- ✅ 현재 테마 적용 미리보기 박스 -->
      <div class="preview-box mt-4 p-4 rounded shadow-sm">
        <h5 class="mb-2">🌈 현재 적용된 테마 미리보기</h5>
        <p>이제 App.vue 전체에 <b>{{ themeData.name }}</b> 색상이 반영돼요!</p>
        <div class="preview-colors d-flex justify-content-center gap-3 mt-3">
          <div v-for="(value, key) in themeData.css" :key="key"
               class="rounded-circle border"
               style="width: 50px; height: 50px;"
               :title="key"
               :style="{ backgroundColor: value }">
          </div>
        </div>
      </div>

      <!-- 다시 테스트 버튼 -->
      <b-button variant="outline-primary" class="mt-3" @click="$router.push('/themetest')">
        🔄 다시 테스트하기
      </b-button>
    </b-card-body>
  </b-card>
</template>


<script setup>
import { useRoute } from 'vue-router';
import { themes } from '@/data/themes';
import { applyTheme } from '@/utils/applyTheme';

const route = useRoute();   // ✅ 반드시 호출해야 route 객체 생성됨
const resultKey = route.query.result || 'default';  // 여기서 query 읽음
const themeData = themes[resultKey] || themes.default;

applyTheme(resultKey);
</script>


<style scoped>
.preview-box {
  background-color: var(--soft-gray, #f8f9fa);
  border: 2px solid var(--accent-color, #3B82F6);
  transition: all 0.3s ease;
}
.preview-colors div {
  transition: transform 0.2s ease;
}
.preview-colors div:hover {
  transform: scale(1.1);
}
</style>
