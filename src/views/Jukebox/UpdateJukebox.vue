<template>
  <div class="container my-4">
    <h3>✏ 주크박스 수정</h3>

    <div class="card shadow-sm mt-3">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">제목</label>
          <input
            v-model="updatedJukebox.title"
            type="text"
            class="form-control"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">내용</label>
          <textarea
            v-model="updatedJukebox.content"
            rows="3"
            class="form-control"
            placeholder="내용을 입력하세요"
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-primary btn-sm" @click="saveUpdate">저장</button>
          <router-link
            :to="`/myworld/${$route.params.account}/jukebox`"
            class="btn btn-light btn-sm"
          >
            취소
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import jukeboxApi from "@/apis/jukeboxApi";

const route = useRoute();
const router = useRouter();

const updatedJukebox = ref({ title: "", content: "" });

// ✅ 수정 페이지 로드 시 기존 데이터 불러오기
onMounted(async () => {
  const jid = route.params.jid;
  try {
    const res = await jukeboxApi.getJukeboxDetail(jid);
    updatedJukebox.value = res.data;
  } catch (err) {
    console.error("❌ 주크박스 불러오기 실패:", err.response?.data || err);
  }
});

// ✅ 저장 (update API 호출)
async function saveUpdate() {
  try {
    await jukeboxApi.updateJukebox(updatedJukebox.value);
    alert("수정되었습니다!");
    router.push(`/myworld/${route.params.account}/jukebox`);
  } catch (err) {
    console.error("❌ 수정 실패:", err.response?.data || err);
  }
}
</script>
