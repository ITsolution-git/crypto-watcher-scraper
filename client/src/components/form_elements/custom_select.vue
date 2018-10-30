<template>
  <div :class="containerClass" :style="'width:'+width" style="margin:2px;">
      <div class="standard-input-title">{{field}}</div>
      <div v-click-outside="hideOpen" @click="toggleOpen" class="custom-select-container" :class="{'open':open,'input': true, 'is-danger': errors.has(name)}" :style="{width:width}">
          <input :id="id" :value="selectedOption.value"  :name="name" ref="input" v-validate="isRequired" type="text" style="display:none" />
          
          <div  class="custom-select-field">{{selectedOption.label}}</div>
          <i class="fa fa-angle-down"></i>
          <div v-if="open" class="custom-select-options animated-fast fadeInDown">
              <ul>
                  <li v-for="(option, i) in options" :key="i" @click="selectOption(option)">{{option.label}}</li>
              </ul>
          </div>
      </div>
      <span v-show="errors.has(name)" class="help is-danger">{{ errors.first(name) }}</span>
  </div>
</template>
<script>
export default {
  name: "custom_select",
  props: [
    "id",
    "field",
    "name",
    "width",
    "options",
    "value",
    "containerClass",
    "required",
    "onChange"
  ],
  inject: ["$validator"],
  data() {
    return {
      open: false,
      selectedOption: {},
      isRequired: ""
    };
  },
  methods: {
    toggleOpen() {
      this.open = !this.open;
    },
    hideOpen() {
      this.open = false;
    },
    selectOption(option) {
      this.selectedOption = option;

      var that = this;
      setTimeout(function() {
        that.$validator.validateAll();
        that.onChange(option);
      }, 1);
    }
  },
  computed: {},
  mounted() {
    if (this.value != null) {
      this.selectedOption = this.value;
    } else {
      this.selectedOption = "";
    }
    if (this.required) {
      this.isRequired = "required";
    }
  },
  watch: {
    // value(val) {
    //   if (val != this.selectedOption) {
    //     this.selectedOption = val;
    //   }
    // }
  }
};
</script>
<style>
.custom-select-container {
  display: flex;
  align-items: center;
  padding: 10px;
  position: relative;
  height: 40px;
  border: solid 1px #eaeaea;
  border-radius: 3px;
  background: #fff;
}
.custom-select-container.open {
  border-color: #66d0f7;
}
.custom-select-field {
  font-size: 12pt;
  color: #000;
}
.custom-select-container i {
  margin-left: auto;
  transition: all 0.3s ease;
}
.custom-select-container.open i {
  transform: rotate(180deg);
}
.custom-select-options {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
}
.custom-select-options li {
  padding: 10px;
  font-size: 10pt;
  user-select: none;
}
.custom-select-options li:hover {
  background: #f8fafb;
  cursor: pointer;
}
</style>


