<template lang="html">
  <div v-bind:class="{'overlay animated-fast fadeIn':visible,'overlay animated-fast fadeOut':!visible}" >
    <div v-bind:class="{'modal-1 animated-fast zoomIn':visible,'modal-1 animated-fast zoomOut':!visible}" style="width: 400px">
      <form class="learn-more-form" @submit.prevent="submitForm">
      <div class="logo-container">
        <img class="small-logo" src="../../img/brain.svg" alt="">
      </div>
      <img class="logo" src="../../img/logo_1.png" alt="">
      <div class="login-panel-title">Learn More</div>
      <div class="modal-inner">
          Enter your email below and someone will contact you with more information regarding how to get started using CommonBrain.
    </div>
        <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fa fa-envelope-o" /></div>
            <input v-validate="'required'" type="text" id="email" name="email" placeholder="email" class="css-login-input-input" />
            
        </div>
<span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
    
    <div class="modal-btn-container">
        <div @click="toggleVisible" class="modal-btn cancel">Cancel</div>
    <button class="modal-btn confirm" type="submit">Send</button>
    <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000">{{errorMessage}}</div>
    </div>
    
    </form>
    </div>
    </div>
</template>
<script>
import ApiWrapper from '@/shared/utils/ApiWrapper';
export default {
  name: "learn_more",
  props: ["hide", "del"],
  data() {
    return {
      visible: true,
      hasError: false
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
          ApiWrapper.post("/api/learnmore", retrieved).then(res => {
            this.toggleVisible();
          });
        }
      });
    }
  }
};
</script>
<style>
.learn-more-form {
  width: 100%;
  padding: 15px 15px;
  padding-top: 45px;
  overflow: hidden;
}
</style>

