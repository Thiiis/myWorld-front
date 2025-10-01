<template>
  <div class="text-center mt-4">
    <button class="btn btn-link" :disabled="currentPage === 1" @click="$emit('go-page', currentPage - 1)">
      &lt; 이전
    </button>
    <span class="fw-bold mx-2 text-primary">{{ currentPage }} / {{ totalPages }}</span>
    <button class="btn btn-link" :disabled="currentPage === totalPages" @click="$emit('go-page', currentPage + 1)">
      다음 &gt;
    </button>
    <p class="small mt-2 text-muted">
      (총 {{ totalItems }}개 일기)
    </p>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number,
  totalItems: Number,
});

defineEmits(["go-page"]);
</script>
