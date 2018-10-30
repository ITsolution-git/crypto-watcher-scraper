<template>
  <div>
      <div class="overlay animated-fast" :class="{'fadeIn': !hidden,'fadeOut':hidden}">
          <div class="modal-1 animated-fast zoomIn" :class="{'zoomIn': !hidden,'zoomOut':hidden}">
              <div class="modal-top">
                  <div class="modal-title">Add Project</div>
                  <div class="modal-close"><i @click="hideThis" class="fa fa-close"></i></div>
              </div>
              <form @submit.prevent="createProject">
              <div class="modal-inner">
                  <StandardInput
                  field="Project Name"
                  name="project_name"
                  type="text"
                  width="100%"
                  required="true"
                  />
              </div>
              <div class="modal-buttons">
                  <div @click="hideThis" class="modal-btn cancel">Cancel</div>
                  <button type="submit" class="modal-btn confirm"><span v-if="!isLoading">Create</span><img v-if="isLoading" class="spinner" src="../../img/spinner_white.svg" alt=""></button>
              </div>
              </form>
              </div>
          </div>
      </div>
  
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import StandardSelect from "../form_elements/custom_select";
import ApiWrapper from '@/shared/utils/ApiWrapper';
import auth from "../../auth.js";
import { mapActions } from "vuex";
export default {
  name: "add_project",
  data() {
    return {
      hidden: false,
      imageName: "No Image",
      isLoading: false
    };
  },
  $_veeValidate: {
    validator: "new"
  },
  props: ["hide", "create"],
  methods: {
    ...mapActions(["getProjects"]),
    submit() {},
    hideThis() {
      var that = this;
      this.hidden = true;
      setTimeout(function() {
        that.hide();
      }, 300);
    },
    uploadImage(e) {
      //console.log(e.target.files[0].name);
      this.imageName = e.target.files[0].name;
    },
    removeFile() {
      this.imageName = "No Image";
    },
    createProject(e) {
      this.isLoading = true;
      e.preventDefault();
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }
        var form = event.target;
        var data = new FormData(form);
        data = data.entries();
        var obj = data.next();
        var retrieved = {};
        while (undefined !== obj.value) {
          retrieved[obj.value[0]] = obj.value[1];
          obj = data.next();
        }
        retrieved.project_create_date = new Date();

        if (!this.errors.any()) {
          this.isLoading = false;
          ApiWrapper
            .post("/api/projects/" + this.userId + "/add", retrieved, {
              headers: auth.getHeaders()
            })
            .then(
              res => {
                var id = res.data.insertedIds[0];
                this.getProjects().then(res2 => {
                  this.$router.push("/projects/" + id);
                  this.create();
                });
              },
              err => {
                console.log(err);
              }
            );
        } else {
        }
      });
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    }
  },
  components: {
    StandardInput,
    StandardSelect
  }
};
</script>
<style>
</style>
