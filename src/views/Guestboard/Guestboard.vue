<template>
  <div class="container my-4">
    <div class="card-body">
      <div class="d-flex justify-content-end align-items-center mb-3">
        <button v-if="!isWriting" class="btn btn-outline-primary" @click="isWriting = true">
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
          class="border rounded py-2 px-3 mb-2"
        >
          <div class="d-flex justify-content-between align-items-start">
            <!-- 왼쪽: 닉네임 + 내용 -->
            <div class="flex-grow-1 me-3">
              <span class="fw-bold text-primary me-2">{{ board.nickname || "친구" }}:</span>

              <!-- 일반 모드 -->
              <template v-if="editingId !== board.gbid">
                <span>{{ board.content }}</span>
              </template>

              <!-- 수정 모드 -->
              <template v-else>
                <div class="edit-area mt-2 w-100">
                  <textarea
                    v-model="editContent"
                    class="form-control mb-2 edit-textarea"
                    rows="3"
                    placeholder="수정할 내용을 입력하세요..."
                  ></textarea>
                  <div class="mt-2 edit-btns">
                    <button class="btn btn-primary btn-write me-2" @click="submitEdit(board.gbid)">완료</button>
                    <button class="btn btn-outline-secondary btn-write" @click="cancelEdit">취소</button>
                  </div>
                </div>
              </template>
            </div>

            <!-- 오른쪽: 수정/삭제 버튼 -->
            <div
              v-if="board.gid == mid && editingId !== board.gbid"
              class="d-flex align-items-start gap-2 mt-1"
            >
              <button class="btn btn-outline-secondary btn-sm action-btn" @click="startEdit(board)">
                수정
              </button>
              <button class="btn btn-outline-danger btn-sm action-btn" @click="deleteBoard(board.gbid)">
                삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 📜 더보기 버튼 -->
        <div class="text-center mt-3" v-if="!loading && hasMore">
          <button class="btn btn-outline-primary rounded-pill px-4" @click="loadMore">
            이전 방명록 보기
          </button>
        </div>

        <!-- 로딩 표시 -->
        <div v-if="loading" class="text-center text-muted mt-3">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">불러오는 중...</p>
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
const hasMore = ref(true); // ✅ 추가: 더 불러올 데이터가 있는지 여부

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
    hasMore.value = true;
    await fetchGuestboards();
  } catch (err) {
    console.error(err);
  }
}

// ✅ 방명록 불러오기
async function fetchGuestboards() {
  try {
    loading.value = true;
    const res = await guestboardApi.getGuestBoard(account, offset.value, limit.value);
    const data = res.data || [];

    if (data.length < limit.value) {
      hasMore.value = false; // 마지막 페이지
    }

    if (offset.value === 0) {
      guestboards.value = data;
    } else {
      guestboards.value.push(...data);
    }

    offset.value += limit.value;
  } catch (e) {
    console.error(e);
    guestboards.value = [];
  } finally {
    loading.value = false;
  }
}

// ✅ 더보기 버튼 클릭
async function loadMore() {
  if (loading.value || !hasMore.value) return;
  await fetchGuestboards();
}

// 수정 관련
function startEdit(board) {
  editingId.value = board.gbid;
  editContent.value = board.content;
}

function cancelEdit() {
  editingId.value = null;
  editContent.value = "";
}

async function submitEdit(gbid) {
  try {
    await guestboardApi.updateGuestBoard({ gbid, content: editContent.value });
    alert("수정되었습니다");
    editingId.value = null;
    editContent.value = "";

    offset.value = 0;
    guestboards.value = [];
    hasMore.value = true;
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
    hasMore.value = true;
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
.edit-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.edit-textarea {
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
  resize: none;
  font-size: 0.95rem;
  padding: 8px 12px;
}

.edit-btns {
  display: flex;
  justify-content: flex-end;
  padding-right: 2%;
}

.btn-write {
  font-size: 0.9rem;
  padding: 6px 16px;
  border-radius: 8px;
}
</style>
