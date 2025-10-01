<template>
  <div class="diary-create-page">
    <header class="header"> <button @click="goBack" class="back-btn"> ← 일기장으로 돌아가기 </button> <h1>새 일기 작성</h1> </header>

    <div class="content-grid">
      <section class="left-column">
        <!--제목-->
        <div class="input-card diary-title-card">
          <label for="diary-title" class="section-title"> 📝 일기 제목 </label>
          <input id="diary-title" v-model="diaryData.title" type="text" placeholder="오늘 하루를 한 줄로 표현해보세요" class="styled-input title-input" />
        </div>
        <!--사진-->
        <div class="input-card photo-card">
          <label class="section-title photo-label"> 📸 사진! ({{ diaryData.photos.length }}/10) * </label>
          <div class="photo-upload-area" @click="triggerPhotoUpload">
            <div class="photo-placeholder-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 11.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM15 3.5v-.5a.5.5 0 0 0-1 0v.5h-4v-.5a.5.5 0 0 0-1 0v.5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5.5a2 2 0 0 0-2-2h-4Zm4.5 4.5v10a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8.5h15Z" fill="#B0C4DE"/>
                <path d="M7 16l4-4 4 4 4-4v5.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V12.5l4 4Z" fill="#B0C4DE"/>
              </svg>
            </div>
            <p class="upload-text">사진을 선택해주세요</p>
            <p class="upload-hint">클릭하여 사진 최대 10장 선택 (각각 최대 5MB)</p>
          </div>
          <input type="file" ref="photoInput" @change="handlePhotoUpload" multiple accept="image/*" style="display: none" />
        </div>
        <!--내용-->
        <div class="input-card content-card">
          <label for="diary-content" class="section-title"> 📖 일기 내용 </label>
          <textarea id="diary-content" v-model="diaryData.content" placeholder="오늘 하루 있었던 일들을 자유롭게 적어보세요..." class="styled-textarea content-textarea" ></textarea>
        </div>
      </section>
      <!--기분-->
      <aside class="right-column">
        <div class="input-card mood-card">
          <label class="section-title"> 💙 오늘 기분 * </label>
          <div class="tag-group emoji-tags">
            <button v-for="emo in emoes" :key="emo.value" :class="['tag-btn', { 'is-selected': diaryData.emo === emo.value }]" @click="diaryData.emo = emo.value" >
              {{ emo.emoji }} {{ emo.label }}
            </button>
          </div>
        </div>
        <!--날씨-->
        <div class="input-card weather-card">
          <label class="section-title"> ☁️ 오늘 날씨 * </label>
          <div class="tag-group emoji-tags">
            <button v-for="weather in weathers" :key="weather.value" :class="['tag-btn', { 'is-selected': diaryData.weather === weather.value }]" @click="diaryData.weather = weather.value" >
              {{ weather.emoji }} {{ weather.label }}
            </button>
          </div>
        </div>
        
<!--태그  <div class="input-card tag-selection-card">
          <label class="section-title"> ✏️ 분류 태그 </label>
          <p class="tag-hint">태그 선택 (최대 5개)</p>
          <input type="text" v-model="tagSearchTerm" @keydown.enter.prevent="addCustomTag" placeholder="태그 검색..." class="styled-input tag-search-input" />
            
            <div class="tag-group category-tags">
            <button v-for="tag in predefinedTags" :key="tag" :class="['tag-btn', { 'is-selected': diaryData.tags.includes(tag) }]" @click="toggleTag(tag)" >
            #{{ tag }}
            </button>
          </div>
        </div> -->
      </aside>
    </div>

    <div class="action-bar">
      <button @click="cancelCreation" class="action-btn cancel-btn">취소</button>
      <button @click="saveDiary" class="action-btn save-btn"> 💾 일기 저장하기 </button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();


// --- State for Diary Data ---
const diaryData = reactive({
  title: '',
  content: '',
  emo: 'joy', // Default selection or empty
  weather: 'sunny', // Default selection or empty
  photos: [], // Array to hold file objects or URLs
  tags: ['일상'], // Array of selected tags
});

const saveDiary = async () => {
  // 1. 필수 데이터 검증 (백엔드 요구사항에 맞춤)
  if (!diaryData.title || !diaryData.emo || !diaryData.weather) {
    alert('제목, 기분, 날씨는 필수 입력 사항입니다.');
    return;
  }

  // 2. 백엔드 DTO(DiarysRequest)에 맞게 데이터 준비
  const dto = {
    title: diaryData.title,
    content: diaryData.content,

  }
  alert('일기가 저장되었습니다!');
  // goBack();
};

// --- Constants for Options ---
const emo = [
  { emoji: '😊', label: '기쁨', value: 'joy' },
  { emoji: '😌', label: '평온', value: 'peace' },
  { emoji: '🤩', label: '신남', value: 'excitement' },
  { emoji: '😥', label: '슬픔', value: 'sadness' },
];
const weathers = [
  { emoji: '☀️', label: '맑음', value: 'sunny' },
  { emoji: '🌥️', label: '흐림', value: 'cloudy' },
  { emoji: '☔', label: '비', value: 'rain' },
  { emoji: '❄️', label: '눈', value: 'snow' },
];

// 사진관련
const photoInput = ref(null);
const triggerPhotoUpload = () => {
  // Programmatically click the hidden file input
  if (diaryData.photos.length < 10 && photoInput.value) {
    photoInput.value.click();
  } else if (diaryData.photos.length >= 10) {
    alert('사진은 최대 10장까지 선택할 수 있습니다.');
  }
};
const handlePhotoUpload = (event) => {
  const files = event.target.files;
  if (!files) return;
  
  const filesToAdd = Array.from(files).slice(0, 10 - diaryData.photos.length);
  
  filesToAdd.forEach(file => {
    console.log(`Adding photo: ${file.name}`);
    diaryData.photos.push(file); // Store the File object
  });
  event.target.value = '';
};

const goBack = () => { console.log('Navigating back to the diary list...'); };    
const cancelCreation = () => { if (confirm('작성을 취소하고 돌아가시겠어요?')) { goBack(); } };

/* 태그 관련
const predefinedTags = ref([
  '일상', '행복', '여행', '맛집', '친구', '가족', '연인', '데이트',
  '취미', '운동', '독서', '영화', '음악', '공부', '시험', '경제',
  '카페', '산책', '사진', '요리'
]);

// --- State for Tag Search/Addition ---
const tagSearchTerm = ref('');
const MAX_TAGS = 5;

const toggleTag = (tag) => {
  const index = diaryData.tags.indexOf(tag);
  if (index > -1) { diaryData.tags.splice(index, 1);
  } else if (diaryData.tags.length < MAX_TAGS) {
    diaryData.tags.push(tag);
  } else { alert(`태그는 최대 ${MAX_TAGS}개까지 선택할 수 있습니다.`); }
};

const addCustomTag = () => {
  const newTag = tagSearchTerm.value.trim();
  if (newTag && !diaryData.tags.includes(newTag)) {
    if (diaryData.tags.length < MAX_TAGS) {
      diaryData.tags.push(newTag);
      if (!predefinedTags.value.includes(newTag)) { predefinedTags.value.unshift(newTag);}
    } else { alert(`태그는 최대 ${MAX_TAGS}개까지 선택할 수 있습니다.`);}

    tagSearchTerm.value = ''; // Clear search input
  }
};
*/
</script>

<style scoped>
/* Base Styles */
.diary-create-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa; /* Light background */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
}

/* Header & Navigation */
.header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.back-btn {
  background: none;
  border: none;
  color: #4a90e2; /* Primary blue for links/actions */
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
  font-weight: 500;
}

.back-btn:hover {
  background-color: #e6f0ff;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #343a40;
  margin-left: 20px;
}

/* Grid Layout */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Left column wider */
  gap: 25px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Card Styling */
.input-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.input-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #4a90e2; /* Blue titles */
  margin-bottom: 10px;
}

/* Input Styles */
.styled-input,
.styled-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 16px;
  color: #495057;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.styled-input:focus,
.styled-textarea:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  outline: none;
}

.title-input {
  font-weight: 500;
}

.content-textarea {
  min-height: 250px;
  resize: vertical;
}

/* Photo Upload Area */
.photo-card {
  display: flex;
  flex-direction: column;
}

.photo-label {
  color: #495057;
}

.photo-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 2px dashed #b0c4de; /* Light blue/gray dashed border */
  border-radius: 8px;
  cursor: pointer;
  background-color: #f7f9fc;
  text-align: center;
  transition: border-color 0.3s, background-color 0.3s;
}

.photo-upload-area:hover {
  border-color: #4a90e2;
  background-color: #e9f5ff;
}

.photo-placeholder-icon {
  margin-bottom: 10px;
}

.upload-text {
  font-size: 18px;
  font-weight: 600;
  color: #4a90e2;
  margin: 0;
}

.upload-hint {
  font-size: 14px;
  color: #6c757d;
  margin-top: 5px;
}

/* Tag/Button Styles */
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.tag-btn {
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid #ced4da;
  background-color: #f1f3f5;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tag-btn:hover {
  border-color: #868e96;
}

.tag-btn.is-selected {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.emoji-tags .tag-btn {
  /* Slightly more rounded for a soft look */
  border-radius: 25px;
}

.tag-hint {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 10px;
}

.tag-selection-card .tag-search-input {
  margin-bottom: 15px;
}

.category-tags {
  max-height: 150px; /* Limit height for scrollable tag list */
  overflow-y: auto;
  padding-right: 5px; /* Space for scrollbar */
}

/* Fixed Action Bar */
.action-bar {
  position: sticky; /* Sticky or fixed at the bottom */
  bottom: 0;
  left: 0;
  right: 0;
  margin: 20px -20px -20px; /* Extend to edges of page padding */
  padding: 15px 40px;
  background-color: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.action-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.cancel-btn {
  background-color: #adb5bd; /* Gray */
  color: white;
}

.cancel-btn:hover {
  background-color: #6c757d;
}

.save-btn {
  background-color: #4a90e2; /* Primary Blue */
  color: white;
}

.save-btn:hover {
  background-color: #3b7ad0;
}

/* Responsive adjustment for smaller screens */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr; /* Single column layout */
  }

  .action-bar {
    justify-content: center;
    padding: 15px 20px;
  }
}
</style>