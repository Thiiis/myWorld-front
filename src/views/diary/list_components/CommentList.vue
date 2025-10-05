<template>
  <div class="comment-list mt-4 p-3 bg-white rounded-lg">

    <h6 class="fw-bold comment-header mb-3"> 댓글 ({{ comments.length }}) </h6>
    <!-- 댓글 입력창 -->
    <div class="d-flex mb-4 comment-input-group">
      <input v-model="newComment" type="text" class="form-control comment-input"
        placeholder="댓글을 입력하세요..."
        @keyup.enter="emitAddComment"
      />
      <button 
        class="btn btn-send ms-2" 
        @click="emitAddComment" 
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

    <!-- 댓글 목록 -->
    <div v-for="c in comments" :key="c.id" class="comment-item mb-3">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <div class="user-info">
          <strong class="comment-user">{{ c.user }}</strong>
          <small class="text-muted ms-2 comment-date">{{ c.date }}</small>
        </div>

        <!-- 댓글 액션 -->
        <div class="d-flex gap-2 comment-actions">
          <template v-if="editingComment !== c.id">
            <button class="btn btn-sm btn-action-icon text-secondary" title="수정" @click="startEditComment(c)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-action-icon text-danger" title="삭제" @click="emitDeleteComment(c.id)">
              <i class="bi bi-trash"></i>
            </button>
            <button class="btn btn-sm btn-reply-btn" title="답글" @click="startReply(c.id)">
              <i class="bi bi-reply-fill"></i>
            </button>
          </template>
        </div>
      </div>

      <!-- 댓글 수정 입력창 / 일반 텍스트 -->
      <div v-if="editingComment === c.id" class="d-flex align-items-center gap-2 mb-2">
        <input v-model="editContent" type="text" class="form-control form-control-sm" />
        <button class="btn btn-sm btn-success" @click="emitSaveEditComment(c.id)">저장</button>
        <button class="btn btn-sm btn-secondary" @click="cancelEdit">취소</button>
      </div>
      <p v-else class="small mb-1 comment-text">{{ c.text }}</p>

      <!-- 대댓글 목록 -->
      <div v-if="c.replies?.length" class="ms-4 mt-2 reply-wrapper">
        <div v-for="reply in c.replies" :key="reply.id" class="reply-item mb-2 p-2 rounded">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="user-info">
              <strong class="text-secondary reply-user">{{ reply.user }}</strong>
              <small class="text-muted ms-2 comment-date">{{ reply.date }}</small>
            </div>

            <!-- 대댓글 액션 -->
            <div class="d-flex gap-2 reply-actions">
              <template v-if="editingReply?.id !== reply.id">
                <button class="btn btn-sm btn-action-icon text-secondary" title="수정"
                  @click="startEditReply(c.id, reply)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-action-icon text-danger" title="삭제"
                  @click="emitDeleteReply(c.id, reply.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </template>
            </div>
          </div>

          <!-- 대댓글 수정 입력창 / 일반 텍스트 -->
          <div v-if="editingReply?.id === reply.id" class="d-flex align-items-center gap-2">
            <input v-model="editContent" type="text" class="form-control form-control-sm" />
            <button class="btn btn-sm btn-success" @click="emitSaveReplyEdit(c.id, reply.id)">저장</button>
            <button class="btn btn-sm btn-secondary" @click="cancelEdit">취소</button>
          </div>
          <p v-else class="small mb-0 comment-text">{{ reply.text }}</p>
        </div>
      </div>

      <!-- 대댓글 입력창 -->
      <div v-if="replyingTo === c.id" class="d-flex mt-3 ms-4 reply-input-group">
        <input
          v-model="replyContent"
          type="text"
          class="form-control comment-input"
          placeholder="대댓글을 입력하세요..."
          @keyup.enter="emitAddReply(c.id)"
        />
        <button 
          class="btn btn-send ms-2" 
          @click="emitAddReply(c.id)" 
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

const props = defineProps({
  comments: { type: Array, default: () => [] }
});
const emit = defineEmits(["update:comments"]);

const newComment = ref("");
const replyContent = ref("");
const replyingTo = ref(null);

const editingComment = ref(null);   // 편집 중인 댓글 ID
const editingReply = ref(null);     // 편집 중인 대댓글 { pid, id }
const editContent = ref("");

// -----------------------------
// 댓글 추가/삭제
// -----------------------------
const emitAddComment = () => {
  if (!newComment.value.trim()) return;
  const newC = {
    id: Date.now(),
    user: "평화로운일상",
    text: newComment.value,
    date: new Date().toLocaleString("ko-KR", { hour12: false }),
    replies: [],
  };
  emit("update:comments", [...props.comments, newC]);
  newComment.value = "";
};

const emitDeleteComment = (cid) => {
  emit("update:comments", props.comments.filter(c => c.id !== cid));
};

// -----------------------------
// 대댓글 추가/삭제
// -----------------------------
const emitAddReply = (cid) => {
  if (!replyContent.value.trim()) return;
  const updated = props.comments.map(c => {
    if (c.id === cid) {
      return {
        ...c,
        replies: [...c.replies, {
          id: Date.now(),
          user: "답글러",
          text: replyContent.value,
          date: new Date().toLocaleString("ko-KR", { hour12: false })
        }]
      };
    }
    return c;
  });
  emit("update:comments", updated);
  replyContent.value = "";
  replyingTo.value = null;
};

const emitDeleteReply = (cid, rid) => {
  const updated = props.comments.map(c => {
    if (c.id === cid) {
      return {
        ...c,
        replies: c.replies.filter(r => r.id !== rid)
      };
    }
    return c;
  });
  emit("update:comments", updated);
};

// -----------------------------
// 편집 (댓글 / 대댓글)
// -----------------------------
const startEditComment = (comment) => {
  editingComment.value = comment.id;
  editContent.value = comment.text;
};

const emitSaveEditComment = (cid) => {
  const updated = props.comments.map(c => {
    if (c.id === cid) {
      return { ...c, text: editContent.value };
    }
    return c;
  });
  emit("update:comments", updated);
  cancelEdit();
};

const startEditReply = (pid, reply) => {
  editingReply.value = { pid, id: reply.id };
  editContent.value = reply.text;
};

const emitSaveReplyEdit = (pid, rid) => {
  const updated = props.comments.map(c => {
    if (c.id === pid) {
      return {
        ...c,
        replies: c.replies.map(r => r.id === rid ? { ...r, text: editContent.value } : r)
      };
    }
    return c;
  });
  emit("update:comments", updated);
  cancelEdit();
};

const cancelEdit = () => {
  editingComment.value = null;
  editingReply.value = null;
  editContent.value = "";
};
// 답글 입력창 열기/닫기
const startReply = (cid) => replyingTo.value = cid;
const cancelReply = () => { replyingTo.value = null; replyContent.value = ""; };
</script>
