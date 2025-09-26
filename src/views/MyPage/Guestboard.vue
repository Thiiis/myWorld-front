<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <!-- 방명록 헤더 -->
      <h5 class="fw-bold mb-3">
        <i class="bi bi-chat-dots text-primary me-2"></i> 방명록
      </h5>
      <p class="text-muted small">친구들의 따뜻한 메시지를 남겨보세요</p>

      <!-- 작성 버튼 (작성 중이 아닐 때만 보이게) -->
      <div v-if="!isWriting" class="mb-3">
        <button class="btn btn-primary w-100 fw-bold" @click="isWriting = true">
          + 방명록 작성하기
        </button>
      </div>

      <!-- 작성 폼 -->
      <div v-else class="mb-3 border rounded p-3">
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-person-circle text-primary me-2" style="font-size: 1.5rem;"></i>
          <strong>{{ username }}</strong>
        </div>
        <textarea v-model="newContent" class="form-control mb-2" rows="3"
          placeholder="따뜻한 메시지를 남겨주세요..."></textarea>
        <div class="text-end">
          <button class="btn btn-secondary btn-sm me-2" @click="cancelWrite">취소</button>
          <button class="btn btn-primary btn-sm" @click="submitBoard">작성완료</button>
        </div>
      </div>

      <!-- 방명록 리스트 -->
      <div v-if="guestboards.length > 0">
        <div v-for="board in guestboards" :key="board.gbid" class="border rounded p-3 mb-2">
          <div class="d-flex justify-content-between">
            <div>
              <i class="bi bi-person-circle text-primary me-2"></i>
              <strong>{{ board.nickname || "익명" }}</strong>
            </div>
            <small class="text-muted">
              {{ new Date(board.createdAt).toLocaleString() }}
            </small>
          </div>
          <p class="mt-2 mb-0">{{ board.content }}</p>
        </div>
      </div>

      <!-- 방명록 없을 때 -->
      <div v-else class="text-center text-muted py-3">
        <i class="bi bi-chat-square-dots" style="font-size: 2rem;"></i>
        <p class="mt-2">아직 방명록이 없습니다<br>첫 번째 메시지를 남겨보세요!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import guestboardApi from "@/apis/guestboardApi";

// 상태
const isWriting = ref(false);
const newContent = ref("");
const guestboards = ref([]);
const username = "aaa"; // 추후 로그인 사용자명 연동

// 방명록 불러오기
async function loadBoards() {
  try {
    const res = await guestboardApi.getGuestBoard(104); // mid 고정 테스트
    guestboards.value = res.data;
  } catch (err) {
    console.error(err);
  }
}

// 작성 취소
function cancelWrite() {
  isWriting.value = false;
  newContent.value = "";
}

// 작성 완료
async function submitBoard() {
  if (!newContent.value.trim()) return;
  try {
    await guestboardApi.createGuestBoard({
      gid: 104, // 임시 gid
      content: newContent.value,
    });
    newContent.value = "";
    isWriting.value = false;
    loadBoards();
  } catch (err) {
    console.error(err);
  }
}

onMounted(loadBoards);
</script>

<style scoped>
.card {
  border-radius: 12px;
}
textarea {
  resize: none;
}
</style>
