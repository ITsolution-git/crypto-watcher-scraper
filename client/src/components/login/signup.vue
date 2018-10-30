<template lang="html">
  <div v-bind:class="{'overlay animated-fast fadeIn':visible,'overlay animated-fast fadeOut':!visible}" >
    <div v-bind:class="{'modal-1 animated-fast zoomIn':visible,'modal-1 animated-fast zoomOut':!visible}" style="width: 400px">
      <form class="login-form" @submit.prevent="submitForm">
      <div class="logo-container">
        <img class="small-logo" src="../../img/brain.svg" alt="">
      </div>
      <img class="logo" src="../../img/logo_1.png" alt="">
      <div class="login-panel-title">Signup For CommonBrain</div>
        <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fa fa-user-circle-o" /></div>
            <input v-validate="'required'" type="text" id="username" name="username" placeholder="Username" class="css-login-input-input" />
        </div>
        <span v-show="errors.has('username')" class="help is-danger">{{ errors.first('username') }}</span>
        <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fa fa-envelope" /></div>
            <input v-validate="'required'" type="text" id="email" name="email" placeholder="Email" class="css-login-input-input" />
        </div>
        <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
        <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fa fa-lock" /></div>
            <input v-validate="'required'" type="password" id="password" name="password" placeholder="Password" class="css-login-input-input" />
            
        </div>
        <span v-show="errors.has('password')" class="help is-danger signup-error">{{ errors.first('password') }}</span>
    
    <div class="modal-btn-container">
        <div @click="toggleVisible" class="modal-btn cancel">Cancel</div>
    <button class="modal-btn confirm" type="submit"><span v-if="!isLoading">Signup</span> <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/></button>
    
    </div>
    <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000; text-align:center; clear:both">{{errorMessage}}</div>
    
    </form>
    </div>
    </div>
</template>
<script>
import auth from "../../auth";
export default {
  name: "signup_form",
  props: ["hide", "login"],
  data() {
    return {
      visible: true,
      hasError: false,
      isLoading: false,
      errorMessage: ""
    };
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  methods: {
    toggleVisible() {
      var that = this;
      this.visible = false;
      setTimeout(function() {
        that.hide();
      }, 300);
    },
    submitForm() {
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
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }

        if (!this.errors.any()) {
          auth.signup(retrieved).then((res) => {
            console.log(res.data);
          }).catch(err => {
            this.isLoading = false;
            this.hasError = true;
            this.errorMessage = err.response.data.error;
          });
        }
      });
    }
  }
};
</script>
<style>
.signup-error{
  margin-bottom:10px;
}
</style>
