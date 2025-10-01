<template>
  <div>
    <!-- 프로필 카드 -->
    <div class="card shadow-sm mb-4 text-center">
      <div class="card-body">
        <img v-if="profileInfo.imgUrl" :src="profileInfo.imgUrl" :alt="profileInfo.imgName" class="profile-image">
        <i class="bi bi-person-circle" style="font-size: 3rem;"></i>
        <h5 class="mt-2">{{profileInfo.nickname}}님의 미니홈피</h5>
        <p class="text-muted small">{{ homeUrl }}</p>
        <ul class="list-unstyled text-start small">
          <li>📧 이메일: {{ profileInfo.email }}</li>
          <li>👦 아이디: {{ profileInfo.account }}</li>
          <li>🎂 생일: {{ profileInfo.birthdate }}</li>
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
import { reactive, onMounted } from 'vue' // reactive와 onMounted를 import 합니다.
import axios from 'axios' // 예시: 데이터 요청을 위해 axios 라이브러리 사용

const route = useRoute();
const account = route.params.account;
const homeUrl = `/mypage/${account}`;

// 1. 사용자 정보를 저장할 반응형 객체 생성
const profileInfo = reactive({
  nickname: '',
  email: '',
  account: '',
  birthdate: '',
  imgName:'',
  imgUrl:''
});

// 2. 서버에서 사용자 정보를 가져오는 함수 정의
const fetchUserProfile = async () => {
  try {
    // 실제 API 엔드포인트로 수정해야 합니다.
    const response = await axios.get(`/api/user/${account}`); 
    const userData = response.data;

    // 받아온 데이터로 profileInfo 객체 업데이트
    profileInfo.nickname = userData.nickname;
    profileInfo.email = userData.email;
    profileInfo.account = userData.id;
    profileInfo.birthdate = userData.birthday;
    profileInfo.imgUrl = userData.imgUrl;
    profileInfo.imgName = userData.imgName;

  } catch (error) {
    console.error("프로필 정보를 불러오는 데 실패했습니다:", error);
    // 에러 발생 시 기본값이나 에러 메시지를 설정할 수 있습니다.
  }
};

// 3. 컴포넌트가 마운트될 때(화면에 표시될 때) 사용자 정보 요청 함수 실행
onMounted(() => {
  fetchUserProfile();
});

</script>
