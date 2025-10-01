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
import guestboardApi from "@/apis/guestboardApi";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const isWriting = ref(false);
const guestboards = ref([]);
const newContent = ref("");


const username = "member";


function cancelWrite() {
  router.back();
}

// 방명록 작성
async function submitBoard() {
  try {
    const guestboard = {
      content: newContent.value
    };
    await guestboardApi.createGuestBoard(route.params.hostid, guestboard);
    alert("방명록이 작성되었습니다");
    router.back()
  } catch (err) {
    console.error(err);
  }
}

</script>

<style scoped>
.card {
  border-radius: 12px;
}
textarea {
  resize: none;
}
</style>
