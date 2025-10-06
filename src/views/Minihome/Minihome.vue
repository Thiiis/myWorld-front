<template>
  <div class="minihome-container p-2">
    <!-- 1. 상단 프로필 및 기분 섹션 -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row align-items-center g-3">
          <!-- 프로필 정보 -->
          <div class="col-md-5 d-flex align-items-center gap-3">
            <img :src="profile.imgUrl" class="profile-img rounded-circle" alt="Profile">
            <div>
              <h5 class="mb-0">{{ profile.nickname }}</h5>
              <p class="text-muted small mb-0">Welcome to my world!</p>
            </div>
          </div>

          <!-- 오늘의 기분/상태 메시지 -->
          <div class="col-md-7">
            <div class="today-status p-3 rounded-3 text-center">
              <span class="text-primary fw-bold pixel-font">Today is...</span>
              <p class="mb-0 mt-1">"{{ todayStatus }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 최근 업데이트 소식 -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-light border-0 pt-3">
        <h5 class="mb-0 pixel-font"><i class="bi bi-bell-fill me-2 text-primary"></i>Recent Updates</h5>
      </div>
      <div class="card-body">
        <ul v-if="updates.length > 0" class="list-group list-group-flush">
          <li v-for="update in updates" :key="update.id" class="list-group-item d-flex justify-content-between align-items-center px-1">
            <div class="d-flex align-items-center">
              <span class="update-icon me-3">
                <i :class="update.icon"></i>
              </span>
              <span>
                <strong>[{{ update.type }}]</strong> {{ update.title }}
              </span>
            </div>
            <small class="text-muted">{{ update.date }}</small>
          </li>
        </ul>
        <div v-else class="text-center text-muted py-4">
          <p class="mb-1"><i class="bi bi-info-circle fs-4"></i></p>
          <p class="mb-0">최근 업데이트 소식이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import defaultProfile from '@/assets/image/default-profile.png'; // 기본 프로필 이미지 경로

// --- 스크립트 로직 (API 연동 전 임시 데이터) ---

// 프로필 정보 (나중에 API로 받아올 데이터)
const profile = ref({
  nickname: '방문자',
  imgUrl: defaultProfile
});

// 오늘의 상태 메시지
const todayStatus = ref('코딩하기 좋은 날씨! ☀️');

// 최근 업데이트 목록
const updates = ref([]);

// 아이콘 매핑
const iconMap = {
  '일기장': 'bi bi-journal-richtext text-success',
  '사진첩': 'bi bi-image-fill text-info',
  '방명록': 'bi bi-chat-left-dots-fill text-warning',
};

// 컴포넌트가 마운트될 때 실행될 함수
onMounted(() => {
  // 실제로는 여기서 API를 호출하여 데이터를 가져옵니다.
  // 지금은 임시 데이터를 설정합니다.
  profile.value = {
    nickname: '개발자', // 실제 사용자 닉네임으로 교체
    imgUrl: defaultProfile,
  };

  updates.value = [
    { id: 1, type: '일기장', title: '새로운 글이 등록되었습니다.', date: '1시간 전', icon: iconMap['일기장'] },
    { id: 2, type: '사진첩', title: '여행 사진 5장이 추가되었습니다.', date: '3시간 전', icon: iconMap['사진첩'] },
    { id: 3, type: '방명록', title: '김코딩님이 방명록을 남겼습니다.', date: '어제', icon: iconMap['방명록'] },
    { id: 4, type: '일기장', title: '코딩 일기!', date: '2일 전', icon: iconMap['일기장'] },
  ];
});
</script>

<style scoped>
/* 픽셀 폰트 (부모 컴포넌트에 있다면 생략 가능) */
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&display=swap');

.pixel-font {
  font-family: 'Pixelify+Sans', sans-serif;
}

.minihome-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.today-status {
  background-color: #f8f9fa;
  border: 1px dashed #dee2e6;
  font-style: italic;
  color: #495057;
}

.update-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.list-group-item {
  border: none;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f3f5 !important;
}

.list-group-item:last-child {
  border-bottom: none !important;
}
</style>