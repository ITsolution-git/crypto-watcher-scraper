<template lang="html">
  <div v-bind:class="{'overlay animated-fast fadeIn':visible,'overlay animated-fast fadeOut':!visible}" >
    <div v-bind:class="{'modal-1 animated-fast zoomIn':visible,'modal-1 animated-fast zoomOut':!visible}" style="max-width: 80%; ">
      <div class="modal-top">
        <div class="modal-title"> PDF </div>
        <div @click="toggleVisible" class="modal-close"><img src="../../img/close.svg"/></div>
      </div>
      <div class="modal-inner" style="height:80vh;">
        <div class="data-container">
            <div v-for="(file, i) in allData" :key="i" class="datablock">
                <span>{{file[i]}}</span>
            </div>
            
        </div>
        <div class="modal-btn-container">
          <div @click="toggleVisible" id="cancel-btn" class="modal-btn cancel">Cancel</div>
          <div id="delete-btn"  class="modal-btn confirm">Export</div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
export default {
  name: "confirm_delete",
  props: ["hide"],
  data() {
    return {
      visible: true
    };
  },
  methods: {
    toggleVisible() {
      var that = this;
      this.visible = false;
      setTimeout(function() {
        that.hide();
      }, 300);
    }
  },
  computed: {
    allData() {
      return this.$store.state.fileStore;
    }
  }
};
</script>
<style>
.data-container {
  max-height: 100%;
  overflow: auto;
  background: #fff;
}
.datablock {
  height: 300px;
  margin-bottom: 15px;
  width: 100%;
  background: #f8fafb;
}
</style>

