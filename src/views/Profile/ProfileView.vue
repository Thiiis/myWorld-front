<template>
  <!-- Bootstrap 3 스타일을 사용한 프로필 조회 UI -->
  <div>
    <div v-if="isLoading" class="text-center">
      <p class="dunggeunmo-font">프로필을 불러오고 있습니다...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      <strong>오류!</strong> {{ error }}
    </div>

    <div v-if="profile" class="panel panel-default">
      <div class="panel-body">
        <div class="row">
          <!-- 프로필 이미지 -->
          <div class="col-md-3 text-center">
            <img :src="profile.imgUrl ? `${backendUrl}${profile.imgUrl}` : '/placeholder.png'" class="img-responsive img-thumbnail" alt="프로필 사진"
              style="width: 150px; height: 150px; object-fit: cover;">
            <h4 class="dunggeunmo-font" style="margin-top: 15px;">{{ profile.nickname }}</h4>
            <p v-if="profile.statusMessage" class="dunggeunmo-font text-muted">"{{ profile.statusMessage }}"</p>
            <div>
              
            </div>
            <div v-if="isMyProfile" style="margin-top: 10px;">
              <router-link 
                :to="{ name: 'ProfileEdit', params: { account: profile.account } }"
                class="btn btn-primary btn-sm dunggeunmo-font"
              >
                프로필 수정
              </router-link>
              <router-link 
                to="/change-password" 
                class="btn btn-default btn-sm dunggeunmo-font" 
                style="margin-left: 5px;"
              >
                비밀번호 변경
              </router-link>
            </div>
          </div>
            <!-- 프로필 상세 정보 -->
            <div class="col-md-9">
              <h4 class="dunggeunmo-font"><strong>기본 정보</strong></h4>
              <hr style="margin-top: 10px; margin-bottom: 10px;">
              <dl class="dl-horizontal dunggeunmo-font">
                <dt v-if="profile.birthdate">생년월일</dt>
                <dd v-if="profile.birthdate">{{ profile.birthdate }}</dd>
              </dl>

              <br>
              <h4 class="dunggeunmo-font"><strong>자기소개</strong></h4>
              <hr style="margin-top: 10px; margin-bottom: 10px;">
              <p v-if="profile.intro" class="dunggeunmo-font" style="white-space: pre-wrap;">{{ profile.intro }}</p>
              <p v-else class="dunggeunmo-font text-muted">작성된 자기소개가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import profileApi from '@/apis/profileApi';

// 이미지 경로를 완성하기 위한 백엔드 서버 주소
const backendUrl = 'http://192.168.4.42:8080';

const route = useRoute();
const profile = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isMyProfile = ref(false); // '내 프로필'인지 여부를 저장하는 변수

onMounted(async () => {
  try {
    const targetAccount = route.params.account;

    const loggedInUserString = localStorage.getItem('loggedInUser');

    const loggedInUser = JSON.parse(loggedInUserString);
    const loggedInUserAccount = loggedInUser ? loggedInUser.account : null;

    if (targetAccount && loggedInUserAccount && targetAccount === loggedInUserAccount) {
      console.log("✅ 조건 일치! '내 프로필'로 판단합니다.");
      isMyProfile.value = true;
    } else {
      console.error("❌ 조건 불일치! '다른 사람 프로필'로 판단합니다.");
    }

    const [profileResponse, memberResponse] = await Promise.all([
      profileApi.getAnotherProfileDetail(targetAccount),
    ]);

    profile.value = profileResponse.data;

  } catch (err) {
    console.error("데이터 조회 실패:", err);
    error.value = "사용자 정보를 불러올 수 없습니다.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.dunggeunmo-font {
  font-family: 'DungGeunMo', sans-serif;
}
</style>
