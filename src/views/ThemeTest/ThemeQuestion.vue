<template>
  <b-card class="mb-4">
    <b-card-header>
      <h5 class="mb-0">Q{{ step + 1 }}. {{ question.question }}</h5>
    </b-card-header>
    <b-card-body>
      <!-- 라디오 버튼 그룹 -->
      <b-form-radio-group
        v-model="localAnswer"
        :options="question.options"
        value-field="value"
        text-field="label"
        @change="onAnswerChange"
        class="d-flex flex-column gap-2"
      >
        <!-- 옵션별 라디오 -->
        <b-form-radio
          v-for="opt in question.options"
          :key="opt.value"
          :value="opt.value"
          class="mb-2"
        >
          {{ opt.label }}
        </b-form-radio>
      </b-form-radio-group>
    </b-card-body>
  </b-card>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  question: Object,
  step: Number,
  currentAnswer: String
});
const emit = defineEmits(['answer']);

const localAnswer = ref(props.currentAnswer);

watch(() => props.currentAnswer, (newVal) => {
  localAnswer.value = newVal;
});

const onAnswerChange = (val) => {
  emit('answer', props.question.id, val);
};
</script>
