<template>
  <div class="card">
    <div class="card-header">친구 찾기</div>
    <div class="card-body">
      <div class="input-group mb-3">
        <input v-model="keyword" type="text" class="form-control" placeholder="닉네임/이메일 검색">
        <button class="btn btn-primary" @click="search">검색</button>
      </div>

      <table v-if="results.length > 0" class="table table-striped table-bordered">
        <thead>
          <tr>
            <th class="text-center">닉네임</th>
            <th class="text-center">이메일</th>
            <th class="text-center" style="width:100px">추가</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in results" :key="user.id">
            <td class="text-center">{{ user.nickname }}</td>
            <td class="text-center">{{ user.email }}</td>
            <td class="text-center">
              <button class="btn btn-success btn-sm" @click="add(user.id)">추가</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="searched && results.length === 0" class="text-center text-muted">검색 결과가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import friendApi from '@/apis/friendApi'

const keyword = ref('')
const results = ref([])
const searched = ref(false)

async function search() {
  searched.value = true
  const res = await friendApi.searchUser(keyword.value)
  results.value = res.data
}

async function add(id) {
  await friendApi.addFriend(id)
  alert('친구 요청을 보냈습니다.')
}
</script>
