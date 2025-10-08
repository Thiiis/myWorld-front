<template>
  <div class="card">
    <div class="d-flex justify-content-end me-3">
      <div class="input-group" style="width: 250px;">
        <input v-model="keyword" type="text" class="form-control form-control-sm" placeholder="닉네임" @keyup.enter="filterList" />
        <button class="btn btn-sm btn-primary" @click="filterList">검색</button>
      </div>
    </div>

    <div class="card-body">
      <!-- Grid 레이아웃: 한 줄에 두 명 -->
      <div class="row g-3">
        <div v-for="friend in filteredFriends" :key="friend.fid" class="col-6">
          <!-- 카드: 좌우 배치 -->
          <div class="card h-100 p-3 d-flex flex-row align-items-center">
            <!-- 왼쪽: 프로필 + 닉네임 -->
            <div class="d-flex align-items-center flex-grow-1" @click="goToHome(friend.friendInfo.account)" style="cursor:pointer">
              <img :src="friend.friendInfo?.imgUrl ? `${backendUrl}${friend.friendInfo.imgUrl}` : defaultProfile" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;" />
              <div class="friend-info">
                <strong>🏠 {{ friend.friendInfo.nickname }}</strong>
                <span class="text-muted small d-block">
                  {{ friend.friendInfo?.statusMessage || '상태메세지가 없습니다.' }}
                </span>
              </div>
            </div>

            <!-- 오른쪽: 버튼 영역 -->
            <div v-if="route.params.account === store.state.account" class="d-flex gap-2 ms-2">
              <button class="btn btn-outline-danger btn-icon" @click="remove(friend.fid)">
                <i class="bi bi-person-dash-fill"></i>
              </button>
            </div>

            <div v-else class="ms-2">
              <button v-if="friend.isMe || friend.isFriend" class="btn btn-outline-secondary btn-icon" disabled>
                <i class="bi bi-person-check"></i>
              </button>

              <button v-else class="btn btn-outline-primary btn-icon" @click="add(friend.friendInfo?.mid)">
                <i class="bi bi-person-plus-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredFriends.length === 0" class="mt-3 text-muted text-center">
        <i class="bi bi-person display-4 mb-3"></i>
        <h4>새로운 친구를 만들어보세요</h4>
      </div>
    </div>
  </div>
</template>


<script setup>
import friendApi from "@/apis/friendApi";
import profileApi from "@/apis/profileApi";
import defaultProfile from '@/assets/image/default-profile.png';
import store from "@/store";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const backendUrl = 'http://192.168.4.42:8080';

const route = useRoute();
const router = useRouter();

const friends = ref([]);
const filteredFriends = ref([]);
const keyword = ref("");
const openRooms = computed(() => store.state.chat.openRooms); // 현재 열려 있는 채팅창 목록

async function fetchFriends() {
  try {
    let targetMid = store.state.mid; // 기본은 로그인한 내 mid 사용

    // URL에 다른 사용자의 account가 들어오면 해당 mid로 변환
    const account = route.params.account;

    if (account && account !== store.state.account) {
      // 다른 사람의 미니홈이면
      const resProfile = await profileApi.getProfileInfo(account);  // 여기서 mid를 받음
      if (resProfile?.data?.mid) {
        targetMid = resProfile.data.mid;
      }
    }

    // 홈 주인 친구 목록
    const res = await friendApi.getFriendList(targetMid);

    // 내 친구 목록도 가져옴 (비교용)
    const myFriendsRes = await friendApi.getFriendList(store.state.mid);
    const myFriendMids = myFriendsRes.data.map(f => f.friendInfo.mid);
    const myMid = store.state.mid;

    friends.value = res.data.map(f => ({
      ...f,
      isMe: f.friendInfo.mid === myMid,
      isFriend: myFriendMids.includes(f.friendInfo.mid) // 내가 친구인지 체크
    }));
    filteredFriends.value = friends.value;
  } catch (e) {
    console.error(e);
  }
}

function filterList() {
  const key = keyword.value.toLowerCase();
  filteredFriends.value = friends.value.filter(
    (f) =>
      f.friendInfo?.nickname?.toLowerCase().includes(key) ||
      f.friendInfo?.statusMessage?.toLowerCase().includes(key)
  );
}

function goToHome(account) {
  if (account) router.push(`/myworld/${account}`);
  else alert("이 친구의 계정 정보를 불러올 수 없습니다.");
}

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

// 친구 요청 (확인창 포함)
async function add(accId) {
  if (!confirm('친구 요청을 보내시겠습니까?')) return
  try {
    await friendApi.sendFriendRequest(accId)
    alert('친구 요청을 보냈습니다.')
    filterList() // 목록 새로고침
  } catch (e) {
    console.error(e)
    alert('친구 요청 중 오류가 발생했습니다.')
  }
}

onMounted(fetchFriends);
watch(() => route.params.account, fetchFriends);
</script>

<style scoped>
.input-group input {
  font-size: 0.875rem;
}

.friend-info {
  flex-grow: 1;
  cursor: pointer;
}

.friend-info strong {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.friend-info .text-muted {
  font-size: 0.9rem;
  color: #6c757d;
}

.card .btn {
  font-size: 0.8rem;
  padding: 4px 8px;
}
</style>
