<template>
  <div class="comment-list mt-4 p-3 bg-white rounded-lg">

    <h6 class="fw-bold comment-header mb-3">
      댓글 ({{ comments.length }})
    </h6>

    <!-- 댓글 입력창 -->
    <div class="d-flex mb-4 comment-input-group">
      <input
        v-model="newComment"
        type="text"
        class="form-control comment-input"
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
    <div v-for="c in comments" :key="c.id" class="mb-3">
      <CommentItem
        :comment="c"
        @reply="startReply"
        @edit="emitEditComment"
        @delete="emitDeleteComment"
        @saveEdit="emitSaveEditComment"
        @cancelEdit="emitCancelEdit"
        @saveReplyEdit="emitSaveReplyEdit"
      />

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
import CommentItem from "@/views/Diary/modal/CommentItem.vue";

// v-model용 props & emit
const props = defineProps({
  comments: { type: Array, default: () => [] }
});
const emit = defineEmits([
  "update:comments"
]);

// 로컬 상태
const newComment = ref("");
const replyContent = ref("");
const replyingTo = ref(null);

// -----------------------------
// Emit helpers
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

const cancelReply = () => {
  replyingTo.value = null;
  replyContent.value = "";
};

// 편집 관련 (샘플 emit)
const emitEditComment = (comment) => console.log("편집 시작:", comment);
const emitSaveEditComment = (cid) => console.log("저장 요청:", cid);
const emitSaveReplyEdit = (pid, rid) => console.log("대댓글 저장 요청:", pid, rid);
const emitCancelEdit = () => console.log("편집 취소");
const startReply = (cid) => replyingTo.value = cid;
</script>
