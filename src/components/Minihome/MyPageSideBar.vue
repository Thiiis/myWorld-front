<template>
  <div>
    <!-- 프로필 카드 -->
    <div class="card shadow-sm mb-4 text-center">
      <div class="card-body">
        <i class="bi bi-person-circle" style="font-size: 3rem;"></i>
        <h5 class="mt-2">aaa님의 미니홈피</h5>
        <p class="text-muted small">www.myworld.com/aaa</p>
        <ul class="list-unstyled text-start small">
          <li>🎂 생일: 미설정</li>
          <li>💼 직업: 미설정</li>
          <li>🏠 출신: 미설정</li>
          <li>👀 오늘 방문자: 42명</li>
        </ul>
      </div>
    </div>

    <!-- 메뉴 -->
    <div class="list-group shadow-sm">
      <RouterLink :to="`/mypage/${account}`" class="list-group-item list-group-item-action">홈</RouterLink>
      <RouterLink :to="`/mypage/${account}/diary`" class="list-group-item list-group-item-action">일기장</RouterLink>
      <RouterLink :to="`/mypage/${account}/guestboard`" class="list-group-item list-group-item-action">방명록</RouterLink>
      <RouterLink :to="`/mypage/${account}/jukebox`" class="list-group-item list-group-item-action">주크박스</RouterLink>
      <RouterLink :to="`/mypage/${account}/friend`" class="list-group-item list-group-item-action">친구</RouterLink>
      <RouterLink :to="`/mypage/${account}/profile`" class="list-group-item list-group-item-action">프로필</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute();
const account = route.params.account
</script>
