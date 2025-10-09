<template>
  <div class="comment-list">

    <!-- 고정 영역 -->
    <div class="comment-header-sticky">
      <!-- 헤더 -->
      <div class="d-flex align-items-center justify-content-between mb-2">
        <h6 class="m-0 fw-bold">댓글</h6>
      </div>

      <!-- 작성 -->
      <div class="comment-editor border rounded-3 p-2 mb-2">
        <label class="form-label small mb-2 text-muted">새 댓글</label>
        <textarea v-model="newContent" rows="3" class="form-control"
          placeholder="내용을 입력하고 Ctrl+Enter로 등록"
          @keyup.ctrl.enter="onCreate"></textarea>
        <div class="text-end mt-2">
          <button class="btn btn-primary btn-sm" :disabled="posting" @click="onCreate">
            <span v-if="posting" class="spinner-border spinner-border-sm me-2"></span>등록
          </button>
        </div>
      </div>
    </div>

    <!-- 로딩 -->
    <div v-if="loading" class="text-center py-3 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      불러오는 중...
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="alert alert-danger py-2">
      댓글을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
    </div>

    <!-- 리스트 -->
    <ul v-else class="list-unstyled mb-3">
      <li v-for="c in comments" :key="c.dcid" class="p-2 rounded-3 border mb-2 bg-light">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1 pe-2">
            <!-- 내용 / 편집영역 -->
            <div v-if="editingId === c.dcid" class="mb-2">
              <textarea v-model="editBuffer" rows="3" class="form-control" placeholder="댓글을 입력하세요" @keyup.ctrl.enter="onSubmitEdit(c)" />
              <div class="d-flex gap-2 mt-2">
                <button class="btn btn-sm btn-primary" @click="onSubmitEdit(c)">
                  저장
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click="cancelEdit">
                  취소
                </button>
              </div>
            </div>
            <p v-else class="mb-1 text-dark" style="white-space: pre-line;">{{ c.content }}</p>

            <!-- 메타 -->
            <div class="small text-muted">
              <span class="me-2">{{ formatDate(c.createdAt) }}</span>
              <span v-if="c.updatedAt && c.updatedAt !== c.createdAt">(수정됨)</span>
              <span v-if="c.mine" class="badge bg-secondary-subtle text-secondary ms-2 align-middle">내 댓글</span>
            </div>
          </div>

          <!-- 액션 -->
          <div class="ms-2" v-if="c.mine && editingId !== c.dcid">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" @click="startEdit(c)">수정</button>
              <button class="btn btn-outline-danger" @click="onDelete(c)">삭제</button>
            </div>
          </div>
        </div>
      </li>

      <!-- 비었을 때 -->
      <li v-if="!comments.length" class="text-center text-muted py-3">
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
      </li>
    </ul>

  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

// 부모에서 내려옴
const props = defineProps({ did: { type: [String, Number], required: true, }, });
const store = useStore();
// Vuex 연결
const comments = computed(() => store.getters["diary/comments"]);
const loading = computed(() => store.getters["diary/commentsLoading"]);
const error = computed(() => store.getters["diary/commentsError"]);
// 폼 상태
const newContent = ref("");
const posting = ref(false);
// 수정 상태
const editingId = computed(() => store.getters["diary/editingCommentId"]);
const editBuffer = ref("");
// 최초/변경 시 댓글 로드 (부모에서도 fetchDiary에서 불러오지만, 방어적으로 한 번 더)
const load = async () => {
  if (!props.did) return;
  await store.dispatch("diary/fetchComments", props.did);
};
onMounted(load);
watch(() => props.did, load);
// 날짜 포맷 (간단)
function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  } catch {
    return iso;
  }
}
// 생성
const onCreate = async () => {
  const content = newContent.value?.trim();
  if (!content) return alert("내용을 입력하세요.");
  if (!props.did) return;

  posting.value = true;
  try {
    await store.dispatch("diary/createComment", { did: props.did, content });
    newContent.value = "";
  } catch (e) {
    console.error("댓글 생성 실패:", e);
    alert("댓글 등록에 실패했습니다.");
  } finally {
    posting.value = false;
  }
};
// 수정 시작
const startEdit = (c) => { editBuffer.value = c.content; store.commit("diary/setEditingCommentId", c.dcid); };
// 수정 취소
const cancelEdit = () => { editBuffer.value = ""; store.commit("diary/clearEditingCommentId"); };
// 수정 제출
const onSubmitEdit = async (c) => {
  const content = editBuffer.value?.trim();
  if (!content) return alert("내용을 입력하세요.");
  try {
    await store.dispatch("diary/updateComment", { did: props.did, dcid: c.dcid, content });
    editBuffer.value = "";
  } catch (e) {
    console.error("댓글 수정 실패:", e);
    alert("댓글 수정에 실패했습니다.");
  }
};
// 삭제
const onDelete = async (c) => {
  if (!confirm("이 댓글을 삭제하시겠습니까?")) return;
  try {
    await store.dispatch("diary/deleteComment", { did: props.did, dcid: c.dcid });
  } catch (e) {
    console.error("댓글 삭제 실패:", e);
    alert("댓글 삭제에 실패했습니다.");
  }
};
</script>

<style scoped>
.comment-list{display:flex;flex-direction:column;min-height:0;}

.comment-header-sticky{position:sticky;top:0;z-index:2;background:#fff;border-bottom:1px solid #e7edff;padding:6px 0;}
.comment-header-sticky textarea{max-height:160px;overflow:auto;}
@media (prefers-color-scheme:dark){.comment-header-sticky{background:#0f1730;border-color:rgba(100,120,255,.20);}}
</style>