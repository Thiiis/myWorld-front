<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">로그인</h2>
    <form class="mx-auto" style="max-width: 400px;">
      <div class="mb-3">
        <label class="form-label">아이디</label>
        <input type="text" class="form-control" placeholder="아이디 입력" />
      </div>
      <div class="mb-3">
        <label class="form-label">비밀번호</label>
        <input type="password" class="form-control" placeholder="비밀번호 입력" />
      </div>
      <button type="submit" class="btn btn-primary w-100">로그인</button>
      <button type="button" class="btn btn-link w-100 mt-2" @click="$router.push('/signup')">
        회원가입 페이지로 이동
      </button>
    </form>
  </div>
</template>

<script setup>
</script>
