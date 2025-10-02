<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      받은 친구 요청
    </div>

    <div class="card-body">
      <ul class="list-group">
        <li v-for="req in requests" :key="req.fid" class="list-group-item d-flex justify-content-between align-items-center">
          <!-- 친구 이미지 -->
          <div class="d-flex align-items-center" @click="goToHome(req.requester.account)" style="cursor:pointer">
            <img :src="req.requester?.imgUrl ? `${backendUrl}${req.requester.imgUrl}` : defaultProfile" alt="이미지" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;" />
          </div>

          <!-- 닉네임 + 상태메세지 -->
          <div class="requester-info" @click="goToHome(req.requester.account)" style="cursor:pointer">
            <strong>🏠 {{ req.requester.nickname }}</strong>
            <span class="text-muted small">
              {{ req.requester?.statusMessage || '상태메세지가 없습니다.' }}
            </span>
          </div>

          <!-- 관리 버튼 -->
          <div class="d-flex">
            <button class="btn btn-primary btn-sm me-1" @click="accept(req.fid)">
              수락
            </button>
            <button class="btn btn-secondary btn-sm" @click="reject(req.fid)">
              거절
            </button>
          </div>
        </li>
      </ul>

      <p v-if="requests.length === 0" class="mt-3 text-muted text-center">
        받은 요청이 없습니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import friendApi from "@/apis/friendApi";
import defaultProfile from "@/assets/image/default-profile.png"

const backendUrl = 'http://192.168.4.42:8080';

const router = useRouter();
const requests = ref([]);

// ✅ 받은 친구 요청 불러오기
async function loadRequests() {
  try {
    const res = await friendApi.getFriendRequests(); // 로그인 사용자의 요청만 조회
    requests.value = res.data;
  } catch (err) {
    console.error(err);
  }
}

// ✅ 친구 홈으로 이동
function goToHome(account) {
  if (account) {
    router.push(`/myworld/${account}`);
  } else {
    alert("이 친구의 계정 정보를 불러올 수 없습니다.");
  }
}

// ✅ 수락
async function accept(fid) {
  try {
    await friendApi.acceptFriend(fid);
    alert("친구를 수락했습니다.");
    loadRequests();
  } catch (err) {
    console.error(err);
  }
}

// ✅ 거절
async function reject(fid) {
  if (!confirm("친구 요청을 거절하시겠습니까?")) return;
  try {
    await friendApi.rejectFriend(fid);
    alert("친구를 거절했습니다.");
    loadRequests();
  } catch (err) {
    console.error(err);
  }
}

onMounted(loadRequests);
</script>

<style scoped>
.text-muted {
  font-size: 0.875rem;
}
.list-group-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

/* ✅ 프로필 이미지와 텍스트 간격 */
.list-group-item img {
  margin-right: 12px;
}

/* ✅ 닉네임 + 상태메세지 영역을 왼쪽에서 자연스럽게 차지하도록 */
.list-group-item .requester-info {
  flex-grow: 1;
  cursor: pointer;
}

/* ✅ 닉네임 스타일 */
.requester-info strong {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px; /* 닉네임과 상태메세지 간격 */
}

/* ✅ 상태메세지 스타일 */
.requester-info .text-muted {
  font-size: 0.9rem;
  color: #6c757d;
}

/* ✅ 버튼 영역 */
.list-group-item button {
  margin-left: 8px;
}
</style>
