const routes = [
  {
    path: '/themetest',
    component: () => import(
      /* webpackChunkName: "ThemeTest" */ 
      '@/views/ThemeTest/ThemeTestPage.vue'
    )
  },
  {
    path: '/themetest/result',
    component: () => import(
      /* webpackChunkName: "ThemeTest" */ 
      '@/views/ThemeTest/ThemeResult.vue'
    ),
    props: route => ({ result: route.query.result }) 
    // /themetest/result?result=cutie 이런식으로 받음
  }
];

export default routes;
