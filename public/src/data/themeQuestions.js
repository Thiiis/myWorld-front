export const questions = [
  {
    id: 'style',
    question: "평소 어떤 스타일로 옷을 입나요?",
    weight: 0.4, // 40%
    options: [
      { value: 'minimal', label: '🖤 미니멀/모노톤 스타일' },
      { value: 'frilly', label: '🎀 프릴/리본이 많은 옷' },
      { value: 'sporty', label: '👟 스포티/캐주얼 스타일' },
      { value: 'dress', label: '👗 원피스/스커트 스타일' },
      { value: 'unique', label: '🌈 개성있고 독특한 스타일' }
    ]
  },
  {
    id: 'self_view',
    question: "내가 생각하는 나는 어떤 사람인가요?",
    weight: 0.25,
    options: [
      { value: 'calm_cool', label: '❄️ 차분하고 쿨한 사람' },
      { value: 'cute_lovely', label: '🥰 귀엽고 사랑스러운 사람' },
      { value: 'active_energetic', label: '⚡ 활발하고 에너지 넘치는 사람' },
      { value: 'elegant_feminine', label: '🌸 우아하고 여성스러운 사람' },
      { value: 'free_independent', label: '🦋 자유롭고 독립적인 사람' }
    ]
  },
  {
    id: 'friend_view',
    question: "친구들이 보는 나는 어떤 사람인가요?",
    weight: 0.2,
    options: [
      { value: 'thoughtful_deep', label: '🤔 신중하고 생각이 깊은 사람' },
      { value: 'aegyo_pure', label: '😇 애교많고 순수한 사람' },
      { value: 'refreshing_frank', label: '😎 시원시원하고 털털한 사람' },
      { value: 'kind_caring', label: '💖 다정하고 배려심 많은 사람' },
      { value: 'strong_confident', label: '💪 개성강하고 당당한 사람' }
    ]
  },
  {
    id: 'color',
    question: "가장 좋아하는 색깔은 무엇인가요?",
    weight: 0.15,
    options: [
      { value: 'monochrome', label: '🖤 블랙/화이트/그레이' },
      { value: 'pink', label: '💗 핑크/코랄/로즈' },
      { value: 'blue', label: '💙 블루/민트/하늘색' },
      { value: 'purple', label: '💜 라벤더/연보라/바이올렛' },
      { value: 'warm', label: '🧡 레드/오렌지/골드' }
    ]
  }
];
