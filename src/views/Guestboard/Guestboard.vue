<template>
  <div class="container my-4">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>💬 방명록</h3>
        <button v-if="!isWriting" class="btn btn-outline-primary" @click="isWriting = true">
          작성하기
        </button>
      </div>

      <!-- 작성 폼 -->
      <div v-if="isWriting" class="mb-4 border rounded p-3 bg-light">
        <textarea v-model="newContent" class="form-control mb-2" rows="3" placeholder="따뜻한 메시지를 남겨주세요..."></textarea>
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
        <div v-for="board in guestboards" :key="board.gbid" class="border rounded py-2 px-3 mb-2">
          <span class="fw-bold text-primary me-2">{{ board.nickname || "친구" }}:</span>

          <!-- 일반 모드 -->
          <span v-if="editingId !== board.gbid">{{ board.content }}</span>

          <!-- 수정 모드 -->
          <div v-else class="mt-2">
            <textarea v-model="editContent" class="form-control mb-2"></textarea>
            <button class="btn btn-sm btn-primary me-2" @click="submitEdit(board.gbid)">수정 완료</button>
            <button class="btn btn-sm btn-secondary" @click="cancelEdit">취소</button>
          </div>

          <!-- 로그인 사용자가 쓴 글이면 수정/삭제 버튼 표시 -->
          <div class="text-end" v-if="board.gid == mid && editingId !== board.gbid">
            <button class="btn btn-outline-secondary btn-sm mt-2" @click="startEdit(board)">
              수정
            </button>
            <button class="btn btn-outline-danger btn-sm mt-2" @click="deleteBoard(board.gbid)">
              삭제
            </button>
          </div>
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";


const route = useRoute();


const isWriting = ref(false);
const guestboards = ref([]);
const newContent = ref("");

const offset = ref(0);
const limit = ref(10);
const loading = ref(false);

// 수정 모드용
const editingId = ref(null);
const editContent = ref("");

const account = route.params.account;
const mid = store.state.mid;

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

    offset.value = 0;
    guestboards.value = [];
    await fetchGuestboards();

  } catch (err) {
    console.error(err);
  }
}

// 방명록 불러오기
async function fetchGuestboards() {
  try {
    loading.value = true;
    const res = await guestboardApi.getGuestBoard(account, offset.value, limit.value);
    console.log(res);

    if (offset.value === 0) {
      guestboards.value = res.data;
    } else {
      guestboards.value.push(...res.data);
    }
    offset.value += 10;

  } catch (e) {
    console.error(e);
    guestboards.value = [];
  } finally {
    loading.value = false;
  }
}

// 방명록 수정
function startEdit(board) {
  editingId.value = board.gbid;
  editContent.value = board.content;
}

// 수정 취소
function cancelEdit() {
  editingId.value = null;
  editContent.value = "";
}

// 수정 제출
async function submitEdit(gbid) {
  try {
    await guestboardApi.updateGuestBoard({ gbid, content: editContent.value });
    alert("수정되었습니다");
    editingId.value = null;
    editContent.value = "";

    offset.value = 0;
    guestboards.value = [];
    await fetchGuestboards();
  } catch (e) {
    console.error(e);
    alert("수정 실패");
  }
}

async function deleteBoard(gbid) {
  try {
    await guestboardApi.deleteGuestBoard(gbid);
    alert("삭제되었습니다.");

    offset.value = 0;
    guestboards.value = [];
    await fetchGuestboards();
  } catch (e) {
    console.error(e);
    alert("삭제 실패");
  }
}

onMounted(() => {
  fetchGuestboards();
});
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
