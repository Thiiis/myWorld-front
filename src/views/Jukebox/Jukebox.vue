<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>🎵 주크박스</h3>
      <div>
        <router-link
          :to="`/myworld/${$route.params.account}/jukebox/mysongs`"
          class="btn btn-outline-primary me-2"
        >
          나의 음악
        </router-link>
        <router-link
          :to="`/myworld/${$route.params.account}/jukebox/create`"
          class="btn btn-primary"
        >
          + 새 주크박스
        </router-link>
      </div>
    </div>

    <!-- 주크박스 목록 -->
    <div v-if="jukeboxes.length > 0" class="row">
      <div
        v-for="box in jukeboxes"
        :key="box.jid"
        class="col-md-4 mb-3"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <!-- 제목 클릭 시 상세보기 -->
            <h5
              class="card-title mb-0 text-primary fw-bold"
              style="cursor: pointer;"
              @click="openDetail(box.jid)"
            >
              {{ box.title }}
            </h5>
            <p class="text-muted small mb-3">{{ box.content }}</p>
          </div>

          <!-- 날짜 + 좋아요 -->
          <div class="card-footer d-flex justify-content-between align-items-center">
            <p class="small text-muted mb-0 ms-1">
              {{ box.updatedAt?.substring(0, 10) || box.createdAt?.substring(0, 10) }}
            </p>
            <button class="btn btn-sm" @click="toggleLike(box)">
              <span v-if="box.liked">❤️</span>
              <span v-else>🤍</span>
              {{ box.likeCount || box.likes }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 비었을 때 -->
    <div v-else class="text-center text-muted py-5 border rounded bg-light">
      <div class="mb-2" style="font-size: 2.5rem;">🎶</div>
      <p class="mb-0">아직 등록된 주크박스가 없습니다.</p>
    </div>

    <!-- 상세정보 모달 -->
<div
  class="modal fade show"
  tabindex="-1"
  style="display: block;"
  v-if="showModal"
  @click.self="closeModal"
>
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <!-- 🏷 헤더 -->
      <div class="modal-header d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <h5 class="modal-title mb-0">🎵 {{ detail.title }}</h5>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-primary btn-sm" @click="updateJukebox(detail.jid)">✏ 수정</button>
          <button class="btn btn-outline-danger btn-sm" @click="deleteJukebox(detail.jid)">🗑 삭제</button>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
      </div>

      <!-- 본문 -->
      <div class="modal-body">
        <p class="text-muted">{{ detail.content }}</p>
        <p><strong>총 재생시간:</strong> {{ formatDuration(detail.totalDuration) }}</p>
        <p><strong>수록곡 수:</strong> {{ detail.trackCount }}</p>

        <hr />
        <h6>🎶 수록곡</h6>
        <ul class="list-group">
          <li
            v-for="song in detail.songs"
            :key="song.sid"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            {{ song.title }} - {{ song.artist }}
            <span class="text-muted small">{{ song.duration }}초</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import jukeboxApi from "@/apis/jukeboxApi";

const store = useStore();
const router = useRouter();

const jukeboxes = ref([]);
const showModal = ref(false);
const detail = ref({});

// ✅ 주크박스 목록 불러오기
async function loadJukeboxes() {
  try {
    const mid = store.state.mid;
    const res = await jukeboxApi.getJukeboxList(mid);
    jukeboxes.value = res.data;
  } catch (err) {
    console.error("❌ 주크박스 목록 불러오기 실패:", err.response?.data || err);
  }
}

// ✅ 상세정보 불러오기
async function openDetail(jid) {
  try {
    const res = await jukeboxApi.getJukeboxDetail(jid);
    detail.value = res.data;
    showModal.value = true;
  } catch (err) {
    console.error("❌ 상세정보 불러오기 실패:", err.response?.data || err);
  }
}

function closeModal() {
  showModal.value = false;
  detail.value = {};
}

// ✏ 수정 페이지 이동
function updateJukebox(jid) {
  showModal.value = false;
  router.push(`/myworld/${store.state.account}/jukebox/update/${jid}`);
}

// 🗑 삭제 기능
async function deleteJukebox(jid) {
  if (!confirm("정말 이 주크박스를 삭제하시겠습니까?")) return;
  try {
    await jukeboxApi.deleteJukebox(jid);
    alert("삭제되었습니다!");
    showModal.value = false;
    loadJukeboxes();
  } catch (err) {
    console.error("❌ 삭제 실패:", err.response?.data || err);
  }
}

// ❤️ 좋아요 토글
async function toggleLike(box) {
  try {
    await jukeboxApi.toggleLike(box.jid);
    box.liked = !box.liked;
    box.likeCount += box.liked ? 1 : -1;
  } catch (err) {
    console.error("❌ 좋아요 실패:", err);
  }
}

function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

onMounted(() => {
  loadJukeboxes();
});
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
