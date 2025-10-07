<template>
  <div>
    <!-- 상단 테마 바 -->
    <div class="themed-header mb-4">
      <div 
        class="header-top d-flex align-items-center text-white fw-bold px-3 py-2"
        :class="currentTheme.colorClass"
      >
        <i class="bi me-2" :class="currentTheme.icon"></i>
        {{ currentTheme.title }}
      </div>
    </div>

    <!-- 중앙 원형 아이콘 -->
    <div class="icon-circle mx-auto mt-3 mb-2" :class="currentTheme.colorClass">
      <i class="bi text-white fs-4" :class="currentTheme.icon"></i>
    </div>

    <!-- 페이지 제목과 부제목 -->
    <h5 class="fw-bold text-center mb-1" :class="currentTheme.textColorClass">
      {{ currentTheme.title }}
    </h5>
    <p class="text-muted small text-center">{{ currentTheme.subtitle }}</p>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  pageName: {
    type: String,
    default: 'home',
  }
});

// ✨ 각 페이지별 헤더 테마 정의 (새로운 색상 팔레트 적용)
//    colorClass: 배경색을 위한 커스텀 CSS 클래스
//    textColorClass: 텍스트 색상을 위한 커스텀 CSS 클래스
const headerThemes = {
  home: {
    title: '미니홈',
    icon: 'bi-house-heart-fill',
    subtitle: '당신의 작은 세상에 오신 것을 환영합니다.',
    colorClass: 'theme-home',
    textColorClass: 'text-theme-home',
  },
  diary: {
    title: '일기장',
    icon: 'bi-book-fill',
    subtitle: '오늘의 감정과 생각을 소중하게 기록해보세요.',
    colorClass: 'theme-diary',
    textColorClass: 'text-theme-diary',
  },
  guestboard: {
    title: '방명록',
    icon: 'bi-chat-left-text-fill',
    subtitle: '친구들과 즐거운 이야기를 나누는 공간입니다.',
    colorClass: 'theme-guestboard',
    textColorClass: 'text-theme-guestboard',
  },
  jukebox: {
    title: '주크박스',
    icon: 'bi-music-note-beamed',
    subtitle: '오늘 당신의 기분에 맞는 음악을 골라보세요.',
    colorClass: 'theme-jukebox',
    textColorClass: 'text-theme-jukebox',
  },
  friend: {
    title: '친구',
    icon: 'bi-people-fill',
    subtitle: '소중한 친구 목록을 확인하고 관리하세요.',
    colorClass: 'theme-friend',
    textColorClass: 'text-theme-friend',
  },
  profile: {
    title: '프로필',
    icon: 'bi-person-circle',
    subtitle: '개인 정보를 확인하고 수정할 수 있습니다.',
    colorClass: 'theme-profile',
    textColorClass: 'text-theme-profile',
  },
  default: { // 기본값은 'home' 테마를 사용
    title: '미니홈',
    icon: 'bi-house-heart-fill',
    subtitle: '당신의 작은 세상에 오신 것을 환영합니다.',
    colorClass: 'theme-home',
    textColorClass: 'text-theme-home',
  }
};

const currentTheme = computed(() => {
  // pageName을 '/' 기준으로 나누고 첫 번째 부분을 사용합니다.
  // 예: 'profile/edit' -> 'profile'
  const baseName = props.pageName.split('/')[0]; 
  
  return headerThemes[baseName] || headerThemes.default;
});

</script>

<style scoped>
/* 원형 아이콘 기본 스타일 */
.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-top {
  border-radius: 0.25rem;
}

/* --- 새로운 테마 색상 정의 --- */

/* 1. 배경색 클래스 (활성화 색상 기준, 그라데이션 적용) */
.theme-home       { background-image: linear-gradient(45deg, #0065F8, #0d8eff); }
.theme-diary      { background-image: linear-gradient(45deg, #009AEF, #00bfff); }
.theme-guestboard { background-image: linear-gradient(45deg, #00CAFF, #5ee6ff); }
.theme-jukebox    { background-image: linear-gradient(45deg, #00EAD9, #54f2e2); }
.theme-friend     { background-image: linear-gradient(45deg, #00FFDE, #79ffee); }
.theme-profile    { background-image: linear-gradient(45deg, #4300FF, #7c3aed); }

/* 2. 텍스트 색상 클래스 (선명한 단색으로 통일감 부여) */
.text-theme-home       { color: #0065F8; }
.text-theme-diary      { color: #009AEF; }
.text-theme-guestboard { color: #00CAFF; }
.text-theme-jukebox    { color: #00EAD9; }
.text-theme-friend     { color: #00FFDE; }
.text-theme-profile    { color: #4300FF; }
</style>

