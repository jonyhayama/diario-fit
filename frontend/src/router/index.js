import Vue from 'vue';
import VueRouter from 'vue-router';

// layouts
import dashboardLayout from "../views/layouts/dashboard.vue";
import publicLayout from "../views/layouts/public";

// views
import Home from '../views/public/Home.vue';

// store
import store from "../store";

const publicRoutes = [
  {
    path: "/home",
    name: "home",
    alias: "/",
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/public/About.vue'),
  },
];

const dashboardRoutes = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/index.vue'),
  },
];

const publicGuard = async (to, from, next) => {
  if (store.getters["authentication/status"] === "idle") {
    await store.dispatch("authentication/checkAuthentication");
      
    return publicGuard(to, from, next);
  }

  if (store.getters["authentication/isSignedIn"]) {
    return next({ name: 'dashboard' });
  }

  return next();
}

const dashboardRoutesGuard = async (to, from, next) => {
  if (store.getters["authentication/status"] === "idle") {
    await store.dispatch("authentication/checkAuthentication");
      
    return dashboardRoutesGuard(to, from, next);
  }

  if (!store.getters["authentication/isSignedIn"]) {
    return next({ path: '/' });
  }
  
  return next();
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: publicLayout,
    children: publicRoutes,
    beforeEnter: publicGuard
  },
  {
    path: '/app',
    component: dashboardLayout,
    children: dashboardRoutes,
    beforeEnter: dashboardRoutesGuard
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
