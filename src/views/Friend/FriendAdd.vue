<template>
  <div class="card">
    <div class="card-header">친구 찾기</div>

    <div class="card-body">
      <!-- 🔍 검색 입력 -->
      <div class="input-group mb-3">
        <input
          v-model="keyword"
          type="text"
          class="form-control"
          placeholder="닉네임으로 친구를 찾아보세요"
          @keyup.enter="search"
        />
        <button class="btn btn-primary" @click="search">검색</button>
      </div>

      <!-- 🔎 검색 결과 -->
      <ul v-if="searched && results.length > 0" class="list-group">
        <li
          v-for="user in results"
          :key="user.mid"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <!-- 프로필 이미지 -->
          <div
            class="d-flex align-items-center"
            @click="goToHome(user.account)"
            style="cursor:pointer"
          >
            <img
              :src="user.imgUrl ? `${backendUrl}${user.imgUrl}` : defaultProfile"
              alt="이미지"
              class="rounded-circle me-2"
              style="width: 40px; height: 40px; object-fit: cover;"
            />
          </div>

          <!-- 닉네임 + 상태메세지 -->
          <div
            class="flex-grow-1"
            @click="goToHome(user.account)"
            style="cursor:pointer"
          >
            <strong>🏠 {{ user.nickname || '닉네임 없음' }}</strong>
            <span class="text-muted small">
              {{ user.statusMessage || '상태메세지가 없습니다.' }}
            </span>
          </div>

          <!-- 친구 추가 버튼 -->
          <div>
            <button class="btn btn-primary btn-sm" @click="add(user.mid)">
              추가
            </button>
          </div>
        </li>
      </ul>

      <!-- 검색했지만 결과가 없을 때 -->
      <p v-if="searched && results.length === 0" class="text-center text-muted">
        검색 결과가 없습니다.
      </p>
      <!-- 검색 전에는 아무 결과 영역도 노출하지 않음 (원래 화면 유지) -->
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
    // 로그인 본인 제외(백엔드에서도 제외하더라도 안전망)
    results.value = (res.data || []).filter(u => u.mid !== store.state.mid)
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
