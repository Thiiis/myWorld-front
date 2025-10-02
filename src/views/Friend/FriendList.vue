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
            <img
              v-if="friend.friendInfo?.imgUrl"
              :src="friend.friendInfo.imgUrl"
              alt="이미지"
              class="rounded-circle me-2"
              style="width: 32px; height: 32px; object-fit: cover;"
            />
          </div>

          <!-- 닉네임 + 상태메세지 -->
          <div
            @click="goToHome(friend.friendInfo.account)"
            style="cursor:pointer"
          >
            <strong>🏠 {{ friend.friendInfo.nickname }}</strong>
            <span class="text-muted small">
              ({{ friend.friendInfo?.statusMessage }})
            </span>
          </div>

          <!-- 친구 끊기 버튼 -->
          <button
            class="btn btn-sm btn-outline-danger"
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import friendApi from "@/apis/friendApi";
import profileApi from "@/apis/profileApi"; // ✅ account → mid 변환용
import store from "@/store";

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
      const resProfile = await profileApi.profileInfo(account); // 여기서 mid를 받음
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
  } catch (e) {
    console.error(e);
  }
}

onMounted(fetchFriends);
</script>

<style scoped>
.input-group input {
  font-size: 0.875rem;
}
</style>
