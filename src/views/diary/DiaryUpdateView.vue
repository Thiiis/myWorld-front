<template>
  <div class="container p-4">
    <h3 class="fw-bold mb-3">✏️ 일기 수정</h3>
    <form @submit.prevent="saveUpdate">
      <input v-model="form.title" class="form-control mb-2" placeholder="제목" />
      <textarea v-model="form.content" class="form-control mb-2" rows="6" placeholder="내용"></textarea>
      <button class="btn btn-primary">저장</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const router = useRouter();
const form = ref({ title: "", content: "" });

onMounted(async () => {
  const did = route.params.did;
  await store.dispatch("diary/fetchDiary", did);
  const entry = store.state.diary.selectedEntry;
  form.value = { title: entry.title, content: entry.content };
});

const saveUpdate = async () => {
  const did = route.params.did;
  const formData = new FormData();
  formData.append("did", did);
  formData.append("title", form.value.title);
  formData.append("content", form.value.content);

  await store.dispatch("diary/updateDiary", formData);
  router.push(`/myworld/${route.params.memberId}/diary`);
};
</script>
