<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      친구 목록
      <!-- 검색 입력 -->
      <div class="input-group" style="width: 200px;">
        <input
          v-model="keyword"
          type="text"
          class="form-control form-control-sm"
          placeholder="닉네임"
          @keyup.enter="filterList"
        />
        <button class="btn btn-sm btn-primary" @click="filterList">검색</button>
      </div>
    </div>

    <div class="card-body">
      <ul class="list-group">
        <li
          v-for="friend in filteredFriends"
          :key="friend.fid"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <!-- 친구 이미지 -->
          <div
            class="d-flex align-items-center"
            @click="goToHome(friend.friendInfo.account)"
            style="cursor:pointer"
          >
            <img :src="friend.friendInfo?.imgUrl ? `${backendUrl}${friend.friendInfo.imgUrl}` : defaultProfile" alt="이미지" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;" />
          </div>

          <!-- 닉네임 + 상태메세지 -->
          <div
            class="friend-info"
            @click="goToHome(friend.friendInfo.account)"
            style="cursor:pointer"
          >
            <strong>🏠 {{ friend.friendInfo.nickname }}</strong>
            <span class="text-muted small">
              {{ friend.friendInfo?.statusMessage || '상태메세지가 없습니다.' }}
            </span>
          </div>

          <!-- 친구 끊기 버튼 -->
          <button
            class="btn btn-sm btn-danger"
            @click="remove(friend.fid)"
          >
            친구 끊기
          </button>
        </li>
      </ul>

      <p v-if="filteredFriends.length === 0" class="mt-3 text-muted">
        검색 결과가 없습니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import friendApi from "@/apis/friendApi";
import profileApi from "@/apis/profileApi";
import defaultProfile from '@/assets/image/default-profile.png'
import store from "@/store";

const backendUrl = 'http://192.168.4.42:8080';

const route = useRoute();
const router = useRouter();

const friends = ref([]);
const filteredFriends = ref([]);
const keyword = ref("");

// ✅ 친구 목록 불러오기
async function fetchFriends() {
  try {
    let targetMid = store.state.mid; // 기본은 로그인한 내 mid 사용

    // 🔥 URL에 다른 사용자의 account가 들어오면 해당 mid로 변환
    const account = route.params.account;
    if (account && account !== store.state.account) {
      const resProfile = await profileApi.getProfileInfo(account); // 여기서 mid를 받음
      if (resProfile?.data?.mid) {
        targetMid = resProfile.data.mid;
      }
    }

    // 이제 mid로 API 호출
    const res = await friendApi.getFriendList(targetMid);
    friends.value = res.data;
    filteredFriends.value = res.data;
  } catch (e) {
    console.error(e);
  }
}

// ✅ 검색
function filterList() {
  const key = keyword.value.toLowerCase();
  filteredFriends.value = friends.value.filter(
    (f) =>
      f.friendInfo?.nickname?.toLowerCase().includes(key) ||
      f.friendInfo?.statusMessage?.toLowerCase().includes(key)
  );
}

// ✅ 친구 홈으로 이동
function goToHome(account) {
  if (account) {
    router.push(`/myworld/${account}`);
  } else {
    alert("이 친구의 계정 정보를 불러올 수 없습니다.");
  }
}

// ✅ 친구 끊기
async function remove(fid) {
  if (!confirm("정말 친구를 끊으시겠습니까?")) return;
  try {
    await friendApi.removeFriend(fid);
    friends.value = friends.value.filter((f) => f.fid !== fid);
    filterList();
    alert("친구가 끊어졌습니다.");
  } catch (e) {
    console.error(e);
  }
}

onMounted(fetchFriends);
watch(
  () => route.params.account,
  () => {
    fetchFriends();
  }
);
</script>

<style scoped>
.input-group input {
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
.list-group-item .friend-info {
  flex-grow: 1;
  cursor: pointer;
}

/* ✅ 닉네임 스타일 */
.friend-info strong {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px; /* 닉네임과 상태메세지 간격 */
}

/* ✅ 상태메세지 스타일 */
.friend-info .text-muted {
  font-size: 0.9rem;
  color: #6c757d;
}

/* ✅ 버튼 영역 */
.list-group-item button {
  margin-left: 8px;
}
</style>
