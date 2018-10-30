<template>
  <div style="margin:2px;">
      <div class="standard-input-title">{{field}}</div>
      <div v-click-outside="hideOpen" @click="toggleOpen" class="custom-select-container" :class="{'open':open,'input': true, 'is-danger': errors.has(name)}" :style="{width:width, maxWidth:width, paddingLeft:'0px'}">
          <input style="display:none" v-for="(option, i) in selectedOptions" :value="option.value" :key="i" :name="name" type="checkbox" checked/>
          <div  class="custom-select-field">
            <div v-for="(option,i) in selectedOptions" :key="i" class="multi-select-option">{{truncate(option.label)}} <div @click.stop="removeOption(i)" class="multi-select-remove"><img src="../../img/close.svg" alt=""></div></div>
          </div>
          <i class="fa fa-angle-down"></i>
          <div v-if="open" class="custom-select-options animated-fast fadeInDown">
              <ul>
                  <li v-for="(option, i) in allOptions" :key="i" @click="selectOption(i)">{{option.label}}</li>
              </ul>
          </div>
      </div>
      <span v-show="errors.has(name)" class="help is-danger">{{ errors.first(name) }}</span>
  </div>
</template>
<script>
export default {
  name: "custom_select",
  props: ["field", "name", "width", "options", "value", "required"],
  inject: ["$validator"],
  data() {
    return {
      open: false,
      selectedOptions: [],
      isRequired: "",
      allOptions: []
    };
  },
  methods: {
    truncate(string) {
      if (string.length > 5) return string.substring(0, 5) + "...";
      else return string;
    },
    toggleOpen() {
      this.open = !this.open;
    },
    hideOpen() {
      this.open = false;
    },
    selectOption(optionIndex) {
      this.selectedOptions.push(this.allOptions[optionIndex]);
      this.allOptions.splice(optionIndex, 1);
    },
    removeOption(optionIndex) {
      this.allOptions.push(this.selectedOptions[optionIndex]);

      this.selectedOptions.splice(optionIndex, 1);
    }
  },
  computed: {},
  mounted() {
    this.allOptions = this.options;
    if (this.value != null) {
      this.selectedOption = this.value;
    } else {
      this.selectedOption = "";
    }
    if (this.required) {
      this.isRequired = "required";
    }
  }
};
</script>
<style>
.multi-select-option {
  background: #fff;
  border-radius: 3px;
  margin: 5px;
  font-size: 10pt;
  color: #66d0f7;
  border: solid 1px #66d0f7;
  padding: 2px 5px;
  display: flex;
  align-items: center;
}
.multi-select-option:nth-child(2n) {
}
.multi-select-remove {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
}
.multi-select-remove img {
  width: 20px;
  margin-left: 5px;
  padding: 5px;
}
</style>
