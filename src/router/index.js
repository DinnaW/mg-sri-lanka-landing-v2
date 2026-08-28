import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  // GitHub Pages serves this app from /mg-sri-lanka-landing/.
  // Using Vite's BASE_URL makes Vue Router strip that repository
  // prefix before matching the '/' route.
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;

    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }

    return { top: 0, left: 0 };
  },
});

export default router;
