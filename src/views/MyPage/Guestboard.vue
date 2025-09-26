<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="fw-bold">방명록</h5>

      <!-- 글쓰기 -->
      <div class="mb-3">
        <textarea v-model="newContent" class="form-control" placeholder="방명록을 작성하세요"></textarea>
        <button class="btn btn-primary mt-2" @click="createBoard">등록</button>
      </div>

      <!-- 글 목록 -->
      <ul class="list-group">
        <li 
          v-for="board in boards" 
          :key="board.gbid" 
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <p class="mb-1">{{ board.content }}</p>
            <small class="text-muted">
              작성일: {{ formatDate(board.createdAt) }}
            </small>
          </div>
          <button class="btn btn-sm btn-danger" @click="deleteBoard(board.gbid)">삭제</button>
        </li>
      </ul>

      <!-- 데이터 없음 -->
      <p v-if="boards.length === 0" class="text-muted mt-3">작성된 방명록이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import guestboardApi from "@/apis/guestboardApi"

const boards = ref([])
const newContent = ref("")

// 방명록 불러오기
async function loadBoards() {
  try {
    const res = await guestboardApi.getGuestBoard(104) // 특정 사용자 mid
    boards.value = res.data
  } catch (err) {
    console.error("방명록 불러오기 실패:", err)
  }
}

// 방명록 작성
async function createBoard() {
  if (!newContent.value.trim()) return
  try {
    await guestboardApi.createGuestBoard({ gid: 104, content: newContent.value, viewScope: "PUBLIC" })
    newContent.value = ""
    loadBoards() // 새로고침
  } catch (err) {
    console.error("방명록 작성 실패:", err)
  }
}

// 방명록 삭제
async function deleteBoard(gbid) {
  try {
    await guestboardApi.deleteGuestBoard(gbid)
    loadBoards()
  } catch (err) {
    console.error("방명록 삭제 실패:", err)
  }
}

// 날짜 포맷
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}

onMounted(loadBoards)
</script>
