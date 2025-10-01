<template>
  <div class="comment-item mb-3">
    <!-- 댓글 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-1">
      <div class="user-info">
        <strong class="comment-user">{{ comment.user }}</strong>
        <small class="text-muted ms-2 comment-date">{{ comment.date }}</small>
      </div>

      <!-- 댓글 액션 버튼 그룹 (수정/삭제/답글) -->
      <div class="d-flex gap-2 comment-actions">
        
        <!-- 댓글 수정/삭제 버튼 -->
        <button
          class="btn btn-sm btn-action-icon text-secondary"
          title="수정"
          @click="$emit('edit', comment)"
        >
          <i class="bi bi-pencil"></i>
        </button>
        <button
          class="btn btn-sm btn-action-icon text-danger"
          title="삭제"
          @click="$emit('delete', comment.id)"
        >
          <i class="bi bi-trash"></i>
        </button>
        
        <!-- 대댓글 작성 버튼 (파란색 Reply 버튼) -->
        <button
          class="btn btn-sm btn-reply-btn"
          title="답글"
          @click="$emit('reply', comment.id)"
        >
          <i class="bi bi-reply-fill"></i>
        </button>
      </div>
    </div>

    <!-- 댓글 수정 중 -->
    <div v-if="editingComment" class="d-flex mt-2 edit-form-group">
      <input
        v-model="editText"
        type="text"
        class="form-control form-control-sm"
        placeholder="댓글 수정..."
      />
      <button class="btn btn-success btn-sm ms-1" @click="$emit('saveEdit', comment.id)">
        저장
      </button>
      <button class="btn btn-outline-secondary btn-sm ms-1" @click="$emit('cancelEdit')">
        취소
      </button>
    </div>

    <!-- 일반 댓글 내용 -->
    <p v-else class="small mb-1 comment-text">{{ comment.text }}</p>

    <!-- 대댓글 리스트 (시각적 구분 강화) -->
    <div v-if="comment.replies?.length" class="ms-4 mt-2 reply-wrapper">
      <div
        v-for="reply in comment.replies"
        :key="reply.id"
        class="reply-item mb-2 p-2 rounded"
      >
        <div class="d-flex justify-content-between align-items-center mb-1">
          <div class="user-info">
            <strong class="text-secondary reply-user">{{ reply.user }}</strong>
            <small class="text-muted ms-2 comment-date">{{ reply.date }}</small>
          </div>
          <div class="d-flex gap-2 reply-actions">
            <!-- 대댓글 수정/삭제 버튼 -->
            <button
              class="btn btn-sm btn-action-icon text-secondary"
              title="수정"
              @click="editReply(reply)"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-sm btn-action-icon text-danger"
              title="삭제"
              @click="deleteReply(reply.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
            <!-- 대댓글에는 대댓글 버튼이 없도록 제외 -->
          </div>
        </div>

        <!-- 대댓글 수정 -->
        <div v-if="editingReplyId === reply.id" class="d-flex mt-2 edit-form-group">
          <input
            v-model="editText"
            type="text"
            class="form-control form-control-sm"
            placeholder="대댓글 수정..."
          />
          <button
            class="btn btn-success btn-sm ms-1"
            @click="$emit('saveReplyEdit', comment.id, reply.id)"
          >
            저장
          </button>
          <button class="btn btn-outline-secondary btn-sm ms-1" @click="editingReplyId = null">
            취소
          </button>
        </div>

        <p v-else class="small mb-0 comment-text">{{ reply.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
defineEmits([
  "reply",
  "edit",
  "delete",
  "saveEdit",
  "cancelEdit",
  "saveReplyEdit",
]);

// 로컬 편집 상태
const editingComment = ref(false);
const editingReplyId = ref(null);
const editText = ref("");

// reply 수정 진입
const editReply = (reply) => {
  editingReplyId.value = reply.id;
  editText.value = reply.text;
};

// reply 삭제
const deleteReply = (rid) => {
  // eslint-disable-next-line no-undef
  const idx = comment.replies.findIndex((r) => r.id === rid);
  // eslint-disable-next-line no-undef
  if (idx !== -1) comment.replies.splice(idx, 1);
};
</script>

<style scoped>
.comment-item {
  border-bottom: 1px solid #f0f0f0; /* 각 댓글을 얇은 선으로 구분 */
  padding-bottom: 10px;
  line-height: 1.4;
}

/* 댓글 사용자명 */
.comment-user {
  font-size: 0.95rem;
  font-weight: 600;
  color: #457b9d !important; /* 모달 헤더의 진한 파란색 계열 사용 */
}
.comment-date {
    font-size: 0.75rem;
}
.comment-text {
    font-size: 0.9rem;
    padding-top: 5px;
}

/* 액션 아이콘 버튼 스타일 */
.btn-action-icon {
  padding: 0 4px;
  font-size: 0.9rem;
  background: none;
  border: none;
}
.btn-action-icon:hover {
    background: #f0f0f0;
    border-radius: 4px;
}

/* 답글 버튼 스타일 (파란색 글자 + 아이콘) */
.btn-reply-btn {
    padding: 0 4px;
    font-size: 0.85rem;
    color: #457b9d; /* 파란색 */
    background: none;
    border: none;
    font-weight: 500;
}
.btn-reply-btn:hover {
    color: #1d3557;
    background: #f0f0f0;
    border-radius: 4px;
}

/* 대댓글 영역 스타일 */
.reply-wrapper {
  /* 대댓글 영역은 시각적으로 약간 안쪽으로 들어가고 배경색을 줘서 구분 */
  border-left: 2px solid #e0e0e0;
  padding-left: 10px;
}

.reply-item {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 8px !important;
}

.reply-user {
    color: #1d3557 !important;
}
</style>

---

## 📄 2. CommentList.vue (전체 댓글 리스트) 업데이트

댓글 입력창 디자인을 이미지처럼 **둥근 모서리와 아이콘 버튼**으로 변경하고, 대댓글 입력창도 동일하게 통일했습니다.
