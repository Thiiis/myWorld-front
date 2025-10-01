<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      친구 목록
      <!-- 검색 입력 -->
      <div class="input-group" style="width: 200px;">
        <input v-model="keyword" type="text" class="form-control form-control-sm" placeholder="닉네임" @keyup.enter="filterList" />
        <button class="btn btn-sm btn-primary" @click="filterList">검색</button>
      </div>
    </div>

    <div class="card-body">
      <ul class="list-group">
        <li v-for="friend in filteredFriends" :key="friend.fid" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img v-if="friend.friendInfo?.imgUrl" :src="friend.friendInfo.imgUrl" alt="이미지" class="rouned-circle me-2" style="width: 32px; height: 32px; object-fit: cover;" />
          </div>

          <div>
            <strong>🏠 {{ friend.friendInfo.nickname }}</strong>
            <span class="text-muted small"> ({{ friend.friendInfo?.statusMessage }})</span>
          </div>
          <button class="btn btn-sm btn-outline-danger" @click="remove(friend.fid)">
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
import friendApi from "@/apis/friendApi";
import store from "@/store";

const friends = ref([]);
const filteredFriends = ref([]);
const keyword = ref("");

// 친구 목록 불러오기
async function fetchFriends() {
  try {
    const mid = store.state.mid;
    const res = await friendApi.getFriendList(mid);
    friends.value = res.data;
    filteredFriends.value = res.data;
  } catch (e) {
    console.error(e)
  }
}

// 검색
function filterList() {
  const key = keyword.value.toLowerCase();
  filteredFriends.value = friends.value.filter(
    (f) =>
      f.nickname?.toLowerCase().includes(key) ||
      f.username?.toLowerCase().includes(key)
  );
}

// 친구 끊기
async function remove(fid) {
  if (!confirm("정말 친구를 끊으시겠습니까?")) return;
  try {
    await friendApi.removeFriend(fid);
    friends.value = friends.value.filter((f) => f.id !== fid);
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
