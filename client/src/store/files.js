import ApiWrapper from '@/shared/utils/ApiWrapper';
var initialState = {
  files: [],
  file: {}
};
export default {
  state: {
    files: [],
    file: {},
    filesLoading: false
  },
  mutations: {
    SET_FILES: (state, files) => {
      state.files = files;
      state.filesLoading = false;
    },
    SET_FILE: (state, file) => {
      state.file = file;
    },
    loadingFiles: state => {
      state.filesLoading = true;
    },
    resetState: state => {
      state = initialState;
    }
  },
  getters: {},
  actions: {
    getFiles({ state, commit, rootState }, payload) {
      commit("loadingFiles");
      return new Promise(function(resolve, reject) {
        ApiWrapper
          .get("/api/files/" + rootState.user.id + "/" + payload.projectId)
          .then(res => {
            //console.log(res.data);
            commit("SET_FILES", res.data);
            resolve();
          });
      });
    },
    getFile({ state, commit, rootState }, payload) {
      return new Promise(function(resolve, reject) {
        ApiWrapper
          .get(
            "/api/files/" +
              payload.userId +
              "/" +
              payload.projectId +
              "/" +
              payload.fileId
          )
          .then(res => {
            //console.log(res.data);
            commit("SET_FILE", res.data);
            resolve(res.data);
          });
      });
    }
  }
};
