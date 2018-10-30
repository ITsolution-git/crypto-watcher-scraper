import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/login/login";
import ProfileRoutes from "./profile";
import ProjectRoutes from "./project";
import FileRoutes from "./file";
import OfacRoutes from "./ofac";
//import { store } from "../store/store.js";


import Scraper from "@/components/scraper";

var baseRoutes = [
  {
    path: "/",
    components: {
      login: Scraper
    }
  }
];

const routes = baseRoutes
  // .concat(ProfileRoutes)
  // .concat(ProjectRoutes)
  // .concat(FileRoutes)
  // .concat(OfacRoutes);

Vue.use(Router);

var router = new Router({
  routes: routes
});

router.beforeEach((to, from, next) => {
  return next();
});

export default router;
