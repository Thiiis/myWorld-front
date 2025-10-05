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
            <!-- 제목 + 수정/삭제 버튼 -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">{{ box.title }}</h5>

              <div class="d-flex gap-2">
                <!-- ✏ 수정 버튼 -->
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="updateJukebox(box.jid)"
                >
                  ✏
                </button>

                <!-- 🗑 삭제 버튼 -->
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteJukebox(box.jid)"
                >
                  🗑
                </button>
              </div>
            </div>

            <!-- 내용 -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import jukeboxApi from "@/apis/jukeboxApi";

const jukeboxes = ref([]);
const store = useStore();
const router = useRouter();

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

// ✏ 수정 페이지 이동
function updateJukebox(jid) {
  router.push(`/myworld/${store.state.account}/jukebox/update/${jid}`);
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

// 🗑 삭제 기능
async function deleteJukebox(jid) {
  if (!confirm("정말 이 주크박스를 삭제하시겠습니까?")) return;
  try {
    await jukeboxApi.deleteJukebox(jid);
    alert("삭제되었습니다!");
    loadJukeboxes();
  } catch (err) {
    console.error("❌ 삭제 실패:", err.response?.data || err);
    alert("삭제 중 오류가 발생했습니다.");
  }
}

onMounted(() => {
  loadJukeboxes();
});
</script>
