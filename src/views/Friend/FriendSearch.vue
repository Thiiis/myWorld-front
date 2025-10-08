<template>
  <div class="card">
    <div class="card-body">
      <!-- 검색 입력 -->
      <div class="input-group mb-4 mx-auto" style="max-width: 450px;">
        <input
          v-model="keyword"
          type="text"
          class="form-control"
          placeholder="닉네임으로 친구를 찾아보세요"
          @keyup.enter="search"
        />
        <button class="btn btn-primary" @click="search">검색</button>
      </div>

      <!-- 검색 결과 -->
      <div v-if="searched && results.length > 0" class="row g-3">
        <div
          v-for="user in results"
          :key="user.mid"
          class="col-6"
        >
          <!-- 카드 -->
          <div class="card h-100 p-3 d-flex flex-row align-items-center">
            <!-- 프로필 + 닉네임/상태메세지 -->
            <div
              class="d-flex align-items-center flex-grow-1"
              @click="goToHome(user.account)"
              style="cursor:pointer"
            >
              <img
                :src="user.imgUrl ? `${backendUrl}${user.imgUrl}` : defaultProfile"
                alt="이미지"
                class="rounded-circle me-2"
                style="width: 40px; height: 40px; object-fit: cover;"
              />
              <div>
                <strong>🏠 {{ user.nickname || '닉네임 없음' }}</strong>
                <span class="text-muted small d-block">
                  {{ user.statusMessage || '상태메세지가 없습니다.' }}
                </span>
              </div>
            </div>

            <!-- 버튼 영역 -->
            <div class="d-flex align-items-center">
              <!-- 본인이거나 이미 친구면 체크 아이콘 -->
              <button
                v-if="user.isMe || user.isFriend"
                class="btn btn-outline-secondary btn-sm btn-icon"
                disabled
              >
                <i class="bi bi-person-check"></i>
              </button>

              <!-- 그 외에는 추가 버튼 -->
              <button
                v-else
                class="btn btn-outline-primary btn-sm btn-icon"
                @click="add(user.mid)"
              >
                <i class="bi bi-person-plus-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 검색 결과가 없을 때 -->
      <div v-if="searched && results.length === 0" class="text-center text-muted my-5">
        <h4>검색 결과가 없습니다</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import friendApi from '@/apis/friendApi'
import memberApi from '@/apis/memberApi'
import store from '@/store'
import defaultProfile from '@/assets/image/default-profile.png' // 기본 이미지

const backendUrl = 'http://192.168.4.42:8080';

const keyword = ref('')
const results = ref([])
const searched = ref(false)
const router = useRouter()

// 사용자 검색
async function search() {
  searched.value = true
  try {
    const res = await memberApi.searchMembers(keyword.value)
    // 내 친구 목록 가져오기
    const myFriendsRes = await friendApi.getFriendList(store.state.mid)
    const myFriendMids = myFriendsRes.data.map(f => f.friendInfo.mid)
    const myMid = store.state.mid

    // 로그인 본인 제외
    results.value = (res.data || [])
      .filter(u => u.mid !== myMid)
      .map(u => ({
        ...u,
        isMe: u.mid === myMid,
        isFriend: myFriendMids.includes(u.mid)
      }))
  } catch (e) {
    console.error(e)
    alert('검색 중 오류가 발생했습니다.')
  }
}

// 친구 요청 (확인창 포함)
async function add(mid) {
  if (!confirm('친구 요청을 보내시겠습니까?')) return
  try {
    await friendApi.sendFriendRequest(mid)
    alert('친구 요청을 보냈습니다.')
    search() // 목록 새로고침
  } catch (e) {
    console.error(e)
    alert('친구 요청 중 오류가 발생했습니다.')
  }
}

// 미니홈 이동
function goToHome(account) {
  if (account) {
    router.push(`/myworld/${account}`)
  } else {
    alert('이 사용자의 미니홈을 불러올 수 없습니다.')
  }
}
</script>

<style scoped>
.text-muted.small {
  margin-left: 4px;
}
.table.friend-search-table td {
  vertical-align: middle;
  padding: 10px 12px;
}

.table.friend-search-table .profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 6px;
}

.table.friend-search-table .nickname-cell {
  font-weight: 600;
  color: #007bff;
  cursor: pointer;
}

.table.friend-search-table .status-cell {
  color: #6c757d;
  font-size: 0.9rem;
}
</style>
