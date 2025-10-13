<template>
  <div class="minihome-container p-3">
    <div class="row g-4">
      <!-- 📝 일기장 -->
      <div class="col-md-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-light border-0 pt-3 d-flex align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-journal-richtext text-success me-2"></i>최근 일기장
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loadingDiaries" class="text-center text-muted py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2 mb-0">일기를 불러오는 중...</p>
            </div>

            <ul v-else-if="diaries.length > 0" class="list-group list-group-flush">
              <li
                v-for="(d, idx) in diaries"
                :key="idx"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{{ d.title || "(제목 없음)" }}</strong>
                  <p class="text-muted small mb-0">
                    {{ d.content?.slice(0, 40) || "(내용 없음)" }}
                  </p>
                </div>
                <small class="text-muted">{{ formatDate(d.createdAt) }}</small>
              </li>
            </ul>

            <div v-else class="text-center text-muted py-4">
              <p class="mb-0">아직 작성된 일기가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 💬 방명록 -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-light border-0 pt-3 d-flex align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-chat-left-dots-fill text-warning me-2"></i>최근 방명록
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loadingGuest" class="text-center text-muted py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2 mb-0">방명록을 불러오는 중...</p>
            </div>

            <ul v-else-if="guestbooks.length > 0" class="list-group list-group-flush">
              <li
                v-for="(g, idx) in guestbooks"
                :key="idx"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{{ g.nickname || "익명" }}</strong>
                  <p class="text-muted small mb-0">
                    {{ g.content || "(내용 없음)" }}
                  </p>
                </div>
              </li>
            </ul>

            <div v-else class="text-center text-muted py-4">
              <p class="mb-0">아직 방명록이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 👥 친구 (아래 전체 폭) -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-light border-0 pt-3 d-flex align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-people-fill text-info me-2"></i>내 친구
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loadingFriends" class="text-center text-muted py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2 mb-0">친구 목록을 불러오는 중...</p>
            </div>

            <ul v-else-if="friends.length > 0" class="list-group list-group-flush">
              <li
                v-for="(f, idx) in friends"
                :key="idx"
                class="list-group-item d-flex align-items-center"
              >
                <span>🤝 {{ f.nickname || "알 수 없는 사용자" }}님과 친구가 되었습니다.</span>
              </li>
            </ul>

            <div v-else class="text-center text-muted py-4">
              <p class="mb-0">아직 친구가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import diaryApi from "@/apis/diaryApi";
import guestboardApi from "@/apis/guestboardApi";
import friendApi from "@/apis/friendApi";
import store from "@/store";

const route = useRoute();
const account = route.params.account;
const mid = store.state.mid;

// state
const diaries = ref([]);
const guestbooks = ref([]);
const friends = ref([]);

const loadingDiaries = ref(true);
const loadingGuest = ref(true);
const loadingFriends = ref(true);

// 날짜 포맷
function formatDate(date) {
  if (!date) return "";
  const diff = (new Date() - new Date(date)) / 1000;
  if (diff < 60) return "방금 전";
  if (diff < 3600) return Math.floor(diff / 60) + "분 전";
  if (diff < 86400) return Math.floor(diff / 3600) + "시간 전";
  return new Date(date).toLocaleDateString("ko-KR");
}

// 데이터 불러오기
async function loadData() {
  try {
    const [diaryRes, guestRes, friendRes] = await Promise.all([
      diaryApi.getDiaries(1, account),
      guestboardApi.getGuestBoard(account, 0, 4),
      friendApi.getFriendList(mid),
    ]);

    const diaryList = Array.isArray(diaryRes.data?.diaries)
      ? diaryRes.data.diaries
      : diaryRes.data;
    diaries.value = (diaryList || []).slice(0, 4);

    guestbooks.value = (guestRes.data || []).slice(0, 4);

    // ✅ 친구 목록
const friendList = Array.isArray(friendRes.data)
  ? friendRes.data
  : friendRes.data?.friends;

friends.value = (friendList || [])
  .map(f => ({
    nickname: f.friendInfo?.nickname || "알 수 없는 사용자",
    account: f.friendInfo?.account || "unknown",
    date: f.createdAt
  }))
  .slice(0, 4);

  } catch (e) {
    console.error("데이터 불러오기 실패:", e);
  } finally {
    loadingDiaries.value = false;
    loadingGuest.value = false;
    loadingFriends.value = false;
  }
}

onMounted(() => loadData());
</script>

<style scoped>
.pixel-font {
  font-family: "Pixelify Sans", sans-serif;
}

.minihome-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-group-item {
  border: none;
  border-bottom: 1px solid #f1f3f5 !important;
}

.list-group-item:last-child {
  border-bottom: none !important;
}
</style>
