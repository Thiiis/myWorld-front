<template>
  <div class="container py-5">
    <!-- 질문 단계 -->
    <div v-if="step !== 'result'">
      <h2 class="mb-4">{{ questions[step].text }}</h2>
      <div class="d-grid gap-2">
        <button v-for="(opt, idx) in questions[step].options" :key="idx" class="btn btn-outline-primary" @click="choose(opt)">
          {{ opt }}
        </button>
      </div>
    </div>

    <!-- 결과 단계 -->
    <div v-else class="text-center">
      <h2 class="mb-3">🎉 당신의 테마는:</h2>
      <div v-if="getResultTheme() === 'dark'" class="p-4 border rounded bg-dark text-white">
        Dark Chic 🖤
      </div>
      <div v-else-if="getResultTheme() === 'pink'" class="p-4 border rounded bg-light text-danger">
        Pink Cutie 💖
      </div>
      <div v-else class="p-4 border rounded bg-info text-white">
        Cool Mint ❄️
      </div>
      <button class="btn btn-secondary mt-4" @click="restart">다시 시작</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const step = ref(0)
const answers = ref([])

const questions = [
  {
    text: "당신의 스타일은 어떤가요?",
    options: ["심플 & 모던", "화려 & 아기자기", "편안 & 자유로움"]
  },
  {
    text: "친구들이 보는 나는?",
    options: ["차분하고 진지함", "밝고 귀여움", "쿨하고 시원함"]
  },
  {
    text: "좋아하는 색상 계열은?",
    options: ["블랙 & 화이트", "핑크 & 파스텔", "블루 & 민트"]
  }
]

function choose(option) {
  answers.value[step.value] = option
  if (step.value < questions.length - 1) {
    step.value++
  } else {
    step.value = "result"
  }
}

function restart() {
  step.value = 0
  answers.value = []
}

function getResultTheme() {
  const counts = { dark: 0, pink: 0, mint: 0 }
  for (const ans of answers.value) {
    if (ans.includes("심플") || ans.includes("차분") || ans.includes("블랙")) counts.dark++
    if (ans.includes("화려") || ans.includes("밝고") || ans.includes("핑크")) counts.pink++
    if (ans.includes("편안") || ans.includes("쿨") || ans.includes("블루")) counts.mint++
  }
  let theme = "dark"
  if (counts.pink >= counts.dark && counts.pink >= counts.mint) theme = "pink"
  else if (counts.mint >= counts.dark && counts.mint >= counts.pink) theme = "mint"
  return theme
}
</script>