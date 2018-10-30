<template>
  <div class='standard-input-item' :style="'max-width:'+width">

    <div class="standard-input-title">{{field}}</div>

    <v-select
     :id="id" 
     :onChange="change" 
     :name="name"
     :value.sync="value" 
     :options="options" 
     :style="'max-width:'+width"
     :searchable="false"
     >
      <template slot="option" slot-scope="option" >
          <div  style="width:100%;height:100%; position:relative"><i :class="'fa ' + option.icon"></i> {{option.label}}
          <div v-if="option.link != null" @click="$router.push(option.link)" style="position:absolute;width:100%;height:100%;z-index:2000;top:0;left:0;" ></div>
          </div>
          
      </template>
      
    </v-select>

  </div>
</template>
<script>
export default {
  name: "standard_select",
  data: () => ({}),
  props: [
    "type",
    "name",
    "width",
    "field",
    "options",
    "value",
    "onChange",
    "id"
  ],
  computed: {
    options2: function() {
      return this.options;
    }
  },
  methods: {
    change(val) {
      if (this.onChange !== undefined && this.onChange !== "") {
        this.onChange(val.value);
      } else {
      }
    }
  }
};
</script>
<style>
.v-select .dropdown-toggle {
  background: #fff;
  color: #252e32;
  border: solid 1px #eaeaea;
  border-radius: 3px;
  width: 100%;
  margin: 5px 0px;
  font-size: 12pt;
  -webkit-transition: all 0.1s ease;
  transition: all 0.1s ease;
  line-height: 14pt;
}
.v-select .selected-tag {
  position: absolute;
}
.v-select input[type="search"],
.v-select input[type="search"]:focus {
  height: 37px;
}
.v-select .dropdown-toggle .clear {
  top: 9px;
}
.v-select .dropdown-menu {
  overflow-y: auto;
  min-width: 142px;
  border: solid 1px #eaeaea;
  box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 0;
}
.v-select li a {
  padding: 15px;
  color: #688187 !important;
}
.v-select li i {
  color: #688187;
}
.v-select {
  font-family: inherit;
}

.v-select .dropdown-menu > .highlight > a {
  background: #f8fafb;

  font-size: 12pt;
}
.v-select .dropdown-menu .active > a,
.v-select .dropdown-menu .active > a > i {
  color: #00c2f2 !important;
  background: #f8fafb;
}
</style>
