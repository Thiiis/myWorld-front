<template>
  <div class="container my-4">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>💬 방명록</h3>
        <button
          v-if="!isWriting"
          class="btn btn-outline-primary"
          @click="isWriting = true">
          작성하기
        </button>
      </div>

      <!-- 작성 폼 -->
      <div v-if="isWriting" class="mb-4 border rounded p-3 bg-light">
        <textarea
          v-model="newContent"
          class="form-control mb-2"
          rows="3"
          placeholder="따뜻한 메시지를 남겨주세요..."
        ></textarea>
        <div class="text-end">
          <button class="btn btn-outline-secondary btn-sm me-2 rounded-pill" @click="cancelWrite">
            취소
          </button>
          <button class="btn btn-primary btn-sm rounded-pill" @click="submitBoard">
            작성완료
          </button>
        </div>
      </div>

      <!-- 방명록 리스트 -->
      <div v-if="guestboards.length > 0">
        <div
          v-for="board in guestboards"
          :key="board.gbid"
          class="border rounded-pill py-2 px-3 mb-2"
        >
          <span class="fw-bold text-primary me-2">{{ board.nickname || "친구" }}:</span>
          <span>{{ board.content }}</span>
        </div>
      </div>

      <!-- 방명록 없을 때 -->
      <div v-else class="text-center text-muted py-5 border rounded bg-light">
        <div class="mb-2" style="font-size: 2.5rem;">💬</div>
        <p class="mb-0">아직 방명록이 없습니다.<br>첫 번째 메시지를 남겨보세요!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import guestboardApi from "@/apis/guestboardApi";
import store from "@/store";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isWriting = ref(false);
const guestboards = ref([]);
const newContent = ref("");

const account = route.params.account;

function cancelWrite() {
  isWriting.value = false;
  newContent.value = "";
}

async function submitBoard() {
  try {
    const guestboard = { content: newContent.value };

    await guestboardApi.createGuestBoard(account, guestboard);
    alert("방명록이 작성되었습니다");
    isWriting.value = false;
    newContent.value = "";
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

.title-font {
  font-family: 'Segoe UI', 'Noto Sans KR', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
}
</style>