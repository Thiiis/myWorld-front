<template>
  <div class="container my-4">
    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>➕ 새 주크박스 만들기</h3>
      <router-link
        :to="`/myworld/${$route.params.account}/jukebox`"
        class="btn btn-outline-secondary"
      >
        뒤로
      </router-link>
    </div>

    <!-- 카드 형태 입력 폼 -->
    <div class="card shadow-sm">
      <div class="card-body">
        <!-- 제목 -->
        <div class="mb-3">
          <label class="form-label">제목</label>
          <input
            type="text"
            class="form-control"
            placeholder="주크박스 제목을 입력하세요"
            v-model="newJukebox.title"
          />
        </div>

        <!-- 설명 -->
        <div class="mb-3">
          <label class="form-label">설명</label>
          <textarea
            class="form-control"
            rows="3"
            placeholder="주크박스에 대한 설명을 입력하세요"
            v-model="newJukebox.content"
          ></textarea>
        </div>

        <!-- 음악 선택 -->
        <div class="mb-3">
          <label class="form-label">음악 선택</label>
          <div class="d-flex justify-content-end">
            <button class="btn btn-outline-primary btn-sm" disabled>
              + 음악 추가 (준비 중)
            </button>
          </div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="card-footer d-flex justify-content-end gap-2">
        <button class="btn btn-primary btn-sm" @click="createJukebox" :disabled="loading">
          만들기
        </button>
        <router-link
          :to="`/myworld/${$route.params.account}/jukebox`"
          class="btn btn-light btn-sm"
        >
          취소
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import jukeboxApi from "@/apis/jukeboxApi";

const router = useRouter();
const route = useRoute();
const loading = ref(false);

const account = route.params.account;

// 새 주크박스 정보
const newJukebox = ref({
  title: "",
  content: "",
});

// 주크박스 생성 함수
async function createJukebox() {
  if (!newJukebox.value.title.trim()) {
    alert("제목을 입력하세요!");
    return;
  }

  try {
    loading.value = true;
    const res = await jukeboxApi.createJukebox(newJukebox.value);
    console.log("생성 완료:", res.data);
    alert("주크박스가 성공적으로 생성되었습니다!");
    router.push(`/myworld/${account}/jukebox`);
  } catch (err) {
    console.error("생성 실패:", err.response?.data || err);
    alert("주크박스 생성에 실패했습니다.");
  } finally {
    loading.value = false;
  }
}
</script>
