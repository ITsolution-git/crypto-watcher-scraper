<template lang="html">
  <div class="overlay animated-fast fadeIn" >
    <div class="modal-1 animated-fast zoomIn" style="width: 400px">
      <div class="modal-top">
        <div class="modal-title">Select Image Source</div>
        <div v-on:click="hide" class="modal-close"><img src="../../img/close.svg"/></div>
      </div>
      <div class="modal-inner">
        

        <div class="modal-btn-container">
          <div @click="hide"  class="modal-btn cancel">Cancel</div>
          <div @click="crop()"  class="modal-btn confirm">Confirm</div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
import ApiWrapper from '@/shared/utils/ApiWrapper';
//import auth from "../../auth";
export default {
  props: ["hide", "upload"],
  data() {
    return {
      cropped: null,
      pic: false
    };
  },
  methods: {
    uploadImage() {
      this.pic = true;
      var that = this;
      setTimeout(function() {
        var reader = new FileReader();
        reader.onload = function(e) {
          that.$refs.croppieRef.bind({
            url: e.target.result
          });
        };
        reader.readAsDataURL(that.$refs.imageUpload.files[0]);
      }, 100);
    },
    bind() {
      // Randomize cat photos, nothing special here.
      //let url = this.images[Math.floor(Math.random() * 4)];
      // Just like what we did with .bind({...}) on
      // the mounted() function above.
      // this.$refs.croppieRef.bind({
      //   url: url
      // });
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    crop() {
      const options = {
        format: "jpeg",
        circle: false
      };
      this.$refs.croppieRef.result(options, output => {
        this.cropped = output;
        var file = this.dataURLtoFile(this.cropped, "file.jpg");
        var formData = new FormData();
        formData.append("file", file);
        ApiWrapper
          .post(
            "/api/files/" +
              this.userId +
              "/" +
              this.projectId +
              "/" +
              this.fileId +
              "/image",
            formData
          )
          .then(res => {
            //console.log(res.data);
            window.location.reload();
          });
      });
    },
    cropViaEvent() {
      //this.$refs.croppieRef.result(options);
    },
    result(output) {
      this.cropped = output;
    },
    update(val) {},
    rotate(rotationAngle) {
      // Rotates the image
      this.$refs.croppieRef.rotate(rotationAngle);
    },
    confirmUpload() {}
  },
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },
    userId() {
      return this.$store.state.user.id;
    },
    fileId() {
      return this.$route.params.fileId;
    }
  }
};
</script>
<style>
.hide {
  opacity: 0;
  pointer-events: none;
  position: absolute;
}
</style>
