<!-- 컴포넌트의 UI -->
<template>
<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
        Ch01. Vue 시작
      </button>
    </h2>
    <div id="collapse1" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <ul>
          <li><RouterLink to="/">HomeView</RouterLink></li>
          <li><RouterLink to="/themetest">ThemeTestPage</RouterLink></li>
        </ul>          
      </div>
    </div>
  </div>
  </div>

</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>

</script>

<!-- 컴포넌트의 스타일 정의 -->
<style scoped>

</style>