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
          class="border rounded py-2 px-3 mb-2 d-flex justify-content-between align-items-start"
        >
          <!-- 왼쪽: 닉네임 + 내용 -->
          <div class="flex-grow-1 me-3 d-flex align-items-center" style="cursor:pointer" @click="goToHome(board.account)">
            <img
              :src="board.profileImg ? `${backendUrl}${board.profileImg}` : defaultProfile"
              class="rounded-circle me-2"
              style="width: 40px; height: 40px; object-fit: cover;"
            />
            <div>
              <strong class="text-primary">🏠 {{ board.nickname || "친구" }}</strong>
              <p class="text-muted small mb-0">{{ board.content }}</p>
            </div>
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

          <!-- 수정 모드 -->
          <div v-else-if="editingId === board.gbid" class="edit-area mt-2 w-100">
            <textarea
              v-model="editContent"
              class="form-control mb-2 edit-textarea"
              rows="3"
              placeholder="수정할 내용을 입력하세요..."
            ></textarea>
            <div class="text-end mt-2 edit-btns">
              <button class="btn btn-primary btn-write me-2" @click="submitEdit(board.gbid)">완료</button>
              <button class="btn btn-outline-secondary btn-write" @click="cancelEdit">취소</button>
            </div>
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
import { useRoute, useRouter } from "vue-router";
import store from "@/store";
import defaultProfile from "@/assets/image/default-profile.png";
import { API_BASE_URL } from "@/config/env";

const router = useRouter();
const route = useRoute();
const backendUrl = API_BASE_URL;

const isWriting = ref(false);
const guestboards = ref([]);
const newContent = ref("");
const offset = ref(0);
const limit = ref(10);
const loading = ref(false);

const editingId = ref(null);
const editContent = ref("");

const account = route.params.account;
const mid = store.state.mid;

function goToHome(targetAccount) {
  if (!targetAccount) {
    alert("계정 정보를 불러올 수 없습니다.");
    return;
  }
  router.push(`/myworld/${targetAccount}`);
}

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

async function fetchGuestboards() {
  try {
    loading.value = true;
    const res = await guestboardApi.getGuestBoard(account, offset.value, limit.value);
    guestboards.value = res.data;
  } catch (e) {
    console.error(e);
    guestboards.value = [];
  } finally {
    loading.value = false;
  }
}

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
    await fetchGuestboards();
  } catch (e) {
    console.error(e);
    alert("삭제 실패");
  }
}

onMounted(fetchGuestboards);
</script>

<style scoped>
.friend-info strong {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
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

.nickname-link:hover {
  text-decoration: underline;
  color: #0d6efd;
}
</style>
