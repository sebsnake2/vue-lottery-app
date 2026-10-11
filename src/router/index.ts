import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import { useAuthStore } from "../stores/auth";

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
        requiresAuth: true,
    },
    },
    {
    path: "/users/new",
    name: "user-create",
    component: () => import("../views/UserCreateView.vue"),
    meta: {
        title: "Add user",
        layout: DefaultLayout,
        requiresAuth: true,
    },
    },
    {
    path: "/users/:id",
    name: "user-details",
    component: () => import("../views/UserDetailsView.vue"),
    props: true,
    meta: {
        title: "User details",
        layout: DefaultLayout,
        requiresAuth: true,
    },
    children: [
        {
        path: "edit",
        name: "user-edit",
        component: () => import("../views/UserEditView.vue"),
        props: true,
        meta: {
            title: "Edit user",
            layout: DefaultLayout,
            requiresAuth: true,
        },
        },
    ],
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

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated
  ) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (
    to.name === "login" &&
    authStore.isAuthenticated
  ) {
    return {
      name: "users",
    };
  }

  return true;
});

router.afterEach((to) => {
  const title = typeof to.meta.title === "string"
    ? to.meta.title
    : "Lottery App";

  document.title = `${title} | Lottery App`;
});

export default router;