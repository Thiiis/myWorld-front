<template>
  <div>
    <!-- 프로필 카드 -->
    <div>
      <div v-if="profileInfo" class="card shadow-sm mb-4 text-center">
        <div class="card-body">
          <img v-if="profileInfo.imgUrl" :src="`${backendUrl}${profileInfo.imgUrl}`" alt="Profile Image" class="profile-image-square">
          <i class="bi bi-person-circle profile-image-square" style="font-size: 3rem;"></i>
          <h5 class="mt-2">{{profileInfo.nickname}}님의 미니홈피</h5>
          <p class="text-muted small">{{miniHomeUrl}}</p>
          <ul class="list-unstyled text-start small">
            <li>🏠 상태메세지: {{profileInfo.statusMessage}}</li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>로딩 중...</p>
      </div>
    </div>
    <div class="list-group shadow-sm">
      <RouterLink :to="`${miniHomeUrl}`" class="list-group-item list-group-item-action">홈</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/diary`" class="list-group-item list-group-item-action">일기장</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/guestboard`" class="list-group-item list-group-item-action">방명록</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/jukebox`" class="list-group-item list-group-item-action">주크박스</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/friend`" class="list-group-item list-group-item-action">친구</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/profile`" class="list-group-item list-group-item-action">프로필</RouterLink>
    </div>
  </div>
  <!-- 메뉴 -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import profileApi from '@/apis/profileApi'; // API 모듈 import
const backendUrl = 'http://192.168.4.42:8080'; 
// 1. 현재 URL 정보를 얻기 위해 useRoute() 사용
const route = useRoute();

// 2. URL 파라미터에서 'account'를 추출 (예: /myworld/userA -> 'userA')
const account = route.params.account;

// 3. 메뉴 링크를 만들기 위한 기본 URL
const miniHomeUrl = `/myworld/${account}`;

// 4. 서버에서 받아온 프로필 정보를 저장할 반응형 변수. 초기값은 null.
const profileInfo = ref(null);

// 5. 컴포넌트가 화면에 그려질 때(마운트될 때) API를 호출하는 함수
onMounted(async () => {
  if (account) { // account가 URL에 존재할 때만 API 호출
    try {
      // account를 인자로 넘겨 특정 사용자의 프로필 정보를 요청
      const response = await profileApi.profileInfo(account);
      // 성공적으로 데이터를 받아오면 profileInfo 변수에 저장
      profileInfo.value = response.data;
    } catch (error) {
      console.error("사이드바 프로필 정보를 불러오는 데 실패했습니다:", error);
      // 에러 발생 시 profileInfo는 계속 null 상태로 유지됨
    }
  }
});

</script>


<style scoped>
.profile-image-square {
  width: 150px; /* 원하는 너비 */
  height: 150px; /* 원하는 높이 (너비와 동일하게) */
  object-fit: cover; /* 핵심 속성: 이미지를 잘라서 꽉 채움 */
  border-radius: 10%; /* 살짝 둥근 모서리 (선택 사항) */
  display: flex; /* 아이콘 중앙 정렬을 위해 추가 */
  align-items: center; /* 아이콘 중앙 정렬을 위해 추가 */
  justify-content: center; /* 아이콘 중앙 정렬을 위해 추가 */
  font-size: 150px; /* 아이콘 크기 */
}
</style>