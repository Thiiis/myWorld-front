import { ref, onMounted, onUnmounted } from 'vue';

const MOBILE_BREAKPOINT = 768;

// composable 함수는 'use'로 시작하는 것이 관례입니다.
export function useIsMobile() {
  const isMobile = ref(false);

  const checkDevice = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
  };

  // onMounted 훅은 컴포넌트가 마운트된 후에 실행되어
  // window 객체에 안전하게 접근할 수 있게 해줍니다.
  onMounted(() => {
    checkDevice();
    window.addEventListener('resize', checkDevice);
  });

  // onUnmounted 훅은 컴포넌트가 사라질 때 이벤트 리스너를 제거하여
  // 메모리 누수를 방지합니다.
  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice);
  });

  return { isMobile };
}

