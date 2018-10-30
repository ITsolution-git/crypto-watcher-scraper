<template lang="html">
  <div v-bind:class="{'overlay animated-fast fadeIn':visible,'overlay animated-fast fadeOut':!visible}" >
    <div v-bind:class="{'modal-1 animated-fast zoomIn':visible,'modal-1 animated-fast zoomOut':!visible}" style="width: 400px">
      <div class="modal-top">
        <div class="modal-title"> Delete </div>
        <div @click="toggleVisible" class="modal-close"><img src="../../img/close.svg"/></div>
      </div>
      <div class="modal-inner">
        Are you sure you want to delete?
        <div class="modal-btn-container">
          <div @click="toggleVisible" id="cancel-btn" class="modal-btn cancel">Cancel</div>
          <div @click="del" id="delete-btn"  class="modal-btn delete">Delete</div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
export default {
  name: "confirm_delete",
  props: ["hide", "del"],
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
  }
};
</script>
