<template>
  <div class="container py-5">
    <h2 class="mb-4">🧺 나와 잘 맞는 테마는?</h2>

    <!-- 현재 질문 -->
    <ThemeQuestion
      v-if="currentQuestion"
      :question="currentQuestion"
      :step="currentStep"
      :currentAnswer="answers[currentQuestion.id]"
      @answer="handleAnswerChange"
    />

    <!-- 네비게이션 버튼 -->
    <div class="mt-4">
      <b-button variant="secondary" @click="handlePrevious" :disabled="currentStep===0">이전</b-button>
      <b-button variant="primary" class="ms-2" @click="handleNext" :disabled="!answers[currentQuestion?.id]">
        {{ isLastStep ? '결과 보기' : '다음' }}
      </b-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { questions } from '@/data/themeQuestions';
import { getThemeResult } from '@/utils/themeLogic';

import ThemeQuestion from './ThemeQuestion.vue';

const router = useRouter();

const currentStep = ref(0);
const answers = reactive({});

// 현재 질문
const currentQuestion = computed(() => questions[currentStep.value]);

// 마지막 질문 여부
const isLastStep = computed(() => currentStep.value === questions.length - 1);

const handleAnswerChange = (id, value) => {
  answers[id] = value;
};

const handleNext = () => {
  if (!isLastStep.value) {
    currentStep.value++;
  } else {
    const result = getThemeResult(answers);
    router.push({ path: '/themetest/result', query: { result } });
  }
};

const handlePrevious = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};
</script>
