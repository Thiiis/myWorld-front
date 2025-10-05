<template>
  <div class="diary-create-page">
    <header class="header"><h1>새 일기 작성</h1></header>

    <div class="content-grid">
      <section class="left-column">
        <!--제목-->
        <div class="input-card diary-title-card"><label for="diary-title" class="section-title"> 📝 일기 제목 </label><input id="diary-title" v-model="diaryData.title" type="text" placeholder="오늘 하루를 한 줄로 표현해보세요" class="styled-input title-input" /></div>

        <!-- 사진 업로드 카드 -->
        <div class="input-card photo-card"><label class="section-title photo-label">📸 사진 ({{ diaryData.photos.length }}/10) *</label>

          <!-- ✅ 대표 썸네일 영역 -->
          <div class="thumbnail-area" @click="triggerPhotoUpload">
            <template v-if="diaryData.photos.length"><img :src="getPreviewUrl(diaryData.photos[0])" alt="대표 이미지" class="thumbnail-img" /><span class="thumbnail-badge">썸네일</span></template>
            <template v-else><div class="photo-placeholder"><i class="bi bi-image fs-1 text-muted"></i><p class="upload-text">사진을 선택해주세요</p><p class="upload-hint">클릭하여 사진 최대 10장 선택 (각각 최대 5MB)</p></div></template>
          </div>

          <!-- ✅ 나머지 사진 리스트 -->
          <div v-if="diaryData.photos.length > 1" class="preview-list">
            <div v-for="(file, index) in diaryData.photos.slice(1)" :key="index + 1" class="preview-item">
              <img :src="getPreviewUrl(file)" class="preview-img" alt="추가 사진 미리보기" />
              <!-- 삭제 버튼 --><button type="button" class="remove-btn" @click.stop="removePhoto(index + 1)"><i class="bi bi-x-lg"></i></button>
              <!-- ✅ 대표로 설정 버튼 (마우스 오버 시 보임) --><button type="button" class="set-thumb-btn" @click.stop="setAsThumbnail(index + 1)">썸네일변경</button>
            </div>
          </div>

          <!-- 실제 파일 input -->
          <input type="file" ref="photoInput" @change="handlePhotoUpload" multiple accept="image/*" style="display: none" />

          <!-- ✅ 추가 업로드 버튼 -->
          <button v-if="diaryData.photos.length < 10" type="button" class="add-photo-btn" @click="triggerPhotoUpload">⬆ 사진 더 추가하기 ({{ 10 - diaryData.photos.length }}장 남음)</button>
        </div>

        <!--내용-->
        <div class="input-card content-card"><label for="diary-content" class="section-title"> 📖 일기 내용 </label><textarea id="diary-content" v-model="diaryData.content" placeholder="오늘 하루 있었던 일들을 자유롭게 적어보세요..." class="styled-textarea content-textarea"></textarea></div>
      </section>

      <!--기분-->
      <aside class="right-column">
        <div class="input-card mood-card"><label class="section-title"> 💙 오늘 기분 * </label><div class="tag-group emoji-tags"><button v-for="emo in emoes" :key="emo.value" :class="['tag-btn',{ 'is-selected': diaryData.emo === emo.value }]" @click="diaryData.emo = emo.value">{{ emo.emoji }} {{ emo.label }}</button></div></div>

        <!--날씨-->
        <div class="input-card weather-card"><label class="section-title"> ☁️ 오늘 날씨 * </label><div class="tag-group emoji-tags"><button v-for="weather in weathers" :key="weather.value" :class="['tag-btn',{ 'is-selected': diaryData.weather === weather.value }]" @click="diaryData.weather = weather.value">{{ weather.emoji }} {{ weather.label }}</button></div></div>

        <!--
        <div class="input-card tag-selection-card">
          <label class="section-title"> ✏️ 분류 태그 </label>
          <p class="tag-hint">태그 선택 (최대 5개)</p>
          <input type="text" v-model="tagSearchTerm" @keydown.enter.prevent="addCustomTag" placeholder="태그 검색..." class="styled-input tag-search-input" />
          <div class="tag-group category-tags"><button v-for="tag in predefinedTags" :key="tag" :class="['tag-btn',{ 'is-selected': diaryData.tags.includes(tag) }]" @click="toggleTag(tag)">#{{ tag }}</button></div>
        </div>
        -->
      </aside>
    </div>

    <div class="action-bar">
      <button @click="cancelCreation" class="action-btn cancel-btn">일기목록</button>
      <!-- ✅ 사진이 10장 초과 시 비활성화 -->
      <button @click="saveDiary" class="action-btn save-btn" :disabled="diaryData.photos.length > 10"><template v-if="diaryData.photos.length > 10">🚫 사진은 최대 10장까지만 저장할 수 있습니다</template><template v-else>💾 일기 저장하기</template></button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter(); 
const store = useStore();

// ================= 태그 관련 ================= //
const predefinedTags = ref(['일상','행복','여행','맛집','친구','가족','연인','데이트','취미','운동','독서','영화','음악','공부','시험','경제','카페','산책','사진','요리']);
const tagSearchTerm = ref(''); 
const MAX_TAGS = 5;
const toggleTag = (tag) => { const index = diaryData.tags.indexOf(tag); if (index > -1) diaryData.tags.splice(index,1); else if (diaryData.tags.length < MAX_TAGS) diaryData.tags.push(tag); else alert(`태그는 최대 ${MAX_TAGS}개까지 선택할 수 있습니다.`); };
const addCustomTag = () => { const newTag = tagSearchTerm.value.trim(); if (newTag && !diaryData.tags.includes(newTag)) { if (diaryData.tags.length < MAX_TAGS) { diaryData.tags.push(newTag); if (!predefinedTags.value.includes(newTag)) predefinedTags.value.unshift(newTag); } else alert(`태그는 최대 ${MAX_TAGS}개까지 선택할 수 있습니다.`); tagSearchTerm.value=''; } };

// ================= 일기 데이터 ================= //
const diaryData = reactive({ title:'', content:'', emo:'HAPPY', weather:'SUNNY', photos:[], tags:['일상'] });

// ================= 저장 기능 ================= //
const saveDiary = async () => { 
  if (!diaryData.title || !diaryData.emo || !diaryData.weather) { alert('제목, 기분, 날씨는 필수 입력 사항입니다.'); return; }
  if (diaryData.photos.length > 10) { alert("사진은 최대 10장까지만 저장할 수 있습니다."); return; }
  try { 
    const formData = new FormData(); 
    const dto = { title:diaryData.title, content:diaryData.content, emo:diaryData.emo, weather:diaryData.weather, tags:diaryData.tags }; 
    formData.append("dto", new Blob([JSON.stringify(dto)], { type:"application/json" })); 
    diaryData.photos.forEach(file => formData.append("files", file)); 
    await store.dispatch("diary/createDiary", formData); 
    await store.dispatch("diary/fetchDiaries"); 
    alert("일기가 저장되었습니다!"); router.push({ name:"DiaryList" }); 
  } catch(e) { console.error("일기 저장 실패:", e); alert("일기 저장 중 오류가 발생했습니다."); } 
};

// ================= 선택지(이모지) ================= //
const emoes = [ {emoji:'😊',label:'기쁨',value:'HAPPY'}, {emoji:'😌',label:'평온',value:'CALM'}, {emoji:'🤩',label:'신남',value:'EXCITED'}, {emoji:'😥',label:'슬픔',value:'SAD'} ];
const weathers = [ {emoji:'☀️',label:'맑음',value:'SUNNY'}, {emoji:'🌥️',label:'흐림',value:'CLOUDY'}, {emoji:'☔',label:'비',value:'RAINY'}, {emoji:'❄️',label:'눈',value:'SNOWY'} ];

// ================= 사진 업로드 ================= //
const photoInput = ref(null);
const triggerPhotoUpload = () => { if (diaryData.photos.length >= 10) { alert("사진은 최대 10장까지 선택할 수 있습니다."); return; } photoInput.value?.click(); };
const handlePhotoUpload = (event) => { const files = event.target.files; if (!files || !files.length) return; Array.from(files).forEach(file => { if (file instanceof File) diaryData.photos.push(file); }); event.target.value=''; };
const setAsThumbnail = (index) => { if (index <= 0) return; const selected = diaryData.photos.splice(index,1)[0]; diaryData.photos.unshift(selected); };
const getPreviewUrl = (file) => file instanceof File ? URL.createObjectURL(file) : "";
const removePhoto = (index) => { const file = diaryData.photos[index]; if (file instanceof File) URL.revokeObjectURL(file); diaryData.photos.splice(index,1); };

// ================= 뒤로가기/취소 ================= //
const goBack = () => { router.push({ name:"DiaryList" }); };
const cancelCreation = () => { if (confirm('작성을 취소하고 돌아가시겠어요?')) goBack(); };
</script>



<style scoped>
.diary-create-page {max-width:1200px;margin:0 auto;padding:20px;background-color:#f8f9fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;min-height:100vh;}
.header {display:flex;align-items:center;margin-bottom:25px;padding-bottom:15px;border-bottom:1px solid #e9ecef;}
.back-btn {background:none;border:none;color:#4a90e2;font-size:16px;cursor:pointer;padding:8px 12px;border-radius:6px;transition:background-color 0.2s;font-weight:500;}
.back-btn:hover {background-color:#e6f0ff;}
.header h1 {font-size:28px;font-weight:700;color:#343a40;margin-left:20px;}
.content-grid {display:grid;grid-template-columns:2fr 1fr;gap:25px;}
.left-column {display:flex;flex-direction:column;gap:20px;}
.right-column {display:flex;flex-direction:column;gap:20px;}
.input-card {background-color:#fff;border-radius:12px;padding:20px;box-shadow:0 4px 12px rgba(0,0,0,0.05);transition:all 0.3s ease;}
.input-card:hover {box-shadow:0 6px 18px rgba(0,0,0,0.08);}
.section-title {display:block;font-size:16px;font-weight:600;color:#4a90e2;margin-bottom:10px;}
.styled-input,.styled-textarea {width:100%;padding:12px 15px;border:1px solid #ced4da;border-radius:8px;font-size:16px;color:#495057;transition:border-color 0.2s,box-shadow 0.2s;}
.styled-input:focus,.styled-textarea:focus {border-color:#4a90e2;box-shadow:0 0 0 3px rgba(74,144,226,0.2);outline:none;}
.title-input {font-weight:500;}
.content-textarea {min-height:250px;resize:vertical;}
.photo-card {display:flex;flex-direction:column;}
.photo-label {color:#495057;}
.photo-upload-area {display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;border:2px dashed #b0c4de;border-radius:8px;cursor:pointer;background-color:#f7f9fc;text-align:center;transition:border-color 0.3s,background-color 0.3s;}
.photo-upload-area:hover {border-color:#4a90e2;background-color:#e9f5ff;}
.photo-placeholder-icon {margin-bottom:10px;}
.preview-wrapper {margin-top:12px;max-height:260px;overflow-y:auto;padding:8px;border:1px dashed #b0c4de;border-radius:8px;background:#f9fbff;}
.preview-list {display:flex;flex-wrap:wrap;gap:10px;overflow-x:auto;padding-bottom:6px;}
.preview-item {position:relative;width:100px;height:100px;flex:0 0 auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.1);}
.preview-img {width:100%;height:100%;object-fit:cover;display:block;border-radius:10px;}
.remove-btn {position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.6);border:none;color:#fff;font-size:14px;border-radius:50%;padding:4px;cursor:pointer;line-height:1;}
.remove-btn:hover {background:rgba(0,0,0,0.8);}
.set-thumb-btn {position:absolute;bottom:6px;left:6px;background:rgba(74,144,226,0.85);border:none;color:#fff;font-size:12px;font-weight:bold;border-radius:6px;padding:2px 6px;cursor:pointer;opacity:0;transition:opacity 0.2s;}
.preview-item:hover .set-thumb-btn {opacity:1;}
.set-thumb-btn:hover {background:rgba(74,144,226,1);}
.thumbnail-area {width:100%;height:220px;border:2px dashed #b0c4de;border-radius:10px;background:#f9fbff;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;margin-bottom:12px;}
.thumbnail-img {width:100%;height:100%;object-fit:cover;border-radius:10px;}
.photo-placeholder {text-align:center;color:#6c757d;}
.thumbnail-badge {position:absolute;top:10px;left:10px;background:#4a90e2;color:#fff;font-size:13px;font-weight:bold;padding:3px 8px;border-radius:6px;}
.add-photo-btn {margin-top:10px;width:100%;padding:10px;border:1px dashed #4a90e2;background:#f0f7ff;color:#4a90e2;font-weight:600;border-radius:8px;cursor:pointer;}
.add-photo-btn:hover {background:#e6f2ff;}
.upload-text {font-size:18px;font-weight:600;color:#4a90e2;margin:0;}
.upload-hint {font-size:14px;color:#6c757d;margin-top:5px;}
.tag-group {display:flex;flex-wrap:wrap;gap:8px;margin-top:5px;}
.tag-btn {padding:8px 15px;border-radius:20px;border:1px solid #ced4da;background-color:#f1f3f5;color:#495057;font-size:14px;cursor:pointer;transition:all 0.2s ease;white-space:nowrap;}
.tag-btn:hover {border-color:#868e96;}
.tag-btn.is-selected {background-color:#4a90e2;color:#fff;border-color:#4a90e2;}
.emoji-tags .tag-btn {border-radius:25px;}
.tag-hint {font-size:14px;color:#6c757d;margin-bottom:10px;}
.tag-selection-card .tag-search-input {margin-bottom:15px;}
.category-tags {overflow-y:auto;}
.action-bar {position:sticky;bottom:0;left:0;right:0;margin:20px -20px -20px;padding:15px 40px;background:#fff;border-top:1px solid #e9ecef;display:flex;justify-content:flex-end;gap:15px;box-shadow:0 -2px 10px rgba(0,0,0,0.05);}
.action-btn {padding:12px 25px;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:background-color 0.2s,opacity 0.2s;}
.cancel-btn {background-color:#adb5bd;color:#fff;}
.cancel-btn:hover {background-color:#6c757d;}
.save-btn {background-color:#4a90e2;color:#fff;}
.save-btn:hover {background-color:#3b7ad0;}
.save-btn:disabled {background-color:#ccc;color:#666;cursor:not-allowed;opacity:0.8;}
@media (max-width:900px){.content-grid{grid-template-columns:1fr;}.action-bar{justify-content:center;padding:15px 20px;}}
</style>