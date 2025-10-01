<template>
  <div class="modal fade show d-block">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content p-3 rounded-4 shadow">
        <div class="modal-header border-0">
          <h5 class="fw-bold text-primary">{{ entry.title }}</h5>
          <button class="btn-close" @click="$emit('close')"></button>
        </div>

        <div class="modal-body">
          <!-- 이미지 -->
          <div class="text-center mb-3">
            <img :src="entry.images[imageIndex]" class="img-fluid rounded" />
          </div>

          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>{{ entry.moodEmoji }} {{ entry.weatherEmoji }}</div>
            <div><i class="bi bi-heart text-danger"></i> {{ entry.likes }}</div>
          </div>

          <p class="text-muted">{{ entry.content }}</p>

          <!-- 댓글 -->
          <CommentSection :entry="entry" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CommentSection from "@/components/diary/CommentSection.vue";
const props = defineProps({ entry: Object });
const imageIndex = ref(0);
</script>


<!-- <template>
  <div class="container py-4" v-if="entry">
    <div class="card shadow-sm p-4">
      <h4 class="fw-bold text-primary mb-3">{{ entry.title }}</h4>
      <img v-if="entry.images?.length" :src="entry.images[0]" class="img-fluid rounded mb-3" />
      <p class="text-muted">{{ entry.content }}</p>

      <div class="mt-3">
        <button class="btn btn-outline-primary me-2" @click="goEdit(entry.id)">수정</button>
        <button class="btn btn-outline-danger" @click="remove(entry.id)">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { useDiaryStore } from '@/store/diary'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useDiaryStore()

    const entry = store.getById(route.params.id)
    const goEdit = (id) => router.push(`/diary/edit/${id}`)
    const remove = (id) => {
      store.deleteById(id)
      router.push('/diary')
    }

    return { entry, goEdit, remove }
  }
}
</script> -->


<!-- <template>
  <div>
    <button @click="$emit('back')">목록으로</button>
    <button @click="editEntry">수정</button>

    <h2>{{ localEntry.title }}</h2>
    <p>{{ localEntry.date }}</p>
    <p>{{ localEntry.content }}</p>

    <div v-if="localEntry.images.length">
      <button @click="prevImage">◀</button>
      <img :src="localEntry.images[currentImage]" width="200" />
      <button @click="nextImage">▶</button>
    </div>

    <p>좋아요: {{ localEntry.likes }}</p>

    <div>
      <h4>댓글</h4>
      <div v-for="comment in topLevelComments" :key="comment.id" style="margin-bottom:10px;">
        <div>
          <span v-if="editingCommentId !== comment.id">{{ comment.userName }}: {{ comment.content }}</span>
          <input v-else v-model="editCommentContent" />
          <button v-if="editingCommentId !== comment.id" @click="startEdit(comment)">수정</button>
          <button v-else @click="saveEdit(comment)">저장</button>
          <button @click="deleteComment(comment.id)">삭제</button>
          <button @click="toggleReply(comment.id)">답글</button>
        </div>

        <div v-if="replyingTo === comment.id" style="margin-left:20px;">
          <input v-model="newReply" placeholder="대댓글 입력" />
          <button @click="addReply(comment.id)">등록</button>
          <button @click="cancelReply">취소</button>
        </div>

        <div v-for="child in childComments(comment.id)" :key="child.id" style="margin-left:20px;">
          <span v-if="editingCommentId !== child.id">{{ child.userName }}: {{ child.content }}</span>
          <input v-else v-model="editCommentContent" />
          <button v-if="editingCommentId !== child.id" @click="startEdit(child)">수정</button>
          <button v-else @click="saveEdit(child)">저장</button>
          <button @click="deleteComment(child.id)">삭제</button>
        </div>
      </div>

      <input v-model="newComment" placeholder="댓글 입력" />
      <button @click="addComment">댓글 등록</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['back', 'updateEntry', 'editEntry'])

// 로컬 복사본 생성
const localEntry = ref({ ...props.entry })
watch(() => props.entry, (newVal) => localEntry.value = { ...newVal })

// 이미지
const currentImage = ref(0)
const nextImage = () => { if(localEntry.value.images.length) currentImage.value = (currentImage.value + 1) % localEntry.value.images.length }
const prevImage = () => { if(localEntry.value.images.length) currentImage.value = (currentImage.value - 1 + localEntry.value.images.length) % localEntry.value.images.length }

// 댓글 상태
const newComment = ref('')
const newReply = ref('')
const replyingTo = ref(null)
const editingCommentId = ref(null)
const editCommentContent = ref('')

// 댓글 필터링
const topLevelComments = computed(() => localEntry.value.comments.filter(c => !c.parentId))
const childComments = (parentId) => localEntry.value.comments.filter(c => c.parentId === parentId)

// 댓글/대댓글 등록
const addComment = () => {
  if(!newComment.value.trim()) return
  localEntry.value.comments.push({ id:`comment_${Date.now()}`, userName:'사용자', content:newComment.value, parentId:null })
  newComment.value = ''
  emit('updateEntry', localEntry.value)
}

const addReply = (parentId) => {
  if(!newReply.value.trim()) return
  localEntry.value.comments.push({ id:`comment_${Date.now()}`, userName:'사용자', content:newReply.value, parentId })
  newReply.value = ''
  replyingTo.value = null
  emit('updateEntry', localEntry.value)
}

const toggleReply = (commentId) => replyingTo.value = replyingTo.value === commentId ? null : commentId
const cancelReply = () => { replyingTo.value = null; newReply.value = '' }

// 댓글 수정
const startEdit = (comment) => {
  editingCommentId.value = comment.id
  editCommentContent.value = comment.content
}

const saveEdit = (comment) => {
  comment.content = editCommentContent.value
  editingCommentId.value = null
  editCommentContent.value = ''
  emit('updateEntry', localEntry.value)
}

// 댓글 삭제 (자식 댓글까지 재귀 삭제)
const deleteComment = (id) => {
  const removeRecursive = (commentId) => {
    const children = localEntry.value.comments.filter(c => c.parentId === commentId)
    children.forEach(c => removeRecursive(c.id))
    localEntry.value.comments = localEntry.value.comments.filter(c => c.id !== commentId)
  }
  removeRecursive(id)
  emit('updateEntry', localEntry.value)
}

// 수정 이벤트
const editEntry = () => emit('editEntry', localEntry.value)
</script> -->
