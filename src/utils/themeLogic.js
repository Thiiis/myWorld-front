export function getThemeResult(answers) {
  // 점수 초기화 (영문 키)
  const scores = { chic: 0, cutie: 0, cool: 0, feminine: 0, wild: 0 };

  // 1. 평소 옷 스타일
  const styleWeights = {
    minimal: { chic: 3, cool: 1 },
    frilly: { cutie: 3, feminine: 1 },
    sporty: { cool: 3, wild: 1 },
    dress: { feminine: 3, cutie: 1 },
    unique: { wild: 3, chic: 1 }
  };
  if (answers.style && styleWeights[answers.style]) {
    const weights = styleWeights[answers.style];
    Object.entries(weights).forEach(([theme, score]) => {
      scores[theme] += score;
    });
  }

  // 2. 내가 보는 나
  const selfViewWeights = {
    calm_cool: { chic: 2, cool: 2 },
    cute_lovely: { cutie: 3 },
    active_energetic: { cool: 2, wild: 2 },
    elegant_feminine: { feminine: 3 },
    free_independent: { wild: 2, chic: 2 }
  };
  if (answers.self_view && selfViewWeights[answers.self_view]) {
    const weights = selfViewWeights[answers.self_view];
    Object.entries(weights).forEach(([theme, score]) => {
      scores[theme] += score;
    });
  }

  // 3. 친구가 보는 나
  const friendViewWeights = {
    thoughtful_deep: { chic: 2, feminine: 1 },
    aegyo_pure: { cutie: 3, feminine: 1 },
    refreshing_frank: { cool: 3, wild: 1 },
    kind_caring: { feminine: 2, cutie: 2 },
    strong_confident: { wild: 3, chic: 1 }
  };
  if (answers.friend_view && friendViewWeights[answers.friend_view]) {
    const weights = friendViewWeights[answers.friend_view];
    Object.entries(weights).forEach(([theme, score]) => {
      scores[theme] += score;
    });
  }

  // 4. 좋아하는 색깔
  const colorWeights = {
    monochrome: { chic: 3 },
    pink: { cutie: 3 },
    blue: { cool: 3 },
    purple: { feminine: 3 },
    warm: { wild: 3 }
  };
  if (answers.color && colorWeights[answers.color]) {
    const weights = colorWeights[answers.color];
    Object.entries(weights).forEach(([theme, score]) => {
      scores[theme] += score;
    });
  }

  // 가장 높은 점수의 테마 반환 (영문 키)
  const maxScore = Math.max(...Object.values(scores));
  const resultTheme = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];

  return resultTheme || "chic";
}
