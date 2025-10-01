<template>
  <div class="card">
    <div class="card-header">받은 친구 요청</div>
    <div class="card-body">
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th class="text-center" style="width:70px">번호</th>            
            <th class="text-center">프로필</th>
            <th class="text-center">닉네임</th>
            <th class="text-center">상태메세지</th>
            <th class="text-center" style="width:150px">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(req, index) in requests" :key="req.fid">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center"><img v-if="req.requester?.imgUrl" :src="req.requester.imgUrl" alt="이미지" class="rouned-circle me-2" style="width: 32px; height: 32px; object-fit: cover;" /></td>           
            <td class="text-center">{{ req.requester.nickname }}</td>
            <td class="text-center">{{ req.requester.statusMessage }}</td>
            <td class="text-center">
              <button class="btn btn-success btn-sm me-1" @click="accept(req.fid)">수락</button>
              <button class="btn btn-secondary btn-sm" @click="reject(req.fid)">거절</button>
            </td>
          </tr>
          <tr v-if="requests.length === 0">
            <td colspan="4" class="text-center">받은 요청이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import friendApi from '@/apis/friendApi'
import store from '@/store'

const requests = ref([])

async function loadRequests() {
    try {
    const res = await friendApi.getFriendRequests()
    requests.value = res.data
  } catch (err) {
    console.error(err)
  }
}

async function accept(fid) {
  await friendApi.acceptFriend(fid)
  loadRequests()
}

async function reject(fid) {
  await friendApi.rejectFriend(fid)
  loadRequests()
}

onMounted(loadRequests)
</script>
