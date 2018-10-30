import Vue from "vue";
import Vuex from "vuex";
import jwt_decode from "jwt-decode";
import projectStore from "./projects";
import fileStore from "./files";
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    projectStore,
    fileStore
  },
  // plugins: [createPersistedState()],
  state: {
    user: {}
  },
  getters: {},
  mutations: {
    SET_USER(state, payload) {
      var user = payload;
      this.state.user = user;
      return this.state.user;
    }
  },
  actions: {
    setUser({ dispatch, commit }, payload) {
      commit("SET_USER", payload);
      dispatch("getProjects");
    },
    setToken(context, payload) {
      var decoded = jwt_decode(payload);
      context.commit("SET_USER", decoded);
    }
  }
});
