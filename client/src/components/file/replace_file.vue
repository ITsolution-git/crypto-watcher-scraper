<template>
  <div>
    <div class="overlay animated-fast" :class="{'fadeIn': !hidden,'fadeOut':hidden}">
      <div class="modal-1 animated-fast zoomIn" :class="{'zoomIn': !hidden,'zoomOut':hidden}">
          <div class="modal-top">
              <div class="modal-title">Replace File</div>
              <div class="modal-close"><i @click="hideThis" class="fa fa-close"></i></div>
          </div>
          <form @submit.prevent="confirmUpload">
          <div class="modal-inner">
             
              <div class="modal-sub-inner" >
                <div v-if="imageName != 'No Image'" class="image-preview-item"><i class="fa fa-file"></i> {{imageName}} <img @click="removeFile" class="image-preview-delete" src="../../img/close.svg" alt=""></div>
                
                <div :class="{'hide-me': !(imageName == 'No Image'),'upload-file-btn' : (imageName == 'No Image')}" class="cancel modal-btn">
                    <input @change="uploadImage" name="file" style="opacity:0; width:100%; height:100%; position:absolute;top:0;left:0" type="file">
                  Upload Template</div>
              </div>
          </div>
          <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000; margin:15px;">{{errorMessage}}</div>
          <div class="modal-buttons">
              <div @click="hideThis" class="modal-btn cancel">Cancel</div>
              <button class="modal-btn confirm" type="submit"><span v-if="!isLoading">Upload</span> <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/></button>
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
export default {
  name: "replace_file",
  data() {
    return {
      hidden: false,
      imageName: "No Image",
      hasError: false,
      errorMessage: "",
      isLoading: false
    };
  },
  props: ["hide", "uploaded"],
  methods: {
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
    confirmUpload(e) {
      this.isLoading = true;
      var form = event.target;
      var data = new FormData(form);
      data = data.entries();
      var obj = data.next();
      var retrieved = {};
      while (undefined !== obj.value) {
        retrieved[obj.value[0]] = obj.value[1];
        obj = data.next();
      }

      var formData = new FormData();
      formData.append("file", retrieved.file);
      formData.append("userId", this.userId);
      formData.append("projectId", this.$route.params.id);
      var channel = this.$pusher.subscribe("file");
      channel.bind("upload", function(data) {
        console.log(data);
      });

      ApiWrapper
        .post(
          "/api/files/replace/" +
            this.$route.params.projectId +
            "/" +
            this.$route.params.fileId,
          formData,
          {
            headers: auth.getHeaders(),
            onUploadProgress: function(progressEvent) {
              console.log(
                Math.round(progressEvent.loaded * 100 / progressEvent.total)
              );
            }
          }
        )
        .then(
          res => {
            if (res.data.message == "Upload Successful") {
              this.uploaded();
            }
            //console.log(res.data);
          },
          err => {
            this.hasError = true;
            this.isLoading = false;
            if (err.response && err.response.data.errors)
              this.errorMessage = err.response.data.errors.form;
            else if(err.response && err.response.data.error)
              this.errorMessage = err.response.data.errors.message;
            else
              this.errorMessage = 'Something went wrong';
          }
        );
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
