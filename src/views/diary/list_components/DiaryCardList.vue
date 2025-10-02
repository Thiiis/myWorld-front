<template>
  <div class="row g-3">
    <div
      v-for="entry in filteredEntries"
      :key="entry.id"
      class="col-md-4 col-sm-6"
      @click="openModal(entry)"
    >
      <DiaryCard :entry="entry" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import DiaryCard from "@/views/Diary/list_components/DiaryCard.vue";
import * as bootstrap from "bootstrap";

const store = useStore();

const diaryEntries = computed(() => store.state.diary?.diaryEntries || []);
const activeFolder = computed(() => store.state.diary?.activeFolder || "all");
const searchQuery = computed(() => store.state.diary?.searchQuery || "");
const sortOrder = computed(() => store.state.diary?.sortOrder || "asc");

const selectedEntry = computed({
  get: () => store.state.diary?.selectedEntry,
  set: (val) => store.commit("diary/setSelectedEntry", val)
});

const filteredEntries = computed(() => {
  return diaryEntries.value
    .filter((e) => {
      if (activeFolder.value !== "all" && e.folder !== activeFolder.value) return false;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        return e.title?.toLowerCase().includes(q) || e.content?.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) =>
      sortOrder.value === "asc"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date)
    );
});

// 모달 열기 (JS API만 사용)
const openModal = (entry) => {
  selectedEntry.value = entry;
  const modalEl = document.getElementById("diaryModal");
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
};
</script>
