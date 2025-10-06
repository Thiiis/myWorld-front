<template>
  <div class="container" style="padding-top: 20px;">
    <div v-if="isLoading" class="text-center">
      <p class="dunggeunmo-font">프로필 정보를 불러오는 중...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      <strong>오류!</strong> {{ error }}
    </div>

    <div v-else-if="formData" class="row">
      <div class="col-md-8 col-md-offset-2">
        <form @submit.prevent="handleSubmit" class="form-horizontal">
          <!-- 프로필 이미지 -->
          <div class="form-group">
            <label class="col-sm-2 control-label dunggeunmo-font">🎇 이미지</label>
            <div class="col-sm-10">
              <img :src="finalImageSrc" class="img-thumbnail" style="width: 150px; height: 150px; margin-bottom: 10px;">
              <input type="file" @change="handleFileChange" class="form-control">
            </div>
          </div>
          
          <!-- 닉네임 -->
          <div class="form-group">
            <label for="nickname" class="col-sm-2 control-label dunggeunmo-font">☺️ 닉네임</label>
            <div class="col-sm-10">
              <input type="text" v-model="formData.nickname" class="form-control dunggeunmo-font" id="nickname" required>
            </div>
          </div>
          
          <!-- 생년월일 -->
          <div class="form-group">
            <label for="birthdate" class="col-sm-2 control-label dunggeunmo-font">🎂 생년월일</label>
            <div class="col-sm-10">
              <input type="date" v-model="formData.birthdate" class="form-control dunggeunmo-font" id="birthdate">
            </div>
          </div>
          
          <!-- 주소 -->
          <div class="form-group">
            <label for="mainAddress" class="col-sm-2 control-label dunggeunmo-font">🏠 주소</label>
            <div class="col-sm-10">
              <input type="text" v-model="formData.mainAddress" class="form-control dunggeunmo-font" id="mainAddress">
            </div>
          </div>
          <!-- 상태메시지 -->
          <div class="form-group">
            <label for="statusMessage" class="col-sm-2 control-label dunggeunmo-font">💬 상태메시지</label>
            <div class="col-sm-10">
              <input type="text" v-model="formData.statusMessage" class="form-control dunggeunmo-font" id="statusMessage">
            </div>
          </div>
          <!-- 자기소개 -->
          <div class="form-group">
            <label for="intro" class="col-sm-2 control-label dunggeunmo-font">👍 자기소개</label>
            <div class="col-sm-10">
              <textarea v-model="formData.intro" class="form-control dunggeunmo-font" id="intro" rows="5"></textarea>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <button type="submit" class="btn btn-success dunggeunmo-font" :disabled="isSubmitting">
                {{ isSubmitting ? '저장 중...' : '저장하기' }}
              </button>
              <button type="button" @click="goBack" class="btn btn-default dunggeunmo-font" style="margin-left: 10px;">
                취소
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import profileApi from '@/apis/profileApi';

// 백엔드 서버 주소
const backendUrl = 'http://192.168.4.42:8080';

const router = useRouter();

const formData = ref(null);
const imageFile = ref(null);
const imagePreview = ref(''); // 서버에서 받은 상대 경로 또는 로컬 파일의 base64 데이터
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref(null);

// 표시될 최종 이미지 경로를 계산하는 computed 속성
const finalImageSrc = computed(() => {
  if (!imagePreview.value) {
    return '/placeholder.png'; // 이미지가 없을 때 기본 이미지
  }
  // 로컬에서 새로 선택한 파일인 경우 (base64 데이터)
  if (imagePreview.value.startsWith('data:')) {
    return imagePreview.value;
  }
  // 서버에서 불러온 기존 이미지인 경우 (상대 경로)
  return `${backendUrl}${imagePreview.value}`;
});


onMounted(async () => {
  try {
    const response = await profileApi.getMyProfileDetail();
    const data = response.data;
    
    formData.value = {
      nickname: data.nickname || '',
      birthdate: data.birthdate ? data.birthdate.split('T')[0] : '',
      mainAddress: data.mainAddress || '',
      statusMessage: data.statusMessage || '',
      intro: data.intro || ''
    };
    imagePreview.value = data.imgUrl || '';

  } catch (err) {
    error.value = '프로필 정보를 가져오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
});

// 사용자가 새 이미지 파일을 선택하면, 미리보기를 위해 base64로 변환
watch(imageFile, (newFile) => {
  if (newFile) {
    const reader = new FileReader();
    reader.onload = (e) => { imagePreview.value = e.target.result; };
    reader.readAsDataURL(newFile);
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (imageFile.value) {
      await profileApi.profileUpdateImage(imageFile.value);
    }
    await profileApi.profileUpdate(formData.value);
    alert('프로필이 성공적으로 저장되었습니다.');
    router.back();
  } catch (err) {
    alert('프로필 저장에 실패했습니다.');
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => { router.back(); };
</script>

<style scoped>
.dunggeunmo-font {
    font-family: 'DungGeunMo', sans-serif;
}
.form-horizontal .control-label {
    text-align: left;
}
</style>
