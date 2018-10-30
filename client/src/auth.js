import ApiWrapper from '@/shared/utils/ApiWrapper';
import router from "./router";
//import config from "./config.json";
import jwt_decode from "jwt-decode";
import { store } from "./store/store.js";
export default {
  user: {
    authenticated: false
  },
  login(creds) {
    return new Promise((resolve, reject) => {
      ApiWrapper.post("/api/auth", creds).then(
        res => {
          localStorage.setItem("token", res.data.token);
          this.user.authenticated = true;
          router.push("/projects");
          var decoded = jwt_decode(res.data.token);
          store.dispatch("setUser", decoded);
          resolve(decoded);
        },
        err => {
          reject(err);
        }
      );
    });
  },
  signup(creds) {
    return new Promise((resolve, reject) => {
      ApiWrapper.post("/api/auth/signup", creds).then(
        res => {
          localStorage.setItem("token", res.data.token);
          this.user.authenticated = true;
          router.push("/projects");
          var decoded = jwt_decode(res.data.token);
          store.dispatch("setUser", decoded);
          resolve(decoded);
        },
        err => {
          reject(err);
        }
      );
    });
  },

  getHeaders() {
    var token = localStorage.getItem("token");
    var headers = {
      Accept: "application/json",
      Authorization: "Bearer " + token
    };
    return headers;
  },
  checkAuth() {
    var jwt = localStorage.getItem("token");
    if (jwt) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  },
  logout() {
    localStorage.removeItem("token");
    this.user.authenticated = false;
    store.dispatch("setUser", {});

    router.push("/");
    window.location.reload();
  }
};
