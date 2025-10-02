<template>
  <div class="comment-item mb-3">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <div class="user-info">
        <strong class="comment-user">{{ comment.user }}</strong>
        <small class="text-muted ms-2 comment-date">{{ comment.date }}</small>
      </div>

      <div class="d-flex gap-2 comment-actions">
        <button class="btn btn-sm btn-action-icon text-secondary" title="수정" @click="$emit('edit', comment)">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-action-icon text-danger" title="삭제" @click="$emit('delete', comment.id)">
          <i class="bi bi-trash"></i>
        </button>
        <button class="btn btn-sm btn-reply-btn" title="답글" @click="$emit('reply', comment.id)">
          <i class="bi bi-reply-fill"></i>
        </button>
      </div>
    </div>

    <p class="small mb-1 comment-text">{{ comment.text }}</p>

    <div v-if="comment.replies?.length" class="ms-4 mt-2 reply-wrapper">
      <div v-for="reply in comment.replies" :key="reply.id" class="reply-item mb-2 p-2 rounded">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <div class="user-info">
            <strong class="text-secondary reply-user">{{ reply.user }}</strong>
            <small class="text-muted ms-2 comment-date">{{ reply.date }}</small>
          </div>
          <div class="d-flex gap-2 reply-actions">
            <button class="btn btn-sm btn-action-icon text-secondary" title="수정"
              @click="$emit('saveReplyEdit', comment.id, reply.id)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-action-icon text-danger" title="삭제"
              @click="$emit('delete', reply.id)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <p class="small mb-0 comment-text">{{ reply.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comment: { type: Object, required: true }
});
defineEmits(["reply", "edit", "delete", "saveEdit", "cancelEdit", "saveReplyEdit"]);
</script>
