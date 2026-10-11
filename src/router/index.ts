import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: {
        title: "Home",
        layout: DefaultLayout,
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: "About",
        layout: DefaultLayout,
      },
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/UsersView.vue"),
      meta: {
        title: "Users",
        layout: DefaultLayout,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        title: "Login",
        layout: AuthLayout,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        title: "404",
        layout: DefaultLayout,
      },
    },
  ],
});

router.afterEach((to) => {
  const title = typeof to.meta.title === "string"
    ? to.meta.title
    : "Lottery App";

  document.title = `${title} | Lottery App`;
});

export default router;