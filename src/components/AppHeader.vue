<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
    <div class="container">
      <RouterLink to="/" class="navbar-brand fw-bold text-primary d-flex align-items-center">
        <i class="bi bi-star-fill me-2"></i>
        마이월드
      </RouterLink>
      <RouterLink to="/myworld" class="btn btn-primary">
        시작하기
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
</style>
