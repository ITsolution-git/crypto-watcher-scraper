<template>
    <div>
        <Sidebar />
        <div class="profile-container">
            <div class="main-title">User Profile</div>
            <div class="profile-top-row">
              <div class="profile-image">
                <div @mouseover="imageHover" @mouseout="imageHover" class="profile-image-image">
                  <div v-if="imageHovered" class="image-overlay animated-fast fadeIn"><span class="animated-fast fadeInDown"><i class="fa fa-camera"></i> Change</span></div>
                  <img style="width:100%;" src="../../img/swany.jpg" alt="">
                </div>
                <div class="profile-image-title">Profile Image</div>
              </div>
              <div class="profile-details">
                <div class="profile-detail-item">
                  <div class="profile-detail-title">Name</div>
                  <div class="profile-detail-value">Swany Lopez</div>
                  <div class="profile-detail-change-btn"><i class="fa fa-pencil"></i></div>
                </div>
                <div class="profile-detail-item">
                  <div class="profile-detail-title">Email</div>
                  <div class="profile-detail-value">Swanylopez@gmail.com</div>
                  <div class="profile-detail-change-btn"><i class="fa fa-pencil"></i></div>
                </div>
                <div class="profile-detail-item">
                  <div class="profile-detail-title">Other Detail</div>
                  <div class="profile-detail-value">Subscriptions</div>
                  <div class="profile-detail-change-btn"><i class="fa fa-pencil"></i></div>
                </div>
              </div>
              <div class="profile-other">
                <div class="profile-detail-item">
                  <div class="profile-detail-title">Member Since</div>
                  <div class="profile-detail-value">12/01/2017</div>
                  
                </div>
                <div class="profile-detail-item">
                  <div class="profile-detail-title">Name</div>
                  <div class="profile-detail-value">Swany Lopez</div>
                  
                </div>
                
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import Sidebar from "./sidebar";
export default {
  name: "profile",
  data() {
    return {
      imageHovered: false
    };
  },
  components: {
    Sidebar
  },
  mouted() {},
  methods: {
    imageHover() {
      this.imageHovered = !this.imageHovered;
    }
  },
  computed: {}
};
</script>
<style>
.profile-top-row {
  display: flex;
  height: 300px;
  position: relative;
  align-items: center;
  background-image: url(../../img/neural_net2.jpg);
  background-size: cover;
  background-position: center;
}
.profile-image {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 15px;
  padding: 55px;
  align-items: center;
  justify-content: center;
}
.profile-image-image {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 1px 21px 34px -12px rgba(0, 0, 0, 0.6);
  max-height: 200px;
  max-width: 200px;
  border-radius: 300px;
}
.profile-image-title {
  font-size: 12pt;
  font-weight: 500;
  margin-top: 10px;
}
.profile-details {
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: start;
}
.image-overlay {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.image-overlay span {
  border: solid 1px #808080;
  border-radius: 3px;
  padding: 7px 10px;
}
.profile-detail-item {
  width: 100%;
  position: relative;
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: start;
  border: solid 1px transparent;
  transition: all 0.2s ease;
}
.profile-detail-item:hover {
  background: #fff;
  border: solid 1px #eaeaea;
  border-radius: 3px;
}
.profile-detail-change-btn {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  display: flex;
  align-items: center;
  right: 0;
  top: 0;
  margin-right: 15px;
  height: 100%;
  transition: all 0.2s ease;
}
.profile-detail-change-btn i {
  color: #d0d0d0;
  border: solid 1px #eaeaea;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 35px;
  font-size: 10pt;
}
.profile-detail-item:hover .profile-detail-change-btn {
  opacity: 1;
  pointer-events: unset;
}
.profile-detail-item:hover .profile-detail-title {
  color: #66d0f7;
}
.profile-other {
  margin-left: auto;
  display: flex;
  align-items: start;
  flex-direction: column;
  padding: 55px;
}
.profile-detail-title {
  font-weight: 500;
  transition: all 0.2s ease;
}
.profile-detail-value {
  font-weight: 300;
}
</style>
