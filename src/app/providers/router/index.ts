import {
  createRouter,
  createWebHashHistory,
} from "vue-router";
import DefaultLayout from "@/app/layouts/DefaultLayout.vue";
import AuthLayout from "@/app/layouts/AuthLayout.vue";
import { useSessionStore } from "@/entities/session";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/home/ui/HomePage.vue"),
      meta: {
        title: "Home",
        layout: DefaultLayout,
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/pages/about/ui/AboutPage.vue"),
      meta: {
        title: "About",
        layout: DefaultLayout,
      },
    },
    {
    path: "/users",
    name: "users",
    component: () => import("@/pages/users/ui/UsersPage.vue"),
    meta: {
        title: "Users",
        layout: DefaultLayout,
        requiresAuth: true,
    },
    },
    {
    path: "/users/new",
    name: "user-create",
    component: () => import("@/pages/users/ui/UserCreatePage.vue"),
    meta: {
        title: "Add user",
        layout: DefaultLayout,
        requiresAuth: true,
    },
    },
    {
    path: "/users/:id",
    name: "user-details",
    component: () => import("@/pages/user-details/ui/UserDetailsPage.vue"),
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
        component: () => import("@/pages/user-details/ui/UserEditPage.vue"),
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
      component: () => import("@/pages/login/ui/LoginPage.vue"),
      meta: {
        title: "Login",
        layout: AuthLayout,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/not-found/ui/NotFoundPage.vue"),
      meta: {
        title: "404",
        layout: DefaultLayout,
      },
    },
  ],
});

router.beforeEach((to) => {
  const sessionStore = useSessionStore();

  if (
    to.meta.requiresAuth &&
    !sessionStore.isAuthenticated
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
    sessionStore.isAuthenticated
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