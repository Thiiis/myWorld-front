<template>
  <div>
    
    <!-- Hero Section -->
    <section class="py-5 mt-5 text-center bg-light">
      <div class="container">
        <span class="badge bg-light text-primary border mb-3">
          깔끔하고 모던한 공간
        </span>
        <h1 class="display-4 fw-bold mb-3">
          하늘처럼 맑은<br />
          <span class="text-primary">디지털 공간</span>
        </h1>
        <p class="lead text-muted mb-4">
          시원한 하늘과 흐르는 강물처럼 깔끔하고 모던한<br />
          나만의 디지털 공간을 마이월드에서 만들어보세요
        </p>
        <div class="d-flex justify-content-center gap-3">
          <RouterLink to="/signup" class="btn btn-primary btn-lg">
            ▶ 미니홈피 시작하기
          </RouterLink>
          <RouterLink to="/themetest" class="btn btn-outline-primary btn-lg">
            💻 테마 테스트
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">왜 마이월드인가요?</h2>
          <p class="text-muted">깔끔하고 모던한 디지털 경험</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4" v-for="(feature, index) in features" :key="index">
            <div class="card border-0 shadow-sm h-100 text-center">
              <div class="card-body">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px;">
                  <i :class="feature.icon" style="font-size: 1.5rem;"></i>
                </div>
                <h5 class="card-title">{{ feature.title }}</h5>
                <p class="card-text text-muted">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Function Items Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">다양한 기능들</h2>
        </div>
        <div class="row g-4 justify-content-center">
          <div class="col-md-2 col-6" v-for="(item, index) in functionItems" :key="index">
            <div class="card border-0 shadow-sm text-center h-100">
              <div class="card-body">
                <div class="rounded bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 50px; height: 50px;">
                  <i :class="item.icon" style="font-size: 1.2rem;"></i>
                </div>
                <h6 class="fw-bold">{{ item.label }}</h6>
                <p class="text-muted small">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 text-center text-white" style="background: linear-gradient(135deg, #3B82F6, #0EA5E9);">
      <div class="container">
        <h2 class="fw-bold mb-3">지금 바로 시작하세요!</h2>
        <p class="mb-4">깔끔하고 모던한 나만의 미니홈피를 만들어보세요</p>
        <button class="btn btn-light btn-lg text-primary fw-bold" @click="handleGetStarted">
          ✨ 무료로 시작하기 ✨
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-4">
      <div class="container">
        <div class="mb-2">
          <i class="bi bi-star-fill text-warning"></i>
          <span class="fw-bold"> 마이월드</span>
        </div>
        <p class="mb-0 small">하늘처럼 맑고 깔끔한 모던 미니홈피 서비스</p>
        <p class="mb-0 text-muted small">© 2024 마이월드. Made with 💙</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const emit = defineEmits(["startTest", "signup"])

const features = [
  { icon: "bi bi-cloud", title: "하늘처럼 깔끔한", description: "깔끔하고 직관적인 UI로 편안한 경험 제공" },
  { icon: "bi bi-water", title: "강물처럼 자연스러운", description: "자연스러운 흐름의 소통과 인터랙션" },
  { icon: "bi bi-star", title: "모던한 감성", description: "세련된 디자인으로 개성 표현" }
]

const functionItems = [
  { icon: "bi bi-person", label: "프로필", desc: "깔끔한 프로필 관리" },
  { icon: "bi bi-journal-text", label: "일기", desc: "소중한 순간 기록" },
  { icon: "bi bi-chat", label: "방명록", desc: "소통 공간" },
  { icon: "bi bi-music-note-beamed", label: "주크박스", desc: "음악과 함께하는 공간" },
  { icon: "bi bi-brush", label: "꾸미기", desc: "스타일링 기능" }
]

const handleGetStarted = () => {
  emit("signup")
}
</script>

<style scoped>
</style>
