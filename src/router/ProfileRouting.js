const routes = [
  {
    // '/profiles' 라는 공통 경로를 사용합니다.
    path: 'profile',
    // 위에서 생성한 ProfileLayout 컴포넌트를 부모로 지정합니다.
    component: () => import('@/views/Profile/Profile.vue'),
    meta: { theme: 'profile' },
    // '/profiles'로 직접 접근 시, 기본으로 보여줄 페이지를 설정할 수 있습니다.
    // 예를 들어, 로그인한 사용자의 프로필로 리다이렉트 할 수 있습니다.
    // redirect: '/profiles/detail/me', 
    children: [
      {
        // 프로필 조회 페이지
        // 최종 경로: /profiles/detail/:account
        path: 'detail',
        name: 'ProfileView',
        component: () => import('@/views/Profile/ProfileView.vue'),
        meta: { theme: 'profile' }
      },
      {
        // 프로필 편집 페이지
        // 최종 경로: /profiles/edit
        path: 'edit',
        name: 'ProfileEdit',
        component: () => import('@/views/Profile/ProfileEditView.vue'),
        meta: { theme: 'profile' }
      }
    ],
  },
];

export default routes;
