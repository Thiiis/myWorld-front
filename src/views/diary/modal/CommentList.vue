<template>
  <div class="comment-list mt-4 p-3 bg-white rounded-lg">

    <!-- 제목 + 댓글 수 -->
    <h6 class="fw-bold comment-header mb-3">
      댓글 ({{ comments.length }})
    </h6>

    <!-- 1. 댓글 입력창 (상단) -->
    <div class="d-flex mb-4 comment-input-group">
      <input
        v-model="newComment"
        type="text"
        class="form-control comment-input"
        placeholder="댓글을 입력하세요..."
        @keyup.enter="addComment"
      />
      <!-- 전송 아이콘 버튼: newComment가 비어있을 때 disabled-send 클래스 추가 -->
      <button 
        class="btn btn-send ms-2" 
        @click="addComment" 
        :disabled="!newComment.trim()"
        :class="{ 'disabled-send': !newComment.trim() }"
      >
        <i class="bi bi-send-fill"></i>
      </button>
    </div>

    <!-- 댓글 없음 -->
    <div v-if="!comments.length" class="text-muted small mb-3 text-center p-3">
      아직 댓글이 없습니다.
    </div>

    <!-- 2. 댓글 목록 -->
    <div
      v-for="c in comments"
      :key="c.id"
      class="mb-3"
    >
      <CommentItem
        :comment="c"
        @reply="startReply"
        @edit="startEdit"
        @delete="deleteComment"
        @saveEdit="saveEditComment"
        @cancelEdit="cancelEdit"
        @saveReplyEdit="saveEditReply"
      />

      <!-- 3. 대댓글 입력창 -->
      <div v-if="replyingTo === c.id" class="d-flex mt-3 ms-4 reply-input-group">
        <input
          v-model="replyContent"
          type="text"
          class="form-control comment-input"
          placeholder="대댓글을 입력하세요..."
          @keyup.enter="addReply(c.id)"
        />
        <!-- 대댓글 전송 버튼: replyContent가 비어있을 때 disabled-send 클래스 추가 -->
        <button 
            class="btn btn-send ms-2" 
            @click="addReply(c.id)" 
            :disabled="!replyContent.trim()"
            :class="{ 'disabled-send': !replyContent.trim() }"
        >
          <i class="bi bi-send-fill"></i>
        </button>
        <button class="btn btn-cancel ms-1" @click="cancelReply">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CommentItem from "./CommentItem.vue";

// -----------------------------
// [1] Props & Destructure
// -----------------------------
const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
});
// Prop을 직접 변경하지 않으려면 깊은 복사(deep copy)를 해야 하지만, 예시 로직을 위해 직접 참조 유지
// eslint-disable-next-line vue/no-setup-props-destructure
const comments = props.comments;

// -----------------------------
// [2] State Management
// -----------------------------
const newComment = ref("");
const replyContent = ref("");
const replyingTo = ref(null);

// 수정 중 상태 (로컬 상태는 CommentItem에서 관리하므로, 여기서는 사용하지 않음)
const editText = ref(""); 

// -----------------------------
// [3] 댓글 추가 (CRUD)
// -----------------------------
const addComment = () => {
  if (!newComment.value.trim()) return;
  comments.push({
    id: Date.now(),
    user: "평화로운일상", // 이미지의 사용자 이름으로 대체
    text: newComment.value,
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').slice(0, -1) + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }), // 이미지와 동일한 형식
    replies: [],
  });
  newComment.value = "";
};

const deleteComment = (cid) => {
  const idx = comments.findIndex((c) => c.id === cid);
  if (idx !== -1) comments.splice(idx, 1);
};

// -----------------------------
// [4] 대댓글 처리
// -----------------------------
const startReply = (cid) => {
  replyingTo.value = cid;
  replyContent.value = ""; // 입력창 초기화
};

const addReply = (cid) => {
  const comment = comments.find((c) => c.id === cid);
  if (!comment || !replyContent.value.trim()) return;

  comment.replies.push({
    id: Date.now(),
    user: "답글러",
    text: replyContent.value,
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').slice(0, -1) + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
  });
  replyContent.value = "";
  replyingTo.value = null;
};

const cancelReply = () => {
  replyingTo.value = null;
  replyContent.value = "";
};

// -----------------------------
// [5] 수정 기능 (CommentItem과의 통신을 위한 스텁)
// -----------------------------
const startEdit = (commentOrReply) => {
  // 실제로는 CommentItem의 editingComment 상태를 true로 설정하는 로직이 필요
  // 현재는 CommentItem이 로컬에서만 상태를 관리하므로, 이 이벤트는 사실상 CommentItem에서만 사용됨
  console.log('Editing started for:', commentOrReply.id);
};

const saveEditComment = (cid) => {
  // CommentItem이 $emit('saveEdit', id)를 보낼 때, 실제 수정된 텍스트를 인자로 받아야 함
  // 현재는 인자로 받은 ID를 이용해 데이터만 찾습니다.
  const target = comments.find((c) => c.id === cid);
  if (target) console.log(`Comment ${cid} saved. Actual text update logic needed.`);
};

const saveEditReply = (parentId, replyId) => {
  const parent = comments.find((c) => c.id === parentId);
  const reply = parent?.replies.find((r) => r.id === replyId);
  if (reply) console.log(`Reply ${replyId} saved. Actual text update logic needed.`);
};

const cancelEdit = () => {
  console.log('Editing canceled.');
};
</script>

<style scoped>
.comment-list {
  background: #fdfdfd;
  border-radius: 12px;
}
.comment-header {
  font-size: 1rem;
  color: #1d3557;
}

/* 댓글/대댓글 입력창 스타일 */
.comment-input-group, .reply-input-group {
    align-items: center;
}

.comment-input {
    border-radius: 20px;
    padding: 8px 15px;
    border-color: #e0e0e0;
    /* 입력창이 비어있을 때처럼 그림자 효과 추가 */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); 
}
.comment-input:focus {
    box-shadow: 0 0 0 0.25rem rgba(69, 123, 157, 0.25); /* 하늘색 포커스 효과 */
    border-color: #457b9d;
}

/* 전송 버튼 (파란색 아이콘 버튼) */
.btn-send {
    background-color: #a8dadc; /* 비활성화 시 연한 파란색 (기본값) */
    color: white;
    border-radius: 50%; /* 원형 버튼 */
    width: 38px;
    height: 38px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

/* 1. 비활성화 시 (글이 없을 때) 연하게 */
.btn-send.disabled-send, .btn-send:disabled {
    background-color: #a8dadc !important; /* 연한 파란색 */
    opacity: 1; /* disabled 기본 투명도 제거 */
    cursor: not-allowed;
}

/* 2. 활성화 시 (글이 있을 때) 진하게 */
.btn-send:not(.disabled-send):not(:disabled) {
    background-color: #457b9d; /* 진한 파란색 */
}

.btn-send:hover:not(:disabled):not(.disabled-send) {
    background-color: #1d3557;
}

.btn-send i {
    font-size: 1rem;
}

/* 대댓글 입력창 취소 버튼 */
.btn-cancel {
    background: none;
    border: none;
    color: #a8dadc;
    padding: 0 5px;
}
.btn-cancel:hover {
    color: #e63946;
}
</style>
